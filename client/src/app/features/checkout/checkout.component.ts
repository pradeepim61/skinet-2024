import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { StripeService } from '../../core/services/stripe.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatCard } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { AccountService } from '../../core/services/account.service';
import { firstValueFrom } from 'rxjs';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderToCreate, ShippingAddress } from '../../shared/models/order';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [OrderSummaryComponent, MatStepperModule, RouterLink,
    MatButton, MatCheckboxModule,
    CheckoutDeliveryComponent, CheckoutReviewComponent, CurrencyPipe, MatProgressSpinnerModule, JsonPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeservice = inject(StripeService);
  private snackbar = inject(SnackbarService);
  private accountService = inject(AccountService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  cartService = inject(CartService);
  completionStatus = signal<{ address: boolean, card: boolean, delivery: boolean }>({
    address: false, card: false, delivery: false
  })

  confirmationToken?: ConfirmationToken;

  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAdress = false;
  loading = false;

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeservice.createAddressElements();
      this.paymentElement = await this.stripeservice.createPaymentElement();
      this.addressElement.mount('#address-element');
      this.paymentElement.mount('#payment-element');
      this.addressElement.on('change', this.handleAddressChange);
      this.paymentElement.on('change', this.handlePaymentChange);
    } catch (error: any) {
      this.snackbar.error(error.message);
    }
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.card = event.complete;
      return state;
    })
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state;
    })
  }

  handleDeliveryChange(event: boolean) {
    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    })
  }

  ngOnDestroy(): void {
    this.stripeservice.disposeElements();
  }

  onSaveAdressCheckboxChange(event: MatCheckboxChange) {
    this.saveAdress = event.checked;
  }

  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus()).every(status => status === true)) {
        const result = await this.stripeservice.createConfirmationToken();
        if (result.error) {
          // console.log(result.error.message);
          throw new Error(result.error.message);
        }
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken);
      }
    } catch (error: any) {
      this.snackbar.error(error.message);
    }

  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAdress) {
        const address = await this.getAdressFromStripe() as Address;
        address && firstValueFrom(this.accountService.updateAdress(address));
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeservice.createOrUpdatePaymentIntent());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripeservice.confirmationPayment(this.confirmationToken);

        if (result.paymentIntent?.status === 'succeeded') {
          const order = await this.createOrderModel();
          const orderResult = await firstValueFrom(this.orderService.createOrder(order));
          if (orderResult) {
            this.orderService.orderComplete = true;
            this.cartService.deletecart();
            this.cartService.selectedDelivery.set(null);
            this.router.navigateByUrl('/checkout/success');
          }
          else {
            throw new Error('Order Creation failed');
          }
        } else if (result.error) {
          throw new Error(result.error.message);
        }
      }
    } catch (error: any) {
      this.snackbar.error(error.message || 'Something went wrong');
      stepper.previous();
    }
    finally {
      this.loading = false;
    }
  }

  private async createOrderModel(): Promise<OrderToCreate> {
    const cart = this.cartService.cart();
    const shippingAddress = await this.getAdressFromStripe() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;

    if (!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress) {
      throw new Error('Problem creating order');
    }
    return {
      cartId: cart.id,
      paymentSummary: {
        last: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        year: card.exp_year
      },
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress
    }
  }

  private async getAdressFromStripe(): Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
        name: result.value.name,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code
      }
    }
    else {
      return null;
    }
  }

}

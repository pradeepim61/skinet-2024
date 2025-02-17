import { Component, inject, input } from '@angular/core';
import { Cartitem } from '../../../shared/models/cart';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [RouterLink, MatButton, MatIcon, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<Cartitem>();
  cartService = inject(CartService);

  incrementQuantity(){
    this.cartService.addItemToCart(this.item());
  }

  decrementQuantity(){
    this.cartService.removeItemToCart(this.item().productId);
  }

  removeItemFromCart(){
    this.cartService.removeItemToCart(this.item().productId, this.item().quantity);
  }

}

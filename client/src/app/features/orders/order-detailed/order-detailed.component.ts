import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order } from '../../../shared/models/order';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from "../../../shared/pipes/address.pipe";
import { PaymentPipe } from "../../../shared/pipes/payment.pipe";
import { AdminService } from '../../../core/services/admin.service';
import { AccountService } from '../../../core/services/account.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-order-detailed',
  standalone: true,
  imports: [MatCardModule, MatButton, DatePipe, CurrencyPipe, AddressPipe, PaymentPipe, RouterLink],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  buttonText = this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders';
  order?: Order;

  ngOnInit(): void {
    this.loadOrder();
  }

  onReturnClick() {
    this.accountService.isAdmin() ? this.router.navigateByUrl('/admin') : this.router.navigateByUrl('/orders');
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    const loadOrderData = this.accountService.isAdmin() ? this.adminService.getOrder(+id): 
    this.orderService.getOrderDetailed(+id);

    loadOrderData.subscribe({
      next: order => this.order = order
    })
  }
}

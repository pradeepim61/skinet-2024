import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/products';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatIcon, CurrencyPipe, MatButton, MatFormField, MatInput, 
    MatLabel, MatDivider, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  product?: Product;
  cartService = inject(CartService);
  quantityInCart =0;
  quantity = 1;

  ngOnInit(): void {
    this. loadProduct();
  }
  
  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;
    this.shopService.getProduct(+id).subscribe({
      next: response => {
        this.product = response;
        this.updateQuantity();
      },
      error: error => console.error(error)
    })
  }
  
  updateCart(){
    if(!this.product) return;
    if(this.quantity > this.quantityInCart){
      const additem = this.quantity - this.quantityInCart;
      this.quantityInCart += additem;
      this.cartService.addItemToCart(this.product, additem);
    }
    else{
      const removeitem =  this.quantityInCart - this.quantity;
      this.quantityInCart -= removeitem;
      this.cartService.removeItemToCart(this.product.id, removeitem);
    }
  }

  updateQuantity(){
    this.quantityInCart = this.cartService.cart()?.
    items.find(x=> x.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonText(){
    return this.quantityInCart > 0 ? 'Update Cart': 'Add Cart'
  }

}

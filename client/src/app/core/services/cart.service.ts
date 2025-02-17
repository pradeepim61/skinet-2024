import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, Cartitem } from '../../shared/models/cart';
import { Product } from '../../shared/models/products';
import { map } from 'rxjs';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  selectedDelivery = signal<DeliveryMethod | null>(null);

  itemCount = computed(() =>
    this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  totals = computed(() => {
    const cart = this.cart();
    const delivery = this.selectedDelivery();
    if (!cart) return null;

    const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const shipping = delivery ? delivery.price : 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    }
  })

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  setCart(cart: Cart) {
    //alert("Entered setCart");
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: cart => this.cart.set(cart)
      //next: cart => console.log(cart),
      //error: error => console.log(error)
    })
  }

  addItemToCart(item: Cartitem | Product, quantity = 1) {
    // alert("Entered - addItemToCart");
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addUpdateitems(cart.items, item, quantity);
    //alert("addItemToCart" + cart.items);
    //call the service API.
    this.setCart(cart);
  }

  removeItemToCart(productId: number, quantity = 1) {
    // alert("Entered - addItemToCart");
    const cart = this.cart();
    if (!cart) return;
    const index = cart.items.findIndex(x => x.productId === productId);
    if (index !== -1) {
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      }
      else {
        cart.items.splice(index, 1);
      }
      if (cart.items.length === 0) {
        this.deletecart();
      }
      else {
        //call the service API.
        this.setCart(cart);
      }
    }
  }

  deletecart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      }
    })
  }

  addUpdateitems(items: Cartitem[], item: Cartitem, quantity: number): Cartitem[] {
    const index = items.findIndex(x => x.productId === item.productId);
    // alert("Entered - addUpdateitems");
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    }
    else {
      items[index].quantity += quantity;
    }
    // alert("Exited - addUpdateitems" + items);
    return items;
  }

  mapProductToCartItem(item: Product): Cartitem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private isProduct(item: Cartitem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    //alert("cardId -createcartmethod"+ cart.id);
    return cart;
  }

}

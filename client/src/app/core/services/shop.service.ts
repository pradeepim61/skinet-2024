import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../shared/models/products';
import { Pagination } from '../../shared/models/pagination';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { ShopParams } from '../../shared/models/shopParams';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }

    if (shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }

    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageindex', shopParams.pageNumber);

    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }
    return this.http.get<{ value: Pagination<Product> }>(this.baseUrl + 'products', { params });
  }

  getBrands() {
    if (this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: response => this.brands = response
    })
  }

  getProduct(id: number) {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }
  
  getTypes() {
    if (this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: response => this.types = response
    })
  }


}

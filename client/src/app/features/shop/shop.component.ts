import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../shared/models/products';
import { ShopService } from '../../core/services/shop.service';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductItemComponent, MatButton, MatIcon, MatMenu, MatSelectionList, 
    MatListOption, MatMenuTrigger, MatPaginator, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  //products: Product[] = [];
  products?: Pagination<Product>;
  shopParams = new ShopParams();
  pageSizeOptions = [5,10,15,20];

  sortedOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-high', value: 'priceASC' },
    { name: 'Price: High-Low', value: 'priceDESC' },
  ]

  ngOnInit(): void {
    this.InitializeShop();
  }

  InitializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        // Navigate into the 'value' object to get the actual pagination data
        //const pagination = response.value;
        this.products = response.value; // Access the 'data' array
        //console.log('Products:', this.products); // Debugging log
      },
      error: error => console.log(error)
    })
  }

  onSearchChange(){
    this.shopParams.pageNumber =1;
    this.getProducts();
  }
   
  handlePageEvent(event: PageEvent){
    this.shopParams.pageNumber = event.pageIndex +1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber =1;
      //console.log(this.shopParams.sort);
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber =1;
          //applyfilters.
          this.getProducts();
        }
      }
    })
  }

}


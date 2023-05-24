import { Component, OnInit } from '@angular/core';
import { productsData } from './products';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  searchParam: string = '';
  products: any = productsData.products;
  allProductsData: any;
  status: string = '';
  distribution: string = '';
  allStatus: any[] = [] = [];
  allDistributions: any[] = [];
  searchChange: string = '';
  allSelected: boolean = false;
  isSelected:boolean = false;
  selectProducts: any[] = [];
  constructor(private datePipe: DatePipe) {
    console.log('products:', this.products);

  }


  toggleSelected() {
    this.products.forEach((p: any) => p.selected = this.allSelected);
    this.isSelected = this.allSelected;
    this.selectProducts = this.allSelected ? this.allProductsData : [];
  }


  selectProduct(product: any) {
    if (product.selected) {
      this.selectProducts.push(product);
    }

    else {
      this.selectProducts.splice(this.selectProducts.indexOf(product), 1);
    }
    this.isSelected = this.products.some((p:any) => p.selected);
    this.allSelected = this.products.every((p:any) => p.selected);
  }


  filterProductsByStatus() {
    this.searchChange = 'status';
    this.products = this.allProductsData.filter((p: any) => p.status === this.status);
  }

  filterProductByDistribution() {
    this.searchChange = 'distribution';
    this.products = this.allProductsData.filter((p: any) => p.distribution === this.distribution);
  }

  searchProducts() {
    this.searchChange = 'search';
    if (this.searchParam.trim()) {
      this.products = this.allProductsData.filter((p: any) => {
        return [p?.customer, p?.title].join().toLowerCase().includes(this.searchParam.toLowerCase());
      })
    }

    else {
      this.products = this.allProductsData;
    }
  }

  getProducts() {
    this.products.forEach((p: any) => {
      p.date = this.datePipe.transform(p.date, 'dd MMM yyyy');
      p.selected = false;
    });
    this.allProductsData = JSON.parse(JSON.stringify(this.products));
    this.allStatus = [...new Set(this.products.map((p: any) => p.status))];
    this.allDistributions = [...new Set(this.products.map((p: any) => p.distribution))];
  }

  ngOnInit(): void {
    this.getProducts();
  }


  ngDoCheck(): void {
    this.status = this.searchChange == 'status' ? this.status : '';
    this.distribution = this.searchChange == 'distribution' ? this.distribution : '';
    this.searchParam = this.searchChange == 'search' ? this.searchParam : '';
  }
}

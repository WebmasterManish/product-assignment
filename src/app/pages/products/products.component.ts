import { Component, OnInit } from '@angular/core';
import { productsData } from './products';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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


  //  toggle main checkbox conditions
  toggleSelected() {
    this.products.forEach((p: any) => p.selected = this.allSelected);
    this.isSelected = this.allSelected;
    this.selectProducts = this.allSelected ? this.allProductsData : [];
  }


  //  Product Select
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


  //  filter list by status
  filterProductsByStatus() {
    this.searchChange = 'status';
    this.products = this.allProductsData.filter((p: any) => p.status === this.status);
  }

  //  filter list by distribution
  filterProductByDistribution() {
    this.searchChange = 'distribution';
    this.products = this.allProductsData.filter((p: any) => p.distribution === this.distribution);
  }

  //  search  according to customer and product
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

  //  initialize product data and table
  getProducts() {
    this.products.forEach((p: any) => {
      p.date = this.datePipe.transform(p.date, 'dd MMM yyyy');
      p.selected = false;
    });
    this.allProductsData = JSON.parse(JSON.stringify(this.products));
    this.allStatus = [...new Set(this.products.map((p: any) => p.status))];
    this.allDistributions = [...new Set(this.products.map((p: any) => p.distribution))];
  }

  //   download select products
  downloadOrders(){
  if(this.selectProducts.length){
    let productList = this.selectProducts.map((p:any) =>({
    "Reference Id": p.id,
    Customer:p.customer,
    Product:p.title,
    Date:p.date,
    Distribution:p.distribution,
    Status:p.status,
    Price:p.price
    }))
    this.exportAsExcelFile(productList,'Product List');
  }

  else{
   throw new Error('Can not download excel of empty data');
  }
  }

  //  export excel file methos
   exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

   // save file as excel file
   saveAsExcelFile(buffer: any, fileName: string): void {
     const EXCEL_TYPE: string = 'text/csv;charset=utf-8;';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
     FileSaver.saveAs(data, fileName+'.csv');
  }

  ngOnInit(): void {
    // initialize product data
    this.getProducts();
  }


  //  reset filter value when filter type changes
  ngDoCheck(): void {
    this.status = this.searchChange == 'status' ? this.status : '';
    this.distribution = this.searchChange == 'distribution' ? this.distribution : '';
    this.searchParam = this.searchChange == 'search' ? this.searchParam : '';
  }
}

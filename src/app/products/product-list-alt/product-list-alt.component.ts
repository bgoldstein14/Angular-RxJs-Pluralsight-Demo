import { ChangeDetectionStrategy, Component } from '@angular/core';

import { combineLatest, EMPTY, Subject, Subscription } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  products$ = this.productService.productsWithCategory$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
  );

  // sub: Subscription;
  selectedProduct$ = this.productService.selectedProduct$;

  vm$ = combineLatest([
    this.products$,
    this.selectedProduct$
  ])
    .pipe(
      filter(([products]) => Boolean(products)),
      map(([products, selectedProduct]) =>
        ({ products, selectedProduct }))
    );

  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}

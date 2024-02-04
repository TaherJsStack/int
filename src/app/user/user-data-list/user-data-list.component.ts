import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiIntgrationService } from '../../api-intgration.service';
import { IProduct } from '../../product/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-data-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-data-list.component.html',
  styleUrl: './user-data-list.component.scss'
})
export class UserDataListComponent {
  dataList$!: Observable<IProduct[]>;
	total$: Observable<number>;


  constructor(
    public apiIntgrationService: ApiIntgrationService
  ){
		this.total$ = apiIntgrationService.total$;
    this.dataList$ = this.apiIntgrationService.productsList$;
    
  }
}

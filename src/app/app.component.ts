import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiIntgrationService } from './api-intgration.service';
import { IProduct } from './product/product.interface'
import { Observable } from 'rxjs/internal/Observable';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgbdSortableHeader, SortEvent } from './data/sortable.directive';
import { Country } from './data/country';

import {UserDataListComponent } from './user/user-data-list/user-data-list.component'


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    NgbPaginationModule,
    DecimalPipe, 
    FormsModule, 
    AsyncPipe, 
    NgbHighlight, 
    NgbdSortableHeader, 
    NgbPaginationModule,
    UserDataListComponent
  ],
  

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DecimalPipe],
})
export class AppComponent implements OnInit {
  title = 'angular-intgrate';

  dataList$!: Observable<IProduct[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    public apiIntgrationService: ApiIntgrationService
  ){
		this.total$ = apiIntgrationService.total$;
    this.dataList$ = this.apiIntgrationService.productsList$;
  }

  ngOnInit() { }

  onSort({ column, direction }: SortEvent) {
		// resetting other headers
		this.headers.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.apiIntgrationService.sortColumn = column;
		this.apiIntgrationService.sortDirection = direction;
	}

}

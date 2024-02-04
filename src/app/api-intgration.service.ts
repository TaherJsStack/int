import { HttpClient } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IProduct } from './product/product.interface';
import { debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { SortColumn, SortDirection } from './data/sortable.directive';
import { Country } from './data/country';
import { COUNTRIES } from './data/countries';

interface SearchResult {
	countries: Country[];
	total: number;
}

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(countries: Country[], column: SortColumn, direction: string): Country[] {
	if (direction === '' || column === '') {
		return countries;
	} else {
		return [...countries].sort((a, b) => {
			const res = compare(a[column], b[column]);
			return direction === 'asc' ? res : -res;
		});
	}
}

function matches(country: Country, term: string, pipe: PipeTransform) {
	return (
		country.name.toLowerCase().includes(term.toLowerCase()) ||
		pipe.transform(country.area).includes(term) ||
		pipe.transform(country.population).includes(term)
	);
}

@Injectable({
  providedIn: 'root',
})
export class ApiIntgrationService {

	private _getDataList$ = new Subject<void>();
	private _productsList$ = new BehaviorSubject<IProduct[]>([]);

  	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _countries$ = new BehaviorSubject<Country[]>([]);
	private _total$ = new BehaviorSubject<number>(0);

	private _state: State = {
		page: 1,
		pageSize: 4,
		searchTerm: '',
		sortColumn: '',
		sortDirection: '',
	};

  
  constructor(private http: HttpClient) { 
    this._getDataList$.pipe(
		tap(() => this._loading$.next(true)),
		debounceTime(200),
		switchMap(() => this._getDataList()),
		delay(200),
		tap(() => this._loading$.next(false)),
	)
	.subscribe((result: any) => {
		console.log('result -->', result);
		this._productsList$.next(result.products);
		this._total$.next(result.total);
	});
	this._getDataList$.next()

    // this._search$
	// 		.pipe(
	// 			tap(() => this._loading$.next(true)),
	// 			debounceTime(200),
	// 			switchMap(() => this._search()),
	// 			delay(200),
	// 			tap(() => this._loading$.next(false)),
	// 		)
	// 		.subscribe((result) => {
	// 			this._countries$.next(result.countries);
	// 			this._total$.next(result.total);
	// 		});

	// 	this._search$.next();
  }


	get productsList$() {
		return this._productsList$.asObservable();
	}

	get countries$() {
		return this._countries$.asObservable();
	}
	get total$() {
		return this._total$.asObservable();
	}
	get loading$() {
		return this._loading$.asObservable();
	}
	get page() {
		return this._state.page;
	}
	get pageSize() {
		return this._state.pageSize;
	}
	get searchTerm() {
		return this._state.searchTerm;
	}

	set page(page: number) {
		this._set({ page });
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}
	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}
	set sortColumn(sortColumn: SortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}

	private _set(patch: Partial<State>) {
		console.log("set patch", patch);
	
		Object.assign(this._state, patch);
		this._search$.next();
		this._getDataList$.next();
	}

	private _search(): Observable<SearchResult> {
		const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

		// 1. sort
		let countries = sort(COUNTRIES, sortColumn, sortDirection);

		// 2. filter
		// countries = countries.filter((country) => matches(country, searchTerm, this.pipe));
		const total = countries.length;

		// 3. paginate
		countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
		return of({ countries, total });
	}

  private _getDataList(): Observable<{products: IProduct[], total: number, skip: number, limit: number}> {
	const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

	console.log('this._state -->', this._state)
	let dataList: IProduct[] = [];
    // let params
    const url = `https://dummyjson.com/products?limit=${pageSize}&skip=${page}`;

    return this.http.get<{products: IProduct[], total: number, skip: number, limit: number}>(url)

  }


}



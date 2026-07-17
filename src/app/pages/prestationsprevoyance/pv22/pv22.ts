import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PaginatorComponent } from '../../../shared/paginator/paginator.component';

@Component({
  selector: 'app-prestationsprevoyance-pv22',
  standalone: true,
  imports: [
    FormsModule,
    PaginatorComponent
  ],
  templateUrl: './pv22.html',
  styleUrls: ['./pv22.scss']
})
export class Pv22 implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  ownedCount$ = 100;

  searchQuery = '';

  loading = false;
  loadingSets = true;
  error = '';

  totalCount = 250;
  pageSize = 20;
  currentPage = 1;
  first = 0; // index du premier élément — piloté par le Paginator

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.first = 0;
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSetChange(): void {
    this.currentPage = 1;
    this.first = 0;
  }

  onSetClear(): void {
    this.currentPage = 1;
    this.first = 0;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.first = (page - 1) * this.pageSize;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

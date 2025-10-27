import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-search',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <section class="container">
      <h2>Look around near:</h2>
      <form (submit)="onSubmit(zip, place); $event.preventDefault()" class="search-zipcode">
        <mat-form-field appearance="outline">
          <mat-label>Zipcode</mat-label>
          <input matInput [(ngModel)]="zip" name="zip" placeholder="Enter your zip code" required pattern="^\\d{5,6}$">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Place</mat-label>
          <mat-select [(ngModel)]="place" name="place">
            <mat-option value="atm">ATM</mat-option>
            <mat-option value="bar">Bar</mat-option>
            <mat-option value="hotel">Hotel</mat-option>
            <mat-option value="bus_station">Bus Station</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!isValidZip(zip)">Search</button>
      </form>
    </section>
  `,
})
export class SearchComponent {
  zip = '';
  place = 'atm';

  constructor(private router: Router) {}

  isValidZip(val: string): boolean {
    return /^\d{5,6}$/.test(val || '');
  }

  onSubmit(zip: string, place: string) {
    if (!this.isValidZip(zip)) return;
    this.router.navigate(['/search', zip, place || 'atm']);
  }
}
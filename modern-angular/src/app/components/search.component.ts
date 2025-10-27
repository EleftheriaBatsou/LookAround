import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-search',
  template: `
    <section>
      <h2>Find places around a zipcode</h2>
      <form (submit)="onSubmit(zip.value, place.value); $event.preventDefault()">
        <label>
          Zipcode
          <input type="text" #zip placeholder="Enter zipcode">
        </label>
        <label>
          Place
          <select #place>
            <option value="atm">ATM</option>
            <option value="bar">Bar</option>
            <option value="hotel">Hotel</option>
            <option value="bus-station">Bus Station</option>
          </select>
        </label>
        <button type="submit">Search</button>
      </form>
    </section>
  `,
})
export class SearchComponent {
  constructor(private router: Router) {}

  onSubmit(zipcode: string, place: string) {
    if (!zipcode) return;
    this.router.navigate(['/search', zipcode, place || 'atm']);
  }
}
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapService } from '../services/google-map.service';
import { PlacesService } from '../services/places.service';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-results',
  imports: [CommonModule, RouterLink, FormsModule, MatTabsModule, MatListModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <section class="container">
      <div class="show-searchplace" *ngIf="searchplace">
        <h2>{{ resultTitle(place) }} near {{ searchplace }}</h2>
      </div>

      <div class="layout" style="display:flex; gap: 1rem;">
        <aside style="flex: 0 0 300px;">
          <mat-form-field appearance="outline" class="m-bottom">
            <mat-label>Filter places</mat-label>
            <input matInput [(ngModel)]="searchPlace" placeholder="Type to filter">
          </mat-form-field>

          <mat-nav-list class="places-container">
            <a mat-list-item
               *ngFor="let p of filteredPlaces()"
               [class.active]="activeClass(p)"
               (click)="navigateToPlace(p)"
            >
              {{ p.title }}
            </a>
          </mat-nav-list>
        </aside>

        <section style="flex: 1 1 auto;">
          <mat-tab-group>
            <mat-tab label="Map View">
              <div #mapContainer class="map"></div>
            </mat-tab>
            <mat-tab label="List View">
              <mat-nav-list>
                <a mat-list-item
                   *ngFor="let details of data; index as i"
                   [class.active]="selectedMarker === i"
                   (click)="selectFromList(i)"
                   id="listItem{{i}}">
                  <img [src]="'img/markers/number_' + (i+1) + '.png'" class="list-markers" />
                  <span style="margin-left: 8px;">
                    {{details.name}} — {{details.formatted_address}}
                  </span>
                </a>
              </mat-nav-list>
            </mat-tab>
          </mat-tab-group>
        </section>
      </div>

      <div style="margin-top: 1rem;">
        <a routerLink="/" mat-raised-button>Back</a>
      </div>
    </section>
  `
})
export class ResultsComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  zipcode!: string;
  place!: string;
  searchplace: string | null = null;
  selectedMarker = 0;
  data: any[] = [];
  places: Array<{ title: string; url: string }> = [];
  searchPlace = '';

  private map: any;
  private placeService: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gm: GoogleMapService,
    private placesService: PlacesService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.zipcode = this.route.snapshot.params['zipcode'];
    this.place = this.route.snapshot.params['place'];

    this.places = await this.placesService.fetchPlaces();

    this.map = this.gm.initializeMap(this.mapContainer.nativeElement);
    this.placeService = this.gm.placeService(this.map);

    const geocoder = this.gm.getGeoCoder();
    geocoder.geocode({ address: this.zipcode }, (results: any[], status: string) => {
      if (!results || !results[0]) {
        return;
      }
      const r0 = results[0];
      const lat = r0.geometry.location.lat();
      const lng = r0.geometry.location.lng();

      this.searchplace = r0.formatted_address;

      this.placeService.textSearch({
        query: this.place,
        type: this.place,
        location: new (window as any).google.maps.LatLng(lat, lng),
        radius: 50
      }, (data: any[]) => {
        this.data = data || [];
        this.gm.placeMarkers(this.data);
      });
    });
  }

  ngOnDestroy(): void {}

  filteredPlaces(): Array<{ title: string; url: string }> {
    const q = (this.searchPlace || '').toLowerCase();
    return this.places.filter(p => p.title.toLowerCase().includes(q));
  }

  activeClass(p: { title: string; url: string }): boolean {
    return p.url.slice(1).toLowerCase() === (this.place || '').toLowerCase();
  }

  navigateToPlace(p: { title: string; url: string }): void {
    this.router.navigate(['/search', this.zipcode, p.url.slice(1)]);
  }

  selectFromList(num: number): void {
    this.selectedMarker = num;
    this.gm.zoomToMarker(num);
    this.gm.bounceMarker(num);
  }

  resultTitle(place: string): string {
    let title = '';
    this.places.forEach(r => {
      if (r.url === '/' + place) {
        title = r.title;
      }
    });
    return title || 'Results';
  }
}
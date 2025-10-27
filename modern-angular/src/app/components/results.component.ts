import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapService } from '../services/google-map.service';

@Component({
  standalone: true,
  selector: 'app-results',
  imports: [CommonModule, RouterLink],
  template: `
    <section>
      <a routerLink="/">Back</a>
      <h2>Results near: {{searchplace || '...'}}</h2>

      <div class="tabs">
        <button (click)="mapView()">Map</button>
        <button (click)="listView()">List</button>
      </div>

      <div [hidden]="!tabs.map" class="map-wrapper">
        <div #mapContainer class="map"></div>
      </div>

      <div [hidden]="!tabs.list">
        <ul class="results">
          <li
            *ngFor="let item of data; index as i"
            [class.active]="selectedMarker === i"
            (click)="selectFromList(i)"
            id="listItem{{i}}"
          >
            {{ item.name }} — {{ getLocation(item) }}
          </li>
        </ul>
      </div>
    </section>
  `,
  styles: [`
    .map { width: 100%; height: 400px; background: #eee; }
    .results { list-style: none; padding: 0; }
    .results li { padding: 0.5rem; border-bottom: 1px solid #ddd; cursor: pointer; }
    .results li.active { background: #f5f5f5; }
    .tabs { margin-bottom: 1rem; }
    .tabs button { margin-right: 0.5rem; }
  `]
})
export class ResultsComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  zipcode!: string;
  place!: string;
  searchplace: string | null = null;
  tabs = { map: false, list: true };
  selectedMarker = 0;
  data: any[] = [];

  private map: any;
  private placeService: any;

  constructor(
    private route: ActivatedRoute,
    private gm: GoogleMapService,
  ) {}

  ngOnInit(): void {
    this.zipcode = this.route.snapshot.params['zipcode'];
    this.place = this.route.snapshot.params['place'];

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

  ngOnDestroy(): void {
    // No-op for now
  }

  listView(): void {
    this.tabs = { map: false, list: true };
  }

  mapView(): void {
    this.tabs = { map: true, list: false };
  }

  selectFromList(num: number): void {
    this.mapView();
    this.selectedMarker = num;
    this.gm.zoomToMarker(num);
    this.gm.bounceMarker(num);
  }

  getLocation(details: any): string {
    const location = details?.geometry?.location;
    if (!location) return 'location not available';
    const out: number[] = [];
    Object.values(location).forEach((value: any) => {
      if (typeof value === 'function') {
        // For google maps LatLng, skip methods
        return;
      }
      out.push(Number(value) || 0);
    });
    return `${details.formatted_address || ''}`;
  }
}
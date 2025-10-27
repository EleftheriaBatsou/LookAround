import { Injectable, NgZone } from '@angular/core';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleMapService {
  private map: any;
  private markers: any[] = [];
  selectedMarkerIdx: number | null = null;

  constructor(private zone: NgZone) {}

  initializeMap(elem: HTMLElement, options?: any): any {
    const defaultOptions = {
      zoom: 4,
      center: new google.maps.LatLng(21.508742, -0.120850),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      panControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }
    };
    if (this.map) {
      this.map = undefined;
      this.selectedMarkerIdx = null;
    }
    this.map = new google.maps.Map(elem, options || defaultOptions);
    return this.map;
  }

  getGeoCoder(): any {
    return new google.maps.Geocoder();
  }

  placeService(map: any): any {
    return new google.maps.places.PlacesService(map);
  }

  clearAllMarkers(): void {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
  }

  placeMarkers(data: any[]): void {
    this.clearAllMarkers();
    const bounds = new google.maps.LatLngBounds();
    let count = 1;
    data.forEach((item, key) => {
      const latLng = new google.maps.LatLng(item.geometry.location.lat(), item.geometry.location.lng());
      const icon = { url: `img/markers/number_${count++}.png` };
      const marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        animation: google.maps.Animation.DROP,
        icon
      });
      this.markers.push(marker);
      bounds.extend(latLng);
      google.maps.event.addListener(marker, 'click', () => {
        this.zone.run(() => {
          this.selectedMarkerIdx = key;
        });
      });
    });
    this.map.fitBounds(bounds);
  }

  zoomToMarker(idx: number): void {
    const p = this.markers[idx].getPosition();
    this.map.setCenter(p);
    this.map.setZoom(16);
  }

  bounceMarker(idx: number): void {
    const marker = this.markers[idx];
    this.markers.forEach(m => m.setAnimation(null));
    if (marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}
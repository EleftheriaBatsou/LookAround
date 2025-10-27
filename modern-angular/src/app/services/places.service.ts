import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  async fetchPlaces(): Promise<Array<{ title: string; url: string }>> {
    const res = await fetch('/data/places.json');
    const json = await res.json();
    return json.data || [];
  }
}
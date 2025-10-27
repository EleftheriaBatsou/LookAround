import { Routes } from '@angular/router';
import { SearchComponent } from './components/search.component';
import { ResultsComponent } from './components/results.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'search/:zipcode/:place', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];
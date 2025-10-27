import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-about-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>About LookAround App</h2>
    <div mat-dialog-content>
      <p>LookAround App is a learning project modernized with Angular 18, Material, and Vite.</p>
      <p>It uses Google Maps Places API to find places around a given zipcode.</p>
      <p>Source code is available here: <a href="http://www.github.com/shidhincr/lookaround" target="_blank">GitHub</a></p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `
})
export class AboutDialogComponent {}
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AboutDialogComponent } from './components/about-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatDialogModule],
  template: `
    <mat-toolbar color="primary">
      <span>LookAround (Angular)</span>
      <span class="spacer"></span>
      <button mat-button (click)="openAbout()">About</button>
      <a routerLink="/" mat-button>Home</a>
    </mat-toolbar>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .content { padding: 1rem; }
    .spacer { flex: 1 1 auto; }
  `]
})
export class AppComponent {
  constructor(private dialog: MatDialog) {}

  openAbout(): void {
    this.dialog.open(AboutDialogComponent, {
      width: '500px'
    });
  }
}
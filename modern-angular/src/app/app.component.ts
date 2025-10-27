import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="header">
      <h1>LookAround (Angular)</h1>
      <nav>
        <a routerLink="/" class="link">Home</a>
      </nav>
    </header>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header { padding: 1rem; border-bottom: 1px solid #ddd; }
    .content { padding: 1rem; }
    .link { margin-right: 1rem; }
  `]
})
export class AppComponent {}
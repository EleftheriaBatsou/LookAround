import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SearchComponent } from './search.component';
import { routes } from '../app.routes';
import { Router } from '@angular/router';

describe('SearchComponent', () => {
  it('navigates to results when a valid zip is entered', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const fixture = TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideRouter(routes)]
    }).createComponent(SearchComponent);

    const comp = fixture.componentInstance;
    comp.zip = '560001';
    comp.place = 'atm';
    comp.onSubmit(comp.zip, comp.place);

    expect(navigateSpy).toHaveBeenCalledWith(['/search', '560001', 'atm']);
  });

  it('does not navigate on invalid zip', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const fixture = TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideRouter(routes)]
    }).createComponent(SearchComponent);

    const comp = fixture.componentInstance;
    comp.zip = 'abc';
    comp.place = 'atm';
    comp.onSubmit(comp.zip, comp.place);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
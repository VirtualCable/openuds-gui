import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * The navbar is fixed, so it is out of the flow and the routed content has to
 * step over it on its own. An offset shorter than the bottom edge of the
 * navbar puts the first heading of every page under the bar.
 */
@Component({
  template: `<div class="content"></div>`,
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
class ShellHostComponent {}

describe('app shell layout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [ShellHostComponent] }).compileComponents();
    TestBed.createComponent(ShellHostComponent).detectChanges();
  });

  function pixels(token: string): number {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(token));
  }

  it('starts the content below the bottom edge of the navbar', () => {
    const content = document.querySelector('.content') as HTMLElement;
    const navbarBottom = pixels('--navbar-top') + pixels('--navbar-height');

    expect(navbarBottom).toBeGreaterThan(0);
    expect(parseFloat(getComputedStyle(content).marginTop)).toBeGreaterThan(navbarBottom);
  });
});

// Author: Janier Rodríguez, jrodriguez at virtualcable dot es
import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { UDSApiService } from '../../services/uds-api.service';

class FakeTabHeader {
  _showPaginationControls = false;
  disablePagination = false;
  readonly _tabListInner: { nativeElement: { scrollWidth: number } };
  readonly _elementRef: { nativeElement: { offsetWidth: number } };
  readonly _changeDetectorRef = { markForCheck: () => undefined };

  constructor(scrollWidth: number, offsetWidth: number) {
    this._tabListInner = { nativeElement: { scrollWidth } };
    this._elementRef = { nativeElement: { offsetWidth } };
  }

  _checkPaginationEnabled() {
    const overflow = this._tabListInner.nativeElement.scrollWidth - this._elementRef.nativeElement.offsetWidth;
    this._showPaginationControls = !this.disablePagination && overflow >= 5;
  }

  updatePagination() {
    this._checkPaginationEnabled();
  }
}

describe('ServicesComponent tab pagination', () => {
  // The component reads the django global at module load
  let ServicesComponent: typeof import('./services.component').ServicesComponent;

  beforeAll(async () => {
    (window as any).django = { gettext: (msgid: string) => msgid };
    ({ ServicesComponent } = await import('./services.component'));
  });

  const paginationShownFor = (header: FakeTabHeader): boolean => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UDSApiService, useValue: {} },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
      ],
    });
    const component = TestBed.runInInjectionContext(() => new ServicesComponent());
    component.tabGroup = { _tabHeader: header } as unknown as MatTabGroup;

    (component as unknown as { relaxPaginationThreshold: () => void }).relaxPaginationThreshold();

    return header._showPaginationControls;
  };

  it('shows the arrows for an overflow below the Material threshold', () => {
    expect(paginationShownFor(new FakeTabHeader(502, 500))).toBeTrue();
  });

  it('hides the arrows when every tab fits', () => {
    expect(paginationShownFor(new FakeTabHeader(500, 500))).toBeFalse();
  });

  it('keeps the arrows hidden when pagination is disabled', () => {
    const header = new FakeTabHeader(502, 500);
    header.disablePagination = true;

    expect(paginationShownFor(header)).toBeFalse();
  });
});

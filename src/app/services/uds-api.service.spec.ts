import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TimeoutError } from 'rxjs';

import { UDSApiService } from './uds-api.service';
import { UDSGuiService } from './uds-gui.service';

/**
 * Verifies that every call to the broker is capped by the TIMEOUT constant of
 * the service. Without the cap a request the broker never answers leaves its
 * promise pending forever and the portal stays waiting with no way out.
 */
describe('UDSApiService request timeout', () => {
  const SERVICES_URL = '/uds/page/services/data';
  const TIMEOUT = 10000;

  let service: UDSApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    (window as any).udsData = {
      profile: { user: 'test', role: 'user', admin: false },
      config: { urls: { services: SERVICES_URL }, launcher_wait_time: 5000 },
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        UDSApiService,
        { provide: UDSGuiService, useValue: jasmine.createSpyObj('UDSGuiService', ['alert', 'yesno']) },
      ],
    });

    service = TestBed.inject(UDSApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('gives up on a request the broker never answers', fakeAsync(() => {
    let failure: unknown;
    service.getServicesInformation().catch((error) => (failure = error));

    httpMock.expectOne(SERVICES_URL);
    tick(TIMEOUT);

    expect(failure).toBeInstanceOf(TimeoutError);
  }));

  it('keeps the answer when it arrives before the cap', fakeAsync(() => {
    let information: unknown;
    service.getServicesInformation().then((data) => (information = data));

    httpMock.expectOne(SERVICES_URL).flush({ services: [] });
    tick(TIMEOUT);

    expect(information).toEqual({ services: [] } as any);
  }));
});

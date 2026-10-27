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

describe('UDSApiService favorite transport', () => {
  const ACTION_URL = '/uds/webapi/action/param1/param2';
  const FAVORITE_TRANSPORT_URL = '/uds/webapi/action/param1/favorite_transport/param2';

  let service: UDSApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    (window as any).udsData = {
      profile: { user: 'test', role: 'user', admin: false },
      config: {
        urls: { action: ACTION_URL, favorite_transport: FAVORITE_TRANSPORT_URL },
        launcher_wait_time: 5000,
      },
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

  afterEach(() => httpMock.verify());

  it('posts the chosen transport for the service', fakeAsync(() => {
    service.setFavoriteTransport('Fpool', 'trans');

    const req = httpMock.expectOne('/uds/webapi/action/Fpool/favorite_transport/trans');
    expect(req.request.method).toBe('POST');
    req.flush(null);
    tick();
  }));

  it('posts the unfavorite action when the favorite is cleared', fakeAsync(() => {
    service.setFavoriteTransport('Fpool', null);

    const req = httpMock.expectOne('/uds/webapi/action/Fpool/unfavorite-transport');
    expect(req.request.method).toBe('POST');
    req.flush(null);
    tick();
  }));
});

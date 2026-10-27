import { TestBed } from '@angular/core/testing';

import { UDSApiService } from '../../../services/uds-api.service';
import { JSONService, JSONTransport } from '../../../types/services';
import { ServiceComponent } from './service.component';

describe('ServiceComponent favorite transport', () => {
  let api: jasmine.SpyObj<UDSApiService>;
  let component: ServiceComponent;

  const transport = (id: string, priority: number, favorite = false): JSONTransport =>
    ({ id, name: id, link: '', priority, favorite }) as JSONTransport;
  const click = () => new MouseEvent('click');
  const ids = () => component.service.transports.map((t) => t.id);

  beforeEach(() => {
    const catalog: { [msgid: string]: string } = {
      'Set as favorite connection': 'Marcar como favorita',
      'Remove favorite connection': 'Quitar favorita',
    };
    (window as any).django = { gettext: (msgid: string) => catalog[msgid] ?? msgid };
    api = jasmine.createSpyObj<UDSApiService>('UDSApiService', ['setFavoriteTransport']);
    TestBed.configureTestingModule({ providers: [{ provide: UDSApiService, useValue: api }] });
    component = TestBed.runInInjectionContext(() => new ServiceComponent());
    component.service = {
      id: 'Fpool',
      transports: [transport('rdp', 1, true), transport('html5', 2), transport('ssh', 3)],
    } as JSONService;
  });

  it('translates the star label', () => {
    expect(component.favoriteTransportLabel(transport('html5', 2))).toBe('Marcar como favorita');
    expect(component.favoriteTransportLabel(transport('rdp', 1, true))).toBe('Quitar favorita');
  });

  it('moves the new favorite first and keeps the rest by priority', async () => {
    api.setFavoriteTransport.and.resolveTo();

    await component.toggleFavoriteTransport(click(), component.service.transports[2]);

    expect(api.setFavoriteTransport).toHaveBeenCalledWith('Fpool', 'ssh');
    expect(ids()).toEqual(['ssh', 'rdp', 'html5']);
    expect(component.service.transports.map((t) => t.favorite)).toEqual([true, false, false]);
  });

  it('restores the priority order when the favorite is cleared', async () => {
    api.setFavoriteTransport.and.resolveTo();
    component.service.transports = [transport('ssh', 3, true), transport('rdp', 1), transport('html5', 2)];

    await component.toggleFavoriteTransport(click(), component.service.transports[0]);

    expect(api.setFavoriteTransport).toHaveBeenCalledWith('Fpool', null);
    expect(ids()).toEqual(['rdp', 'html5', 'ssh']);
    expect(component.service.transports.some((t) => t.favorite)).toBeFalse();
  });

  it('leaves the menu untouched when the server rejects the favorite', async () => {
    api.setFavoriteTransport.and.rejectWith(new Error('400'));
    const before = component.service.transports;

    await component.toggleFavoriteTransport(click(), before[2]);

    expect(component.service.transports).toBe(before);
  });

  it('does not let the star click launch the transport', async () => {
    api.setFavoriteTransport.and.resolveTo();
    const event = click();
    spyOn(event, 'stopPropagation');

    await component.toggleFavoriteTransport(event, component.service.transports[1]);

    expect(event.stopPropagation).toHaveBeenCalled();
  });
});

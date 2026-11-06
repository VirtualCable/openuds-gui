// Author: Janier Rodríguez, jrodriguez at virtualcable dot es
import { Subject } from 'rxjs';
import { Plugin } from './plugin';
import { JSONTransportURLService } from '../types/services';

type CallName = 'transportUrl' | 'sleep' | 'error';

class FakeApi {
  readonly calls: CallName[] = [];
  readonly closed = new Subject<void>();
  readonly config = { launcher_wait_time: 5 };
  readonly gui = {
    alert: () =>
      Promise.resolve({
        afterClosed: () => this.closed.asObservable(),
        close: () => undefined,
        componentInstance: { data: {} },
      }),
    askCredentials: () => Promise.resolve({ success: false }),
  };

  constructor(private readonly responses: JSONTransportURLService[]) {}

  transportUrl(): Promise<JSONTransportURLService> {
    this.calls.push('transportUrl');
    const next = this.responses.shift();
    if (next === undefined) {
      return Promise.reject(new Error('no more responses'));
    }
    return Promise.resolve(next);
  }

  sleep(): Promise<void> {
    this.calls.push('sleep');
    return Promise.resolve();
  }
}

describe('Plugin.processExternalUrl polling', () => {
  let openedWindows: string[];

  beforeEach(() => {
    openedWindows = [];
    (window as any).django = { gettext: (msgid: string) => msgid, interpolate: (fmt: string) => fmt };
    spyOn(window, 'open').and.callFake((url?: string | URL) => {
      openedWindows.push(String(url));
      return null;
    });
  });

  const launch = async (responses: JSONTransportURLService[]): Promise<FakeApi> => {
    const api = new FakeApi(responses);
    await new Plugin(api as any).launchURL('http://broker/uds/webapi/trans/ticket');
    return api;
  };

  it('waits between consecutive polls while the service is still launching', async () => {
    const api = await launch([{ running: 'yes' }, { running: 'yes' }, { url: 'http://service/launch' }]);

    expect(api.calls).toEqual(['transportUrl', 'sleep', 'transportUrl', 'sleep', 'transportUrl']);
    expect(openedWindows).toEqual(['http://service/launch']);
  });

  it('does not wait once the service url has been opened', async () => {
    const api = await launch([{ url: 'http://service/launch' }]);

    expect(api.calls).toEqual(['transportUrl']);
  });

  it('does not wait once the broker reports an error', async () => {
    const api = await launch([{ error: 'Service unavailable' }]);

    expect(api.calls).toEqual(['transportUrl']);
    expect(openedWindows).toEqual([]);
  });
});

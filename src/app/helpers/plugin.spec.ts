// Author: Janier Rodríguez, jrodriguez at virtualcable dot es
import { Subject } from 'rxjs';
import { Plugin } from './plugin';
import { JSONEnabledService, JSONStatusService, JSONTransportURLService } from '../types/services';

type CallName = 'transportUrl' | 'sleep' | 'error' | 'enabler' | 'status' | 'download' | 'close';

class FakeApi {
  readonly calls: CallName[] = [];
  readonly closed = new Subject<void>();
  lastDialog: { afterClosed: () => Subject<void>; close: () => void; componentInstance: { data: Record<string, unknown> } } | null = null;
  readonly config = { launcher_wait_time: 5, urls: { launcher_download: 'http://launcher/download' } };
  readonly gui = {
    alert: () => {
      this.lastDialog = {
        afterClosed: () => this.closed,
        close: () => {
          this.calls.push('close');
        },
        componentInstance: { data: {} as Record<string, unknown> },
      };
      return Promise.resolve(this.lastDialog);
    },
    askCredentials: () => Promise.resolve({ success: false }),
  };

  constructor(
    private readonly transportResponses: JSONTransportURLService[] = [],
    private readonly enablerResponses: JSONEnabledService[] = [],
    private readonly statusResponses: JSONStatusService[] = [],
  ) {}

  transportUrl(): Promise<JSONTransportURLService> {
    this.calls.push('transportUrl');
    const next = this.transportResponses.shift();
    if (next === undefined) {
      return Promise.reject(new Error('no more responses'));
    }
    return Promise.resolve(next);
  }

  enabler(): Promise<JSONEnabledService> {
    this.calls.push('enabler');
    const next = this.enablerResponses.shift();
    if (next === undefined) {
      return Promise.reject(new Error('no more enabler responses'));
    }
    return Promise.resolve(next);
  }

  status(): Promise<JSONStatusService> {
    this.calls.push('status');
    const next = this.statusResponses.shift();
    if (next === undefined) {
      return Promise.reject(new Error('no more status responses'));
    }
    return Promise.resolve(next);
  }

  download(_url: string): Promise<void> {
    this.calls.push('download');
    return Promise.resolve();
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
    const api = await launch([{ running: 0 }, { running: 50 }, { url: 'http://service/launch' }]);

    expect(api.calls).toEqual(['transportUrl', 'sleep', 'transportUrl', 'sleep', 'transportUrl', 'close']);
    expect(openedWindows).toEqual(['http://service/launch']);
  });

  it('does not wait once the service url has been opened', async () => {
    const api = await launch([{ url: 'http://service/launch' }]);

    expect(api.calls).toEqual(['transportUrl', 'close']);
  });

  it('does not wait once the broker reports an error', async () => {
    const api = await launch([{ error: 'Service unavailable' }]);

    expect(api.calls).toEqual(['transportUrl', 'close']);
    expect(openedWindows).toEqual([]);
  });
});

describe('Plugin.processUDSUrl launch retry', () => {
  beforeEach(() => {
    (window as any).django = { gettext: (msgid: string) => msgid, interpolate: (fmt: string) => fmt };
    spyOn(window, 'open').and.callFake(() => null);
  });

  const launchUds = async (
    enablerResponses: JSONEnabledService[],
    statusResponses: JSONStatusService[],
  ): Promise<FakeApi> => {
    const api = new FakeApi([], enablerResponses, statusResponses);
    await new Plugin(api as any).launchURL('udsa://serviceid/transportid');
    return api;
  };

  it('keeps polling when the first enable reports a retryable creation and launches when ready', async () => {
    const api = await launchUds(
      [
        // First enable: service is still being created
        { url: '', error: 'Your service is being created...', retryable: true, percent: 25 },
        // Second enable fires when the first ready tick arrives, but the
        // service went back to preparing: this still polls
        { url: '', error: 'Your service is being created...', retryable: true, percent: 25 },
        // Third enable, now the service is really ready
        { url: 'udsa://serviceid/transportid', error: '' },
      ],
      [
        { status: 'running', percent: 50, message: 'ok' },
        { status: 'ready', percent: 25 },
        { status: 'ready', percent: 25 },
        { status: 'accessed' },
      ],
    );

    expect(api.calls).toEqual([
      'enabler',
      'status',
      'sleep',
      'status',
      'enabler',
      'sleep',
      'status',
      'enabler',
      'download',
      'sleep',
      'status',
      'close',
    ]);
    expect(api.lastDialog?.componentInstance.data['title']).toBe('Service ready');
    expect(api.lastDialog?.componentInstance.data['progress']).toBe(100);
  });

  it('reports an error dialog when the ready-time enable fails permanently', async () => {
    const api = await launchUds(
      [
        { url: '', error: 'Your service is being created...', retryable: true, percent: 25 },
        // Second enable fails for good (e.g. invalid uuid): dead end
        { url: '', error: 'Invalid service', retryable: false },
      ],
      [
        { status: 'running', percent: 50, message: 'ok' },
        { status: 'ready', percent: 25 },
      ],
    );

    expect(api.calls).toEqual(['enabler', 'status', 'sleep', 'status', 'enabler', 'close']);
    expect(api.lastDialog?.componentInstance.data['title']).not.toBe('Service ready');
  });
});

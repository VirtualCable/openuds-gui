import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MfaComponent } from './mfa.component';
import { UDSApiService } from '../../services/uds-api.service';
import { SafeHtmlPipe } from '../../helpers/safe-html.pipe';

/**
 * The verification page is styled like the rest of the portal, but it still posts
 * to the same server view, so the field names, the ids the component looks up and
 * the form action have to survive the restyling untouched.
 */
describe('MfaComponent form contract', () => {
  let fixture: ComponentFixture<MfaComponent>;

  async function render(mfa: { label: string; remember_device: string; html: string }): Promise<void> {
    const apiStub = jasmine.createSpyObj<UDSApiService>('UDSApiService', ['staticURL'], {
      config: {
        site_name: 'UDS',
        mfa,
        urls: { mfa: '/uds/page/mfa' },
      } as any,
      errors: [],
      user: { isLogged: false } as any,
      router: jasmine.createSpyObj('Router', ['navigate']) as any,
      gui: jasmine.createSpyObj('gui', ['alert']) as any,
    });
    (apiStub as any).staticURL = (path: string) => `/uds/res/${path}`;

    await TestBed.configureTestingModule({
      declarations: [MfaComponent, SafeHtmlPipe],
      providers: [{ provide: UDSApiService, useValue: apiStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MfaComponent);
    fixture.detectChanges();
  }

  function el(selector: string): HTMLElement | null {
    return fixture.nativeElement.querySelector(selector) as HTMLElement | null;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('posts the code to the url the server configured', async () => {
    await render({ label: 'Authentication Code', remember_device: '', html: '' });

    const form = el('#mfaform') as HTMLFormElement;
    expect(form.method).toBe('post');
    expect(form.action).toContain('/uds/page/mfa');
  });

  it('keeps the code input named as the server expects', async () => {
    await render({ label: 'Authentication Code', remember_device: '', html: '' });

    const code = el('#code') as HTMLInputElement;
    expect(code.name).toBe('code');
    expect(code.required).toBe(true);
  });

  it('shows the label the authenticator provides', async () => {
    await render({ label: 'Code sent by SMS', remember_device: '', html: '' });

    expect((el('mat-label') as HTMLElement).textContent?.trim()).toBe('Code sent by SMS');
  });

  it('posts remember as off when the authenticator does not offer it', async () => {
    await render({ label: 'Authentication Code', remember_device: '', html: '' });

    const hidden = el('input[type="hidden"][name="remember"]') as HTMLInputElement;
    expect(hidden.value).toBe('0');
    expect(el('#remember')).toBeNull();
  });

  it('offers the checkbox when the authenticator remembers the device', async () => {
    await render({ label: 'Authentication Code', remember_device: '30 days', html: '' });

    expect(el('#remember')?.getAttribute('name')).toBe('remember');
    expect(el('input[type="hidden"][name="remember"]')).toBeNull();
    expect((el('.mfa-remember') as HTMLElement).textContent).toContain('30 days');
  });

  it('prints the text of the authenticator inside the card', async () => {
    await render({ label: 'Authentication Code', remember_device: '', html: '<b>Check your phone</b>' });

    const html = el('.mfa-html') as HTMLElement;
    expect(html.innerHTML).toContain('<b>Check your phone</b>');
    expect((el('.mfa-form') as HTMLElement).contains(html)).toBe(true);
  });

  it('leaves out the text of the authenticator when there is none', async () => {
    await render({ label: 'Authentication Code', remember_device: '', html: '' });

    expect(el('.mfa-html')).toBeNull();
  });

  it('prints the brand artwork as decoration', async () => {
    await render({ label: 'Authentication Code', remember_device: '', html: '' });

    const brand = el('.mfa-brand') as HTMLElement;
    expect(brand.getAttribute('aria-hidden')).toBe('true');
    expect((brand.querySelector('img') as HTMLImageElement).getAttribute('alt')).toBe('');
  });

  it('renders mfa-field with required form field and input structure', async () => {
    await render({ label: 'Authentication Code', remember_device: '', html: '' });

    const field = el('.mfa-field');
    expect(field).not.toBeNull();
    expect(field?.querySelector('mat-form-field')).not.toBeNull();
    const input = field?.querySelector('input#code') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.hasAttribute('required')).toBe(true);
  });

  it('renders qr code or image inside mfa-html without breaking the card', async () => {
    const qrHtml = '<div><img src="data:image/png;base64,fake" alt="QR Code" /></div><p>Scan me</p>';
    await render({ label: 'Authentication Code', remember_device: '', html: qrHtml });

    const img = el('.mfa-html img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.getAttribute('alt')).toBe('QR Code');
    expect((el('.mfa-html') as HTMLElement).textContent).toContain('Scan me');
  });
});

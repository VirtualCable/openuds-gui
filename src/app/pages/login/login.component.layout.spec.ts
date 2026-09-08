import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UDSApiService } from '../../services/uds-api.service';
import { BiometricService } from '../../services/biometric.service';
import { SafeHtmlPipe } from '../../helpers/safe-html.pipe';

/**
 * The login page must fit the viewport. The shell already spends 64px on the
 * navbar offset and 3em on the footer block, so a login card asking for a full
 * 100vh on top of that leaves the document taller than the window and the
 * browser shows a scrollbar with nothing below the fold.
 *
 * The host reuses app.component.scss instead of copying the shell rules, so
 * a change to the navbar offset or the footer box shows up here.
 */
@Component({
  template: `
    <div class="page">
      <div class="content"><uds-login></uds-login></div>
      <div class="footer"></div>
    </div>
  `,
  styleUrls: ['../../app.component.scss'],
  standalone: false,
})
class ShellHostComponent {}

describe('LoginComponent page height', () => {
  let fixture: ComponentFixture<ShellHostComponent>;

  beforeEach(async () => {
    const apiStub = jasmine.createSpyObj<UDSApiService>('UDSApiService', ['staticURL'], {
      config: {
        site_name: 'UDS',
        site_information: '',
        authenticators: [],
        allow_biometric_auth: false,
        urls: { login: '/uds/page/login' },
      } as any,
      errors: [],
    });
    (apiStub as any).csrfField = 'csrfmiddlewaretoken';
    (apiStub as any).csrfToken = 'test-csrf-token-1234';
    (apiStub as any).staticURL = (path: string) => `/uds/res/${path}`;

    await TestBed.configureTestingModule({
      declarations: [ShellHostComponent, LoginComponent, SafeHtmlPipe],
      providers: [
        { provide: UDSApiService, useValue: apiStub },
        {
          provide: BiometricService,
          useValue: jasmine.createSpyObj('BiometricService', ['hasStoredData', 'clearCredentials']),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellHostComponent);
    fixture.detectChanges();
  });

  function box(selector: string): HTMLElement {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el === null) {
      fail(`Expected ${selector} to be rendered`);
    }
    return el as HTMLElement;
  }

  /** Height the shell spends on the navbar offset and on the footer block. */
  function reservedByShell(): number {
    const content = box('.content');
    const footer = box('.footer');
    const footerStyle = getComputedStyle(footer);
    return (
      parseFloat(getComputedStyle(content).marginTop) +
      footer.getBoundingClientRect().height +
      parseFloat(footerStyle.marginTop) +
      parseFloat(footerStyle.marginBottom)
    );
  }

  /** Height the login card reserves for itself, whatever its content ends up being. */
  function claimedByLogin(): number {
    return parseFloat(getComputedStyle(box('.login-container')).minHeight);
  }

  it('centers the brand artwork on the login card, not on the viewport', () => {
    const brand = box('.login-brand').getBoundingClientRect();
    const form = box('.login-form').getBoundingClientRect();

    expect(Math.abs((brand.top + brand.bottom) / 2 - (form.top + form.bottom) / 2)).toBeLessThanOrEqual(1);
    expect(Math.abs((brand.left + brand.right) / 2 - (form.left + form.right) / 2)).toBeLessThanOrEqual(1);
  });

  it('does not shrink the card to fit the stack', () => {
    const form = box('.login-form').getBoundingClientRect();
    const stack = box('.login-stack').getBoundingClientRect();
    const padding = getComputedStyle(box('.login-form'));

    const expected =
      stack.width +
      parseFloat(padding.paddingLeft) +
      parseFloat(padding.paddingRight) +
      parseFloat(padding.borderLeftWidth) +
      parseFloat(padding.borderRightWidth);
    expect(form.width).toBeCloseTo(expected, 0);
  });

  it('keeps the brand artwork inside the width of the card', () => {
    const image = box('.login-brand img').getBoundingClientRect();
    const form = box('.login-form').getBoundingClientRect();

    expect(image.width).toBeLessThan(form.width);
  });

  it('leaves room for the navbar offset and the footer', () => {
    const total = claimedByLogin() + reservedByShell();
    expect(total).toBeLessThanOrEqual(
      window.innerHeight,
      `login reserves ${claimedByLogin()}px plus ${reservedByShell()}px of shell, ` +
        `${total - window.innerHeight}px more than the ${window.innerHeight}px viewport`,
    );
  });
});

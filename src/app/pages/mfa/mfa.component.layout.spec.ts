import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MfaComponent } from './mfa.component';
import { UDSApiService } from '../../services/uds-api.service';
import { SafeHtmlPipe } from '../../helpers/safe-html.pipe';

/**
 * The verification page shares the card, the glass tokens and the brand backdrop
 * with the login page, so the same measurements have to hold here: the artwork
 * centers on the card, the card is not shrunk by the stack, and the page fits the
 * viewport once the shell has spent the navbar offset and the footer block.
 *
 * The host reuses app.component.scss instead of copying the shell rules, so a
 * change to the navbar offset or the footer box shows up here.
 */
@Component({
  template: `
    <div class="page">
      <div class="content"><uds-mfa></uds-mfa></div>
      <div class="footer"></div>
    </div>
  `,
  styleUrls: ['../../app.component.scss'],
  standalone: false,
})
class ShellHostComponent {}

async function configureShell(html = ''): Promise<void> {
  const apiStub = jasmine.createSpyObj<UDSApiService>('UDSApiService', ['staticURL'], {
    config: {
      site_name: 'UDS',
      mfa: { label: 'Authentication Code', remember_device: '', html },
      urls: { mfa: '/uds/page/mfa' },
    } as any,
    errors: [],
    user: { isLogged: false } as any,
    router: jasmine.createSpyObj('Router', ['navigate']) as any,
    gui: jasmine.createSpyObj('gui', ['alert']) as any,
  });
  (apiStub as any).staticURL = (path: string) => `/uds/res/${path}`;

  await TestBed.configureTestingModule({
    declarations: [ShellHostComponent, MfaComponent, SafeHtmlPipe],
    providers: [{ provide: UDSApiService, useValue: apiStub }],
    schemas: [NO_ERRORS_SCHEMA],
  }).compileComponents();
}

describe('MfaComponent page height', () => {
  beforeEach(async () => {
    await configureShell();
    TestBed.createComponent(ShellHostComponent).detectChanges();
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

  /** Height the verification card reserves for itself, whatever its content ends up being. */
  function claimedByMfa(): number {
    return parseFloat(getComputedStyle(box('.mfa-container')).minHeight);
  }

  it('centers the brand artwork on the verification card, not on the viewport', () => {
    const brand = box('.mfa-brand').getBoundingClientRect();
    const form = box('.mfa-form').getBoundingClientRect();

    expect(Math.abs((brand.top + brand.bottom) / 2 - (form.top + form.bottom) / 2)).toBeLessThanOrEqual(1);
    expect(Math.abs((brand.left + brand.right) / 2 - (form.left + form.right) / 2)).toBeLessThanOrEqual(1);
  });

  it('does not shrink the card to fit the stack', () => {
    const form = box('.mfa-form').getBoundingClientRect();
    const stack = box('.mfa-stack').getBoundingClientRect();
    const padding = getComputedStyle(box('.mfa-form'));

    const expected =
      stack.width +
      parseFloat(padding.paddingLeft) +
      parseFloat(padding.paddingRight) +
      parseFloat(padding.borderLeftWidth) +
      parseFloat(padding.borderRightWidth);
    expect(form.width).toBeCloseTo(expected, 0);
  });

  it('keeps the brand artwork inside the width of the card', () => {
    const image = box('.mfa-brand img').getBoundingClientRect();
    const form = box('.mfa-form').getBoundingClientRect();

    expect(image.width).toBeLessThan(form.width);
  });

  it('leaves room for the navbar offset and the footer', () => {
    const total = claimedByMfa() + reservedByShell();
    expect(total).toBeLessThanOrEqual(
      window.innerHeight,
      `the verification page reserves ${claimedByMfa()}px plus ${reservedByShell()}px of shell, ` +
        `${total - window.innerHeight}px more than the ${window.innerHeight}px viewport`,
    );
  });
});

/**
 * The brand artwork is printed behind the card, so this card cannot take the
 * near-opaque background the rest of the light theme needs to stay readable.
 * Both themes are checked because the fix is a token pair and a theme could
 * silently lose its override.
 */
describe('MfaComponent card glass', () => {
  let fixture: ComponentFixture<ShellHostComponent>;

  beforeEach(async () => {
    await configureShell();
    fixture = TestBed.createComponent(ShellHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.classList.remove('dark-theme');
  });

  /** Alpha channel of a computed `rgb()`/`rgba()` colour; 1 when fully opaque. */
  function alphaOf(color: string): number {
    const parts = color.replace(/^rgba?\(|\)$/g, '').split(/[,/]/);
    return parts.length > 3 ? parseFloat(parts[3]) : 1;
  }

  function card(): HTMLElement {
    return document.querySelector('.mfa-form') as HTMLElement;
  }

  function cardAlpha(): number {
    return alphaOf(getComputedStyle(card()).backgroundColor);
  }

  function sharedGlassAlpha(): number {
    return alphaOf(getComputedStyle(card()).getPropertyValue('--glass-bg').trim());
  }

  it('blurs what shows through the card', () => {
    expect(getComputedStyle(card()).backdropFilter).toContain('blur');
  });

  it('keeps the light card translucent enough to show the artwork', () => {
    expect(cardAlpha()).toBeLessThan(sharedGlassAlpha());
    expect(cardAlpha()).toBeGreaterThan(0);
  });

  it('prints the light artwork strongly enough to read through the card', () => {
    const image = document.querySelector('.mfa-brand img') as HTMLElement;
    expect(parseFloat(getComputedStyle(image).opacity)).toBeGreaterThan(0.5);
  });

  it('leaves the dark card on the shared glass background', () => {
    document.body.classList.add('dark-theme');
    fixture.detectChanges();

    expect(cardAlpha()).toBeCloseTo(sharedGlassAlpha(), 2);
  });
});

/**
 * The TOTP enrollment page ships its QR code as mfa.html. A dimmed QR loses the
 * contrast the camera needs to read it, so the block must render at full opacity.
 */
describe('MfaComponent extra html', () => {
  beforeEach(async () => {
    await configureShell('<img alt="qr" width="10" height="10">');
    TestBed.createComponent(ShellHostComponent).detectChanges();
  });

  it('does not dim the html provided by the multi factor method', () => {
    const extra = document.querySelector('.mfa-html') as HTMLElement | null;
    if (extra === null) {
      fail('Expected .mfa-html to be rendered');
    }
    expect(getComputedStyle(extra as HTMLElement).opacity).toBe('1');
  });
});

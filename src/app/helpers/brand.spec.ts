import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LAUNCHER_NAME, withLauncherName } from './brand';
import { TranslateDirective } from './translate.directive';

@Component({
  template: `<uds-translate>You will need %(launcher)s</uds-translate>`,
  standalone: false,
})
class BrandHostComponent {}

describe('launcher brand', () => {
  let translations: { [msgid: string]: string };

  beforeEach(() => {
    translations = {};
    (window as any).django = {
      gettext: (msgid: string) => translations[msgid] ?? msgid,
      // Same substitution the served catalog does, so the spec exercises the
      // real placeholder syntax instead of a convenient one
      interpolate: (fmt: string, obj: any, named: boolean) =>
        named
          ? fmt.replace(/%\(\w+\)s/g, (match: string) => String(obj[match.slice(2, -2)]))
          : fmt.replace(/%s/g, () => String(obj.shift())),
    };
  });

  it('puts the launcher name into a translated text', () => {
    expect(withLauncherName('Download %(launcher)s for your platform')).toBe(
      `Download ${LAUNCHER_NAME} for your platform`
    );
  });

  it('leaves a text without the placeholder untouched', () => {
    expect(withLauncherName('About')).toBe('About');
  });

  it('keeps the launcher name out of the translation', async () => {
    translations['You will need %(launcher)s'] = 'Necesitarás %(launcher)s';

    await TestBed.configureTestingModule({
      declarations: [BrandHostComponent, TranslateDirective],
    }).compileComponents();
    const fixture = TestBed.createComponent(BrandHostComponent);
    fixture.detectChanges();

    const rendered = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(rendered).toBe(`Necesitarás ${LAUNCHER_NAME}`);
  });
});

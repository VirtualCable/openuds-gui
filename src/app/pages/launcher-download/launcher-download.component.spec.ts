import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LAUNCHER_NAME } from '../../helpers/brand';
import { TranslateDirective } from '../../helpers/translate.directive';
import { UDSApiService } from '../../services/uds-api.service';
import { LauncherDownloadComponent } from './launcher-download.component';

describe('LauncherDownloadComponent', () => {
  let fixture: ComponentFixture<LauncherDownloadComponent>;

  beforeEach(async () => {
    // A catalog that would rename the product, as the es/fr/ja ones did
    const catalog: { [msgid: string]: string } = {
      'UDS Launcher': 'Lanzador UDS',
      'Download %(launcher)s for your platform': 'Descargue %(launcher)s para su plataforma',
    };
    (window as any).django = {
      gettext: (msgid: string) => catalog[msgid] ?? msgid,
      interpolate: (fmt: string, obj: any) =>
        fmt.replace(/%\(\w+\)s/g, (match: string) => String(obj[match.slice(2, -2)])),
    };

    await TestBed.configureTestingModule({
      declarations: [LauncherDownloadComponent, TranslateDirective],
      providers: [
        {
          provide: UDSApiService,
          useValue: { plugins: [], staticURL: (path: string) => `/uds/res/${path}` },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LauncherDownloadComponent);
    fixture.detectChanges();
  });

  it('shows the launcher name untranslated in the title', () => {
    const title = fixture.nativeElement.querySelector('h1') as HTMLElement;
    expect(title.textContent?.trim()).toBe(LAUNCHER_NAME);
  });

  it('shows the launcher name untranslated inside the translated hint', () => {
    const hint = fixture.nativeElement.querySelector('.info li') as HTMLElement;
    expect(hint.textContent).toBe(`Descargue ${LAUNCHER_NAME} para su plataforma`);
  });
});

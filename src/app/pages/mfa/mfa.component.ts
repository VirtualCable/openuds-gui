import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, NgZone, AfterViewInit } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
  selector: 'uds-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MfaComponent implements OnInit, OnDestroy, AfterViewInit {
  api = inject(UDSApiService);
  private zone = inject(NgZone);

  qrExpanded = false;
  private resizing = false;
  private startX = 0;
  private startY = 0;
  private startSize = 180;
  private readonly BASE_SIZE = 180;
  private readonly MIN_SIZE = 120;
  private readonly MAX_SIZE = 480;
  private boundMove: ((e: MouseEvent | TouchEvent) => void) | null = null;
  private boundUp: (() => void) | null = null;
  private handle: HTMLElement | null = null;
  private anchor: HTMLElement | null = null;
  private img: HTMLImageElement | null = null;
  private parent: HTMLElement | null = null;
  private repositionHandle = (): void => undefined;

  ngOnInit() {
    const form = document.getElementById('mfaform') as HTMLFormElement;
    form.action = this.api.config.urls.mfa;

    if (this.api.user.isLogged) {
      this.api.router.navigate(['/']);
    }

    if (this.api.errors.length > 0) {
      this.api.gui.alert(django.gettext('Errors found'), '<div>' + this.api.errors.join('</div><div>') + '</div>');
    }
  }

  ngAfterViewInit() {
    this.installHandle();
    setTimeout(() => this.repositionHandle(), 100);
    setTimeout(() => this.repositionHandle(), 500);
  }

  ngOnDestroy() {
    this.detachListeners();
    this.handle?.remove();
  }

  private installHandle(): void {
    const img = document.querySelector('.mfa-html img') as HTMLImageElement | null;
    if (!img) {
      setTimeout(() => this.installHandle(), 100);
      return;
    }
    this.img = img;
    this.parent = img.parentElement;
    if (!this.parent) return;

    if (getComputedStyle(this.parent).position === 'static') {
      this.parent.style.position = 'relative';
    }

    const handle = document.createElement('span');
    handle.className = 'mfa-qr-resize';
    handle.setAttribute('aria-hidden', 'true');
    this.parent.appendChild(handle);
    this.handle = handle;
    this.anchor = handle;

    this.repositionHandle = (): void => {
      if (!this.img || !this.handle) return;
      const r = this.img.getBoundingClientRect();
      const pr = this.parent!.getBoundingClientRect();
      this.handle.style.cssText += `; position: absolute !important; left: ${r.right - pr.left - 28}px !important; top: ${r.bottom - pr.top - 28}px !important; width: 22px !important; height: 22px !important;`;
    };
    this.repositionHandle();
    window.addEventListener('resize', this.repositionHandle);

    handle.addEventListener('mousedown', (e) => this.startResize(e));
    handle.addEventListener('touchstart', (e) => this.startResize(e), { passive: false });
  }

  launch(): boolean {
    const form = document.getElementById('mfaform') as HTMLFormElement;
    form.submit();
    return true;
  }

  toggleQr(): void {
    this.qrExpanded = !this.qrExpanded;
  }

  startResize(event: MouseEvent | TouchEvent): void {
    if (!this.img) return;

    event.preventDefault();
    event.stopPropagation();
    this.resizing = true;
    this.startX = this.pointX(event);
    this.startY = this.pointY(event);
    const rect = this.img.getBoundingClientRect();
    this.startSize = Math.round(rect.width);
    this.img.style.transition = 'none';
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'nwse-resize';

    this.boundMove = (e: MouseEvent | TouchEvent) => this.onResizeMove(e);
    this.boundUp = () => this.onResizeEnd();

    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.boundMove!);
      window.addEventListener('touchmove', this.boundMove!);
      window.addEventListener('mouseup', this.boundUp!);
      window.addEventListener('touchend', this.boundUp!);
    });
  }

  private onResizeMove(event: MouseEvent | TouchEvent): void {
    if (!this.resizing || !this.img) return;
    const dx = this.pointX(event) - this.startX;
    const dy = this.pointY(event) - this.startY;
    const delta = Math.max(dx, dy);
    const newSize = Math.max(this.MIN_SIZE, Math.min(this.MAX_SIZE, this.startSize + delta));
    this.img.style.setProperty('width', newSize + 'px', 'important');
    this.img.style.setProperty('height', newSize + 'px', 'important');
    this.repositionHandle();
  }

  private onResizeEnd(): void {
    if (!this.resizing || !this.img) return;
    this.resizing = false;
    this.img.style.transition = '';
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    const wrapper = document.querySelector('.mfa-html-wrapper') as HTMLElement | null;
    if (wrapper) wrapper.classList.remove('expanded');
    const finalSize = Math.round(this.img.getBoundingClientRect().width);
    this.img.setAttribute('data-qr-size', finalSize.toString());
    this.detachListeners();
  }

  private detachListeners(): void {
    if (this.boundMove) {
      window.removeEventListener('mousemove', this.boundMove);
      window.removeEventListener('touchmove', this.boundMove);
      this.boundMove = null;
    }
    if (this.boundUp) {
      window.removeEventListener('mouseup', this.boundUp);
      window.removeEventListener('touchend', this.boundUp);
      this.boundUp = null;
    }
  }

  private pointX(event: MouseEvent | TouchEvent): number {
    if (event instanceof TouchEvent) {
      return event.touches[0]?.clientX ?? 0;
    }
    return event.clientX;
  }

  private pointY(event: MouseEvent | TouchEvent): number {
    if (event instanceof TouchEvent) {
      return event.touches[0]?.clientY ?? 0;
    }
    return event.clientY;
  }
}

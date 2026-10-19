import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, NgZone } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';

@Component({
  selector: 'uds-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MfaComponent implements OnInit, OnDestroy {
  api = inject(UDSApiService);
  private zone = inject(NgZone);

  qrExpanded = false;
  private resizing = false;
  private startX = 0;
  private startY = 0;
  private startSize = 180;
  private readonly BASE_SIZE = 180;
  private readonly STEP = 24;
  private readonly MIN_SIZE = 120;
  private readonly MAX_SIZE = 480;
  private boundMove: ((e: MouseEvent | TouchEvent) => void) | null = null;
  private boundUp: (() => void) | null = null;

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

  ngOnDestroy() {
    this.detachListeners();
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
    const wrapper = (event.currentTarget as HTMLElement).closest('.mfa-html-wrapper') as HTMLElement | null;
    if (!wrapper) return;
    const img = wrapper.querySelector('.mfa-html img') as HTMLImageElement | null;
    if (!img) return;

    event.preventDefault();
    this.resizing = true;
    this.startX = this.pointX(event);
    this.startY = this.pointY(event);
    const rect = img.getBoundingClientRect();
    this.startSize = rect.width;
    img.style.transition = 'none';
    wrapper.classList.add('resizing');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'nwse-resize';

    this.boundMove = (e: MouseEvent | TouchEvent) => this.onResizeMove(e, wrapper, img);
    this.boundUp = () => this.onResizeEnd(wrapper, img);

    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.boundMove!);
      window.addEventListener('touchmove', this.boundMove!);
      window.addEventListener('mouseup', this.boundUp!);
      window.addEventListener('touchend', this.boundUp!);
    });
  }

  private onResizeMove(event: MouseEvent | TouchEvent, wrapper: HTMLElement, img: HTMLImageElement): void {
    if (!this.resizing) return;
    const dx = this.pointX(event) - this.startX;
    const dy = this.pointY(event) - this.startY;
    const delta = Math.max(dx, dy);
    const stepped = Math.round(delta / this.STEP) * this.STEP;
    const newSize = Math.max(this.MIN_SIZE, Math.min(this.MAX_SIZE, this.startSize + stepped));
    img.style.width = newSize + 'px';
    img.style.height = newSize + 'px';
    wrapper.classList.toggle('expanded', newSize > this.BASE_SIZE);
  }

  private onResizeEnd(wrapper: HTMLElement, img: HTMLImageElement): void {
    if (!this.resizing) return;
    this.resizing = false;
    wrapper.classList.remove('resizing');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    img.style.transition = '';
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

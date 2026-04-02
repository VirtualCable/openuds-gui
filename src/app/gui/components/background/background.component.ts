import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UDSApiService } from '../../../services/uds-api.service';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

@Component({
  selector: 'uds-background',
  template: '<canvas #backgroundThumbnail class="background-canvas"></canvas>',
  styles: [`
    .background-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      opacity: 1; /* Aumentado para depuración */
    }
  `],
  standalone: false
})
export class BackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('backgroundThumbnail', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private animationFrameId?: number;
  private particleCount = 60;

  constructor(private api: UDSApiService) {}

  get isEnabled(): boolean {
    // Check directly from udsData to avoid any delay in service property population
    try {
      return (window as any).udsData.config.allow_animated_backgrounds === true;
    } catch (e) {
      return false;
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.tryStart();
  }

  private tryStart(attempts = 0): void {
    if (this.isEnabled) {
      this.initCanvas();
      this.animate();
    } else if (attempts < 10) {
      // Retry every 500ms for 5 seconds total
      setTimeout(() => this.tryStart(attempts + 1), 500);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.particles.length) return; // Only resize if initialized
    this.setCanvasSize();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
    this.setCanvasSize();
    this.createParticles();
  }

  private setCanvasSize(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createParticles(): void {
    this.particles = [];
    this.particleCount = 100; // Aumentamos para que sea evidente
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2, // Partículas más grandes para depuración
        speedX: (Math.random() - 0.5) * 1.5, // Más rápidas
        speedY: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    console.log('Particles created:', this.particles.length);
  }

  private animate(): void {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    const isDark = document.documentElement.classList.contains('dark-theme');
    const color = isDark ? '255, 255, 255' : '70, 93, 156';

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around screen
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      this.ctx!.beginPath();
      this.ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx!.fillStyle = `rgba(${color}, ${p.opacity})`;
      this.ctx!.fill();
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

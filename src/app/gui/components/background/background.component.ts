import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UDSApiService } from '../../../services/uds-api.service';

interface SilkWave {
  points: number[];
  yBase: number;
  amplitude: number;
  speed: number;
  thickness: number;
  offset: number;
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
    }
  `],
  standalone: false
})
export class BackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('backgroundThumbnail', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D | null;
  private waves: SilkWave[] = [];
  private animationFrameId?: number;
  private time = 0;

  constructor(private api: UDSApiService) {}

  get isEnabled(): boolean {
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
      setTimeout(() => this.tryStart(attempts + 1), 500);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.waves.length) return;
    this.setCanvasSize();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.setCanvasSize();
    this.createWaves();
  }

  private setCanvasSize(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createWaves(): void {
    this.waves = [];
    const h = window.innerHeight;
    const count = 4;
    for (let i = 0; i < count; i++) {
      this.waves.push({
        points: [],
        yBase: h * (0.3 + i * 0.15),
        amplitude: h * (0.05 + Math.random() * 0.05), // Amplitud proporcional al alto
        speed: 0.01 + Math.random() * 0.02,
        thickness: h * (0.1 + Math.random() * 0.1), // Grosor proporcional al alto
        offset: Math.random() * Math.PI * 2,
        opacity: 0.06 + Math.random() * 0.08
      });
    }
  }

  private animate(): void {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.time += 0.25; // Paz total: reducido de nuevo a la mitad

    const isDark = document.documentElement.classList.contains('dark-theme');
    
    // Colores base para las cuerdas
    const mainColor = isDark ? '100, 140, 255' : '60, 100, 200';
    const accentColor = isDark ? '160, 100, 255' : '100, 60, 180';

    this.waves.forEach((wave, index) => {
      this.ctx!.beginPath();
      
      const gradient = this.ctx!.createLinearGradient(0, 0, this.ctx!.canvas.width, 0);
      gradient.addColorStop(0, `rgba(${mainColor}, 0)`);
      gradient.addColorStop(0.5, `rgba(${index % 2 === 0 ? mainColor : accentColor}, ${wave.opacity})`);
      gradient.addColorStop(1, `rgba(${mainColor}, 0)`);

      this.ctx!.strokeStyle = gradient;
      this.ctx!.lineWidth = wave.thickness;
      this.ctx!.lineCap = 'round';
      this.ctx!.lineJoin = 'round';

      let x = 0;
      const step = 20;

      for (x = -step; x <= this.ctx!.canvas.width + step; x += step) {
        // Movimiento de onda sinusoidal combinada
        // Aumentamos los multiplicadores de frecuencia para que las ondas sean más visibles
        const y = wave.yBase + 
                  Math.sin(x * 0.001 + (this.time * wave.speed) + wave.offset) * wave.amplitude +
                  Math.cos(x * 0.003 + (this.time * wave.speed * 0.5)) * (wave.amplitude * 0.4);
        
        if (x === -step) {
          this.ctx!.moveTo(x, y);
        } else {
          this.ctx!.lineTo(x, y);
        }
      }

      this.ctx!.stroke();
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

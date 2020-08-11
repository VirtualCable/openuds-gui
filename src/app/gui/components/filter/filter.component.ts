import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';


@Component({
  selector: 'uds-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements AfterViewInit {

  @Output() updateEvent = new EventEmitter<string>();

  @ViewChild('input', {static: true}) input: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(600),
        distinctUntilChanged(),
        tap(() => { this.update(this.input.nativeElement.value); })
      ).subscribe();
  }

  update(fltr: string) {
    this.updateEvent.emit(fltr.toLowerCase());
  }

}

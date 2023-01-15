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

  @ViewChild('input', {static: true}) input: ElementRef|undefined = undefined;

  constructor() { }

  ngAfterViewInit() {
    // if input is not set, this will fail
    if(this.input === undefined) {
      throw new Error('input atrribute is not provided');
    }
    const input = this.input;

    fromEvent(input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(600),
        distinctUntilChanged(),
        tap(() => this.update(input.nativeElement.value))
      ).subscribe();
  }

  update(fltr: string) {
    this.updateEvent.emit(fltr.toLowerCase());
  }

}

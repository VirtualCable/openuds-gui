import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'uds-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  error = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.getError();
  }

  getError(): void {
    const id = this.route.snapshot.paramMap.get('id');
    try {
      this.error = window.atob(id);
    } catch (e) {
      this.error = django.gettext('Invalid error string');
    }
  }

}

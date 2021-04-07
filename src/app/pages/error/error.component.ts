import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare const django: any;
declare const udsData: any;

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
      this.error = new TextDecoder().decode(Uint8Array.from(window.atob(id), c => (c as any).charCodeAt(c))).replace('\n', '<br/>');
      console.log(this.error);
      udsData.error = this.error;
    } catch (e) {
      console.log(e);
      this.error = django.gettext('Invalid error string');
    }
  }

}

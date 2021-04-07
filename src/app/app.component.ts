import { Component, OnInit } from '@angular/core';

// External
declare const django: any;
declare const cookieconsent: any;


@Component({
  selector: 'uds-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'uds';

  ngOnInit() {
    cookieconsent.initialise({
      palette: {
        popup: {
          background: '#343c66',
          text: '#cfcfe8'
        },
        button: {
          background: '#f71559'
        }
      },
      content: {
        message: django.gettext('We use cookies to track usage and preferences'),
        dismiss: django.gettext('I Understand'),
        link: django.gettext('Learn more')
      }
    });
  }
}

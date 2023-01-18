import { Component, HostListener, OnInit } from '@angular/core';
import { UDSApiService } from './services/uds-api.service';



@Component({
  selector: 'uds-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'UDS';
  blackTheme = false;

  constructor(private api: UDSApiService) {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey && event.ctrlKey && event.key === 'b') {
      this.blackTheme = !this.blackTheme;
      this.api.switchTheme(this.blackTheme);
    }
  }

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

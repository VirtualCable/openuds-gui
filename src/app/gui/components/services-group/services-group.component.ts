import { Component, OnInit, Input } from '@angular/core';
import { JSONGroup, JSONService } from '../../../types/services';
import { UDSApiService } from '../../../uds-api.service';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

@Component({
  selector: 'uds-services-group',
  templateUrl: './services-group.component.html',
  styleUrls: ['./services-group.component.css']
})
export class ServicesGroupComponent implements OnInit {

  @Input() services: JSONService[];
  @Input() group: JSONGroup;
  @Input() expanded = false;

  constructor(private api: UDSApiService) { }

  ngOnInit() {
  }

  get groupImage() {
    return this.api.galleryImageURL(this.group.imageUuid);
  }

  get hasVisibleServices(): boolean {
    return this.services.length > 0;
  }

  get sortedServices() {
    return this.services.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name ) {
        return -1;
      }
      return 0;
    });
  }

}

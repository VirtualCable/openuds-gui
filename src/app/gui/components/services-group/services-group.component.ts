import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { JSONGroup, JSONService } from '../../../types/services';
import { UDSApiService } from '../../../services/uds-api.service';

@Component({
    selector: 'uds-services-group',
    templateUrl: './services-group.component.html',
    styleUrls: ['./services-group.component.scss'],
    standalone: false
})
export class ServicesGroupComponent implements OnInit {

  @Input() services: JSONService[] = [];
  @Input() group: JSONGroup = {} as JSONGroup;
  @Input() expanded = false;

  @Output() favoriteChanged = new EventEmitter<{serviceId: string, isFavorite: boolean}>();

  constructor(private api: UDSApiService, private cdr: ChangeDetectorRef) { }

  get groupImage() {
    // If the group is favorites, use the special image
    if (this.group.name && this.group.name.toLowerCase().includes('favorites')) {
      return '/uds/webapi/img/gallery/x';
    }
    return this.api.galleryImageURL(this.group.imageUuid);
  }

  get hasVisibleServices(): boolean {
    return this.services.length > 0;
  }

  get sortedServices() {
    return this.services.sort((a, b) => {
      // First use visual name, then name
      if (a.visual_name > b.visual_name) {
        return 1;
      } else if (a.visual_name < b.visual_name) {
        return -1;
      }
      // If still equal, use name
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name ) {
        return -1;
      }
      return 0;
    });
  }

  ngOnInit() {
  }

    // Ya no es necesario manejar el evento aquí, se propaga al padre

}

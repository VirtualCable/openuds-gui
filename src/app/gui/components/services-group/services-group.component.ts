import { Component, OnInit, Input } from '@angular/core';
import { JSONGroup, JSONService } from '../../../types/services';
import { UDSApiService } from '../../../uds-api.service';

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

}

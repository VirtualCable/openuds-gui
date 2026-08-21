import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { JSONGroup, JSONService } from '../../../types/services';
import { UDSApiService } from '../../../services/uds-api.service';

@Component({
  selector: 'uds-services-group',
  templateUrl: './services-group.component.html',
  styleUrls: ['./services-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ServicesGroupComponent implements OnInit {
  private api = inject(UDSApiService);
  private cdr = inject(ChangeDetectorRef);

  @Input() services: JSONService[] = [];
  @Input() group: JSONGroup = {} as JSONGroup;
  @Input() expanded = false;
  @Input() enableFavoriteServices = true;

  @Output() favoriteChanged = new EventEmitter<{ serviceId: string; isFavorite: boolean }>();

  get groupImage() {
    return this.api.galleryImageURL(this.group.imageUuid);
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
      } else if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }

  ngOnInit() {}

  // Not required to handle the event here anymore; it is propagated to parent
}

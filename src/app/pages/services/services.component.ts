import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { UDSApiService } from '../../services/uds-api.service';
import { JSONServicesInformation, JSONGroup, JSONService } from '../../types/services';

const FAVORITES_GROUP: JSONGroup = {
  id: 'favorites',
  name: django.gettext('Favorites'),
  comments: '',
  imageUuid: 'x',
  priority: -1,
};

class GroupedServices {
  services: JSONService[];
  constructor(public group: JSONGroup) {
    this.services = [];
  }

  isFavoritesGroup(): boolean {
    return this.group.id === FAVORITES_GROUP.id;
  }
}

@Component({
  selector: 'uds-services-page',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  standalone: false,
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  servicesInformation: JSONServicesInformation = {
    autorun: false,
    services: [],
  };

  group: GroupedServices[] = [];

  constructor(public api: UDSApiService, private host: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngAfterViewInit() {
    // Mouse wheel over the group tab bar scrolls the tab strip left/right,
    // reusing Material's own pagination so the side arrow buttons keep working.
    this.zone.runOutsideAngular(() => {
      this.host.nativeElement.addEventListener('wheel', this.onTabsWheel, { passive: false });
    });
  }

  ngOnDestroy() {
    this.host.nativeElement.removeEventListener('wheel', this.onTabsWheel);
  }

  private onTabsWheel = (ev: WheelEvent) => {
    const header = (ev.target as HTMLElement).closest('.mat-mdc-tab-header');
    if (!header) {
      return; // not over the group selector: let the page scroll normally
    }

    const delta =
      Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
    if (delta === 0) {
      return;
    }

    const dir = delta > 0 ? 'after' : 'before';
    const btn = header.querySelector(
      `.mat-mdc-tab-header-pagination-${dir}`,
    ) as HTMLElement | null;

    // No overflow (no pagination shown / nothing to scroll): don't hijack the wheel
    if (!btn || btn.classList.contains('mat-mdc-tab-header-pagination-disabled')) {
      return;
    }

    ev.preventDefault();
    btn.click();
  };

  update(filter: string) {
    this.updateServices(filter);
  }

  /**
   * Updates the favorites list when favorite status changes
   */
  onFavoriteChanged(event: { serviceId: string; isFavorite: boolean }) {
    // Reloads the list of services from the backend to reflect changes to favorites
    this.loadServices();
  }

  ngOnInit() {
    if (this.api.config.urls.launch) {
      this.api.logout();
    } else {
      this.loadServices(); // Loads service related data
    }
  }

  /**
   * check autorun of service and lauchs it if needed
   */
  private autorun(): boolean {
    // If autorun, and there is only one service, launch it
    if (this.servicesInformation.autorun && this.servicesInformation.services.length === 1) {
      if (!this.servicesInformation.services[0].maintenance) {
        this.api.executeCustomJSForServiceLaunch();
        // Launch url
        this.api.launchURL(this.servicesInformation.services[0].transports[0].link);
        return true;
      } else {
        this.api.gui.alert(
          django.gettext('Warning'),
          django.gettext('Service is in maintenance and cannot be executed'),
        );
      }
    }

    // TODO remove this
    // this.plugin.launchURL(this.servicesInformation.services[0].transports[0].link);
    return false;
  }

  private loadServices() {
    // If restricted user, it's not allowed to see ALLL services
    if (this.api.user.isRestricted) {
      this.api.logout();
    }

    // Obtain services list
    this.api.getServicesInformation().then((result: JSONServicesInformation) => {
      this.servicesInformation = result;
      this.autorun();

      this.updateServices();
    });
  }

  private updateServices(filter: string = '') {
    // Group services and favorites using the backend 'favorite' field
    let favoritesGroup: GroupedServices = new GroupedServices(FAVORITES_GROUP);
    this.group = [];

    let groupedMap = new Map<string, GroupedServices>();

    this.servicesInformation.services
      .filter(
        (value) =>
          !filter ||
          value.visual_name.toLowerCase().includes(filter) ||
          value.group.name.toLowerCase().includes(filter),
      )
      .forEach((element) => {
        // Add to favorites if 'favorite' field is true
        if (element.favorite) {
          favoritesGroup.services.push(element);
        }
        // Group by group.id
        if (!groupedMap.has(element.group.id)) {
          groupedMap.set(element.group.id, new GroupedServices(element.group));
        }
        groupedMap.get(element.group.id)!.services.push(element);
      });

    // Convert map to array, sort by group priority and id, and filter out empty groups
    this.group = Array.from(groupedMap.values())
      .filter(g => g.services.length > 0)
      .sort((a, b) => {
        if (a.group.priority !== b.group.priority) {
          return a.group.priority - b.group.priority;
        } else {
          if (a.group.id > b.group.id) {
            return 1;
          } else if (a.group.id < b.group.id) {
            return -1;
          }
        }
        return 0;
      });

    // Insert favorite group at the beginning if there are favorites
    if (favoritesGroup.services.length > 0 && this.api.config.enable_favorite_services) {
      this.group.unshift(favoritesGroup);
    }
  }
}

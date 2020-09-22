import { Observable } from 'rxjs';
import { JSONServicesInformation, JSONEnabledService, JSONService, JSONTransportURLService } from './types/services';
import { UDSGuiService } from './gui/uds-gui.service';
import { UDSConfig } from './types/config';

export interface UDSApiServiceType {
  gui: UDSGuiService;

  /* Config */
  config: UDSConfig;

  /* Client enabler */
  enabler(serviceId: string, transportId: string): Observable<JSONEnabledService>;

  /* Services resetter */
  action(action: string, serviceId: string): Observable<JSONService>;

  /* transport url */
  transportUrl(url: string): Observable<JSONTransportURLService>;

  /**
   * Gets services information
   */
  getServicesInformation(): Observable<JSONServicesInformation>;

  /**
   * Executes custom javascript for service launch if it is available
   */
  executeCustomJSForServiceLaunch(): void;
}

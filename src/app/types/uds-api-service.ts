import { Observable } from 'rxjs';
import {
  JSONServicesInformation,
  JSONEnabledService,
  JSONStatusService,
  JSONService,
  JSONTransportURLService,
} from './services';
import { UDSGuiService } from '../services/uds-gui.service';
import { UDSConfig } from './config';

export interface UDSApiServiceType {
  gui: UDSGuiService;

  /* Config */
  config: UDSConfig;

  /* Client enabler */
  enabler(serviceId: string, transportId: string): Promise<JSONEnabledService>;

  /* Service status */
  status(serviceId: string, transportId: string): Promise<JSONStatusService>;

  /* Services resetter */
  action(action: string, serviceId: string): Promise<JSONService>;

  /* transport url */
  transportUrl(url: string): Promise<JSONTransportURLService>;

  /* Transport ticket credentials updater */
  updateTransportTicket(
    ticketId: string,
    scrambler: string,
    username: string,
    password: string,
    domain: string
  ): Promise<any>;

  /* Go to admin dashboard */
  gotoAdmin(): void;

  /* Executes logout */
  logout(): void;

  /* Download file/launches a custom uro */
  download(url: string): Promise<void>;

  /* sleep milliseconds */
  sleep(ms: number): Promise<void>;
  /**
   * Gets services information
   */
  getServicesInformation(): Promise<JSONServicesInformation>;

  /**
   * Executes custom javascript for service launch if it is available
   */
  executeCustomJSForServiceLaunch(): void;

  // Storage related
  putOnStorage(key: string, value: string): void;
  getFromStorage(key: string): string | null;
}

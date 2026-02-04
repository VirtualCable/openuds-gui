/* SystemJS module definition */
/// <reference types="node" />
// eslint-disable-next-line no-var
declare var module: NodeJS.Module;
interface NodeModule {
  id: string;
}
/* UDS injected modules */
declare const django: any;
declare const udsData: any;
declare const cookieconsent: any;
declare const csrf: any;

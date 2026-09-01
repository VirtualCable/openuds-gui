/* SystemJS module definition */
/// <reference types="node" />
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
/* UDS injected modules */
declare const django: any;
declare const udsData: any;
declare const cookieconsent: any;
declare const csrf: any;

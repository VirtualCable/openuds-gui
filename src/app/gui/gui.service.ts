import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from './modal/modal.component';

@Injectable()
export class GuiService {

  constructor(private modalService: NgbModal) { }

  alert(title: string, message: string ) {
    const mod = this.modalService.open(ModalComponent, { centered: true });
    mod.componentInstance.title = title;
    mod.componentInstance.body = message;
  }
}

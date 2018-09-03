import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'uds-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {

  @Input() title = 'Information';
  @Input() body = 'UDS Modal';

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}

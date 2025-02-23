import { Injectable, TemplateRef, EventEmitter, inject } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
export enum ModalType {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FORGOTPWD = 'FORGOTPWD',
  RESETPWD = 'RESETPWD',
  PRODUCT = 'PRODUCT',
  VENDOR = 'VENDOR',
  OTP = 'OTP',
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalService = inject(NgbModal);
  public openModalEvent: EventEmitter<ModalType> =
    new EventEmitter<ModalType>();
  public dataTransferObject: EventEmitter<any> = new EventEmitter<any>();

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          console.log(`Closed with: ${result}`);
        },
        (reason) => {
          console.log(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  triggerOpenModal(modalType: ModalType) {
    this.openModalEvent.emit(modalType);
  }

  public dataTransferer(dto: any) {
    this.dataTransferObject.emit(dto);
  }
}

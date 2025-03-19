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
  USER = 'USER',
  INVOICE = 'INVOICE',
  REALCLIENT = 'REALCLIENT', // Ensure these are defined
  REALVENDOR = 'REALVENDOR',
  EDITUSER ='EDITUSER'
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalService = inject(NgbModal);
  public openModalEvent: EventEmitter<ModalType> = new EventEmitter<ModalType>();
  public dataTransferObject: EventEmitter<any> = new EventEmitter<any>();
  private currentData: any = null; // Store data here

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
    console.log('Triggering modal:', modalType, 'with data:', this.currentData);
    this.openModalEvent.emit(modalType);
  }

  public dataTransferer(dto: any) {
    console.log('Storing data:', dto);
    this.currentData = dto; // Store data synchronously
    this.dataTransferObject.emit(dto); // Still emit for other subscribers
  }

  public getCurrentData(): any {
    return this.currentData; // Retrieve stored data
  }

  public clearCurrentData() {
    this.currentData = null; // Clear after use
  }
}
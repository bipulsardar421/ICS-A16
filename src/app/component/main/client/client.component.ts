import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ModalService, ModalType } from '../../data/services/modal.service';
import { UserService } from '../../data/services/user-details/user.service';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientVendorService } from '../../data/services/client-vendor/client-vendor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, NgbPopoverModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private _client = inject(ClientVendorService);
  clients: any[] = [];
  private dataChangeSubscription!: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchClients();
    this.dataChangeSubscription = this._client.dataChanged$.subscribe((entityType) => {
      if (entityType === 'client') {
        
        this.fetchClients();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataChangeSubscription) {
      this.dataChangeSubscription.unsubscribe();
    }
  }

  fetchClients(): void {
    this._client.getAllClients().subscribe(
      (response) => {
        if (response.status === 'Success') {
          this.clients = response.data;
        } else {
          console.error('Error fetching clients:', response.message);
          this.clients = [];
        }
      },
      (error) => {
        console.error('HTTP error fetching clients:', error);
        this.clients = [];
      }
    );
  }

  openModel() {
    this.modalService.triggerOpenModal(ModalType.REALCLIENT);
  }

  manageClient(clientId: number) {
    
    this.modalService.dataTransferer({ type: 'Edit', id: clientId });
    this.openModel();
  }

  addClient() {
    
    this.modalService.dataTransferer({ type: 'Add' });
    this.openModel();
  }

  deleteClient(clientId: number) {
    
    const form = new FormData();
    form.append('client_id', clientId.toString());
    this._client.deleteClient(form).subscribe(
      (response) => {
        if (response.status === 'Success') {
          this.clients = this.clients.filter((client) => client.client_id !== clientId);
          this._client.notifyDataChange('client'); 
          
        } else {
          console.error('Error deleting client:', response.message);
        }
      },
      (error) => {
        console.error('HTTP error deleting client:', error);
      }
    );
  }
}
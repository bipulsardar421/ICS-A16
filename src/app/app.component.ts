import { Component, inject, TemplateRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ModalService } from './component/data/services/modal.service';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from "./component/common/alert/alert.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NgbAlertModule, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',  
})
export class AppComponent {
  title = 'ICS-A16';

  private modalService = inject(ModalService);

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content);
  }

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          AOS.refresh();
        }, 300);
      }
    });
  }

  ngOnInit() {
    AOS.init({
      offset: 120,
      delay: 0,
      duration: 900,
      easing: 'ease',
      once: false,
      mirror: false,
      anchorPlacement: 'top-bottom',
    });
  }
}

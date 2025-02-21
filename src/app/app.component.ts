import { Component, inject, TemplateRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MainComponent } from "./component/main/main.component";
import { ModalService } from './component/data/services/modal.service';
import { LoginComponent } from "./component/common/pop-up-component/login/login.component";
import { SignupComponent } from './component/common/pop-up-component/signup/signup.component';
import { CommonModule } from '@angular/common';
import { ForgotPwdComponent } from "./component/common/pop-up-component/forgot-pwd/forgot-pwd.component";
import { ResetPwdComponent } from "./component/common/pop-up-component/reset-pwd/reset-pwd.component";
import { HomeComponent } from "./component/home/home.component";
import { NgModel } from '@angular/forms';
import AOS from 'aos';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ICS-A16';
  
  private modalService = inject(ModalService);

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content);
  }

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          AOS.refresh(); // Refresh AOS on route change
        }, 300);
      }
    });
  }

  ngOnInit() {
    AOS.init({
      offset: 120,
      delay: 0,
      duration: 900,
      easing: "ease",
      once: false,
      mirror: false,
      anchorPlacement: "top-bottom",
    });
  }

}

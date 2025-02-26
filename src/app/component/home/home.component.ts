import { Component } from '@angular/core';
import { WelcomeSectionComponent } from "./welcome-section/welcome-section.component";
import { ServicesSectionComponent } from "./services-section/services-section.component";
import { AboutSectionComponent } from "./about-section/about-section.component";
import { ContactSectionComponent } from "./contact-section/contact-section.component";
import { HomeNavBarComponent } from "./home-nav-bar/home-nav-bar.component";
import { LoginComponent } from "../common/pop-up-component/login/login.component";
import { ForgotPwdComponent } from "../common/pop-up-component/forgot-pwd/forgot-pwd.component";
import { ResetPwdComponent } from "../common/pop-up-component/reset-pwd/reset-pwd.component";
import { SignupComponent } from "../common/pop-up-component/signup/signup.component";
import { OtpComponent } from "../common/pop-up-component/otp/otp.component";

@Component({
  selector: 'app-home',
  imports: [WelcomeSectionComponent, ServicesSectionComponent, AboutSectionComponent, ContactSectionComponent, HomeNavBarComponent, LoginComponent, ForgotPwdComponent, ResetPwdComponent, SignupComponent, OtpComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

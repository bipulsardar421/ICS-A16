import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-navigation',
  imports: [NgbModule, RouterLink],
  templateUrl: './main-navigation.component.html',
  styleUrl: './main-navigation.component.css'
})
export class MainNavigationComponent {
  isNavbarOpen = false;

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }
}

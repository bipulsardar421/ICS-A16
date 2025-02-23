import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownToggle, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-navigation',
  imports: [NgbModule, RouterLink, NgbDropdownToggle],
  templateUrl: './main-navigation.component.html',
  styleUrl: './main-navigation.component.css'
})
export class MainNavigationComponent {
  isDropdownOpen: boolean = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
onLogoutClick() {
throw new Error('Method not implemented.');
}
onSettingsClick() {
throw new Error('Method not implemented.');
}
onProfileClick() {
throw new Error('Method not implemented.');
}
  isNavbarOpen = false;

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }
}

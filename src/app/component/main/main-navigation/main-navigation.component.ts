import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownToggle, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from '../main.component';

@Component({
  selector: 'app-main-navigation',
  imports: [NgbModule, RouterLink, NgbDropdownToggle],
  templateUrl: './main-navigation.component.html',
  styleUrl: './main-navigation.component.css',
})
export class MainNavigationComponent implements OnInit{
  name: string = '';
  role: string = '';
  profile_image: string = '';
  constructor(private mcom: MainComponent) {}
  ngOnInit(): void {
    this.mcom.user$.subscribe(user => {
      this.name = user.name;
      this.role = user.role;
      this.profile_image = user.profile_image;
    });
    console.log(this.name);
    
  }
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

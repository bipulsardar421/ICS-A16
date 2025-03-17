import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbDropdownToggle, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from '../main.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../data/services/auth/auth.service';

@Component({
  selector: 'app-main-navigation',
  imports: [NgbModule, RouterLink, NgbDropdownToggle, CommonModule],
  templateUrl: './main-navigation.component.html',
  styleUrl: './main-navigation.component.css',
})
export class MainNavigationComponent implements OnInit{
private router = inject(Router)
  name: string = '';
  role: string = '';
  profile_image: string = '';
  constructor(private mcom: MainComponent, private auth: AuthService) {}
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
    this.auth.logout();
    localStorage.clear()
    this.router.navigate(['/home'])
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

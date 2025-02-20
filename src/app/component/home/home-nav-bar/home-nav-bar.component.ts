import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { ModalService, ModalType } from '../../data/services/modal.service';

@Component({
  selector: 'app-home-nav-bar',
  imports: [],
  templateUrl: './home-nav-bar.component.html',
  styleUrl: './home-nav-bar.component.css'
})
export class HomeNavBarComponent {
  sections = ['welcome', 'about', 'services', 'contact'];
  currentSection = 'welcome';

  private modalService = inject(ModalService);
  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver(
        (entries) => {
          let mostVisibleSection = this.currentSection;
          let maxVisibility = 0;

          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0.5 && entry.intersectionRatio > maxVisibility) {
              maxVisibility = entry.intersectionRatio;
              mostVisibleSection = entry.target.id;
            }
          });

          this.currentSection = mostVisibleSection;
        },
        { threshold: [0.5] }
      );

      this.sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          observer.observe(section);
        }
      });
    }
  }

  openLoginModal() {
    this.modalService.triggerOpenModal(ModalType.LOGIN);
  }

  openSignupModal() {
    this.modalService.triggerOpenModal(ModalType.SIGNUP);
  }
}

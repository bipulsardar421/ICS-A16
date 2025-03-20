import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoginHelperComponent } from './new-login-helper.component';

describe('NewLoginHelperComponent', () => {
  let component: NewLoginHelperComponent;
  let fixture: ComponentFixture<NewLoginHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLoginHelperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLoginHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVendorComponent } from './add-edit-vendor.component';

describe('AddEditVendorComponent', () => {
  let component: AddEditVendorComponent;
  let fixture: ComponentFixture<AddEditVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditVendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

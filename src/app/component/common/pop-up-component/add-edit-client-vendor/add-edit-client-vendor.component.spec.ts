import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditClientVendorComponent } from './add-edit-client-vendor.component';

describe('AddEditClientVendorComponent', () => {
  let component: AddEditClientVendorComponent;
  let fixture: ComponentFixture<AddEditClientVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditClientVendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditClientVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

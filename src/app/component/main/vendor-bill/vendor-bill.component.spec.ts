import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBillComponent } from './vendor-bill.component';

describe('VendorBillComponent', () => {
  let component: VendorBillComponent;
  let fixture: ComponentFixture<VendorBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

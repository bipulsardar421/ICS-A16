import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuserComponent } from './nuser.component';

describe('NuserComponent', () => {
  let component: NuserComponent;
  let fixture: ComponentFixture<NuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

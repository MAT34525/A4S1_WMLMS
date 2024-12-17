import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageNavbarComponent } from './admin-page-navbar.component';

describe('AdminPageNavbarComponent', () => {
  let component: AdminPageNavbarComponent;
  let fixture: ComponentFixture<AdminPageNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

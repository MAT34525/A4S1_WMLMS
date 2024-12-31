import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserPageButtonsComponent } from './admin-user-page-buttons.component';

describe('AdminUserPageButtonsComponent', () => {
  let component: AdminUserPageButtonsComponent;
  let fixture: ComponentFixture<AdminUserPageButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserPageButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserPageButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

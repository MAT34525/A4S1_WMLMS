import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserDeleteDialogComponent } from './admin-user-delete-dialog.component';

describe('AdminUserDeleteDialogComponent', () => {
  let component: AdminUserDeleteDialogComponent;
  let fixture: ComponentFixture<AdminUserDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

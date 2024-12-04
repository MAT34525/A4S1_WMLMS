import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLogsPageComponent } from './admin-logs-page.component';

describe('AdminLogsPageComponent', () => {
  let component: AdminLogsPageComponent;
  let fixture: ComponentFixture<AdminLogsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLogsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLogsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTablesPageComponent } from './admin-tables-page.component';

describe('AdminTablesPageComponent', () => {
  let component: AdminTablesPageComponent;
  let fixture: ComponentFixture<AdminTablesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTablesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTablesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

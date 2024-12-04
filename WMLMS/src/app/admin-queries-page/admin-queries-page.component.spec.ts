import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQueriesPageComponent } from './admin-queries-page.component';

describe('AdminQueriesPageComponent', () => {
  let component: AdminQueriesPageComponent;
  let fixture: ComponentFixture<AdminQueriesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminQueriesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQueriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

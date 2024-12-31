import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQueriesPageComponent } from './user-queries-page.component';

describe('UserQueriesPageComponent', () => {
  let component: UserQueriesPageComponent;
  let fixture: ComponentFixture<UserQueriesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserQueriesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserQueriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageHomeComponent } from './user-page-home.component';

describe('UserPageHomeComponent', () => {
  let component: UserPageHomeComponent;
  let fixture: ComponentFixture<UserPageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

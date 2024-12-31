import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageNavbarComponent } from './user-page-navbar.component';

describe('UserPageNavbarComponent', () => {
  let component: UserPageNavbarComponent;
  let fixture: ComponentFixture<UserPageNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

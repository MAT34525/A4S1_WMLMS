import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageSongsComponent } from './user-page-songs.component';

describe('UserPageSongsComponent', () => {
  let component: UserPageSongsComponent;
  let fixture: ComponentFixture<UserPageSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageSongsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPageSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

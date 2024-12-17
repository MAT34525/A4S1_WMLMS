import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPagePlaylistsComponent } from './user-page-playlists.component';

describe('UserPagePlaylistsComponent', () => {
  let component: UserPagePlaylistsComponent;
  let fixture: ComponentFixture<UserPagePlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPagePlaylistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPagePlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

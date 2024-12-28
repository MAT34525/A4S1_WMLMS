import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsComponent } from './user-page-playlists.component';

describe('UserPagePlaylistsComponent', () => {
  let component: PlaylistsComponent;
  let fixture: ComponentFixture<PlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

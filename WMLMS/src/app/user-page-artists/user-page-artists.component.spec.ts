import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageArtistsComponent } from './user-page-artists.component';

describe('UserPageArtistsComponent', () => {
  let component: UserPageArtistsComponent;
  let fixture: ComponentFixture<UserPageArtistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPageArtistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPageArtistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArtistPageComponent } from './admin-artist-page.component';

describe('AdminArtistPageComponent', () => {
  let component: AdminArtistPageComponent;
  let fixture: ComponentFixture<AdminArtistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminArtistPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminArtistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

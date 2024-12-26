import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArtistPageButtonsComponent } from './admin-artist-page-buttons.component';

describe('AdminArtistPageButtonsComponent', () => {
  let component: AdminArtistPageButtonsComponent;
  let fixture: ComponentFixture<AdminArtistPageButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminArtistPageButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminArtistPageButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

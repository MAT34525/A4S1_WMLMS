import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageNavbarComponent } from './main-page-navbar.component';

describe('MainPageNavbarComponent', () => {
  let component: MainPageNavbarComponent;
  let fixture: ComponentFixture<MainPageNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

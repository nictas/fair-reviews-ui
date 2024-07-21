import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplierDetailComponent } from './multiplier-detail.component';

describe('MultiplierDetailComponent', () => {
  let component: MultiplierDetailComponent;
  let fixture: ComponentFixture<MultiplierDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiplierDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiplierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

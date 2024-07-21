import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipliersComponent } from './multipliers.component';

describe('MultipliersComponent', () => {
  let component: MultipliersComponent;
  let fixture: ComponentFixture<MultipliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

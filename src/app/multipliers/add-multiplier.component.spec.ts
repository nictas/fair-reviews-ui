import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultiplierComponent } from './add-multiplier.component';

describe('AddMultiplierModalComponent', () => {
  let component: AddMultiplierComponent;
  let fixture: ComponentFixture<AddMultiplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMultiplierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMultiplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

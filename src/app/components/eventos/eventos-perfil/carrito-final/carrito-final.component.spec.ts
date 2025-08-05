import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoFinalComponent } from './carrito-final.component';

describe('CarritoFinalComponent', () => {
  let component: CarritoFinalComponent;
  let fixture: ComponentFixture<CarritoFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoFinalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarritoFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionLocalidadComponent } from './seleccion-localidad.component';

describe('SeleccionLocalidadComponent', () => {
  let component: SeleccionLocalidadComponent;
  let fixture: ComponentFixture<SeleccionLocalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionLocalidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeleccionLocalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

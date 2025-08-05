import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasPendientesComponent } from './compras-pendientes.component';

describe('ComprasPendientesComponent', () => {
  let component: ComprasPendientesComponent;
  let fixture: ComponentFixture<ComprasPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasPendientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprasPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

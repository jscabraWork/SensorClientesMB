import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasPromotorComponent } from './reservas-promotor.component';

describe('ReservasPromotorComponent', () => {
  let component: ReservasPromotorComponent;
  let fixture: ComponentFixture<ReservasPromotorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasPromotorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservasPromotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

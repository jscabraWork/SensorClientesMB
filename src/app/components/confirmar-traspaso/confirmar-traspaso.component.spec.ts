import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarTraspasoComponent } from './confirmar-traspaso.component';

describe('ConfirmarTraspasoComponent', () => {
  let component: ConfirmarTraspasoComponent;
  let fixture: ComponentFixture<ConfirmarTraspasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarTraspasoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmarTraspasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

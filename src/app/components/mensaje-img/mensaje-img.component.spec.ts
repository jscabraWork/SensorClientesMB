import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeImgComponent } from './mensaje-img.component';

describe('MensajeImgComponent', () => {
  let component: MensajeImgComponent;
  let fixture: ComponentFixture<MensajeImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeImgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensajeImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoCortesiaComponent } from './codigo-cortesia.component';

describe('CodigoCortesiaComponent', () => {
  let component: CodigoCortesiaComponent;
  let fixture: ComponentFixture<CodigoCortesiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodigoCortesiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodigoCortesiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

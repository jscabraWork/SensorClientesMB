import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeLinkComponent } from './mensaje-link.component';

describe('MensajeLinkComponent', () => {
  let component: MensajeLinkComponent;
  let fixture: ComponentFixture<MensajeLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensajeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

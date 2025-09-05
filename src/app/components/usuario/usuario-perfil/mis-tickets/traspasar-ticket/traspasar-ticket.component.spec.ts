import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasarTicketComponent } from './traspasar-ticket.component';

describe('TraspasarTicketComponent', () => {
  let component: TraspasarTicketComponent;
  let fixture: ComponentFixture<TraspasarTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraspasarTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraspasarTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosPerfilComponent } from './eventos-perfil.component';

describe('EventosPerfilComponent', () => {
  let component: EventosPerfilComponent;
  let fixture: ComponentFixture<EventosPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosPerfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventosPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

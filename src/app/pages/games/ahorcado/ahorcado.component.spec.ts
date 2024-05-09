import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhorcadoComponent } from './ahorcado.component';

describe('AhorcadoComponent', () => {
  let component: AhorcadoComponent;
  let fixture: ComponentFixture<AhorcadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AhorcadoComponent]
    });
    fixture = TestBed.createComponent(AhorcadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

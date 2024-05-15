import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedCardsComponent } from './submitted-cards.component';

describe('SubmittedCardsComponent', () => {
  let component: SubmittedCardsComponent;
  let fixture: ComponentFixture<SubmittedCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmittedCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmittedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

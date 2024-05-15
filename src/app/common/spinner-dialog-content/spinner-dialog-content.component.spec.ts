import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerDialogContentComponent } from './spinner-dialog-content.component';

describe('SpinnerDialogContentComponent', () => {
  let component: SpinnerDialogContentComponent;
  let fixture: ComponentFixture<SpinnerDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinnerDialogContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpinnerDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

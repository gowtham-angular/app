import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipThreeComponent } from './vip-three.component';

describe('VipThreeComponent', () => {
  let component: VipThreeComponent;
  let fixture: ComponentFixture<VipThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VipThreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VipThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

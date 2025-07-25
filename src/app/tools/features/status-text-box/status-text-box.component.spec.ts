import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTextBoxComponent } from './status-text-box.component';

describe('StatusTextBoxComponent', () => {
  let component: StatusTextBoxComponent;
  let fixture: ComponentFixture<StatusTextBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTextBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

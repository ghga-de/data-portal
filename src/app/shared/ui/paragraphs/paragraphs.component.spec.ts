/**
 * Tests for the Paragraphs component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphsComponent } from './paragraphs.component';

describe('ParagraphsComponent', () => {
  let component: ParagraphsComponent;
  let fixture: ComponentFixture<ParagraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Hello\nWorld');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

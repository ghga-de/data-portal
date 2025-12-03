/**
 * Short module description
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacetExpansionPanelComponent } from './facet-expansion-panel';

describe('FacetExpansionPanelComponent', () => {
  let component: FacetExpansionPanelComponent;
  let fixture: ComponentFixture<FacetExpansionPanelComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacetExpansionPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FacetExpansionPanelComponent);
    fixture.componentRef.setInput('facet', {
      key: 'test',
      name: 'Test Facet',
      options: [
        { count: 2, value: 'Test Option 1' },
        { count: 2, value: 'Test Option 2' },
      ],
    });
    fixture.componentRef.setInput('selectedOptions', ['Test Option 2']);
    fixture.componentRef.setInput('expanded', true);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

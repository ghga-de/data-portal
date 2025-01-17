/**
 * Test the global stats component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { GlobalStatsComponent } from './global-summary.component';

import { metadataGlobalSummary } from '@app/../mocks/data';
import { MetldataQueryService } from '@app/metadata/services/metldataQuery.service';

/**
 * Mock the metadata service as needed for the global stats
 */
class MockMetldataQueryService {
  globalSummary = signal(metadataGlobalSummary.resource_stats);
  globalSummaryError = signal(undefined);
}

describe('GlobalStatsComponent', () => {
  let component: GlobalStatsComponent;
  let fixture: ComponentFixture<GlobalStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalStatsComponent],
      providers: [
        { provide: MetldataQueryService, useClass: MockMetldataQueryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalStatsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show platforms', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent;
    expect(text).toContain('1400');
    expect(text).toContain('Ilumina test');
  });
});

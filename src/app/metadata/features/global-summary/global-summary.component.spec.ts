/**
 * Test the global stats component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSummaryComponent } from './global-summary.component';

import { metadataGlobalSummary } from '@app/../mocks/data';
import { MetadataStatsService } from '@app/metadata/services/metadata-stats.service';

/**
 * Mock the metadata service as needed for the global stats
 */
class MockMetadataStatsService {
  globalSummary = {
    value: () => metadataGlobalSummary.resource_stats,
    isLoading: () => false,
    error: () => undefined,
  };
}

describe('GlobalStatsComponent', () => {
  let component: GlobalSummaryComponent;
  let fixture: ComponentFixture<GlobalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.overrideComponent(GlobalSummaryComponent, {
      set: {
        providers: [
          { provide: MetadataStatsService, useClass: MockMetadataStatsService },
        ],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Get the text content of a card
   * @param index the number of the card
   * @returns the normalized text content of the card
   */
  function getCardText(index: number): string {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards.length).toBe(4);
    const card = cards[index];
    return card.textContent?.replace(/\s+/g, ' ') ?? '';
  }

  it('should properly show total datasets', () => {
    const text = getCardText(0);
    expect(text).toContain('Total datasets: 252');
  });

  it('should properly show experiments', () => {
    const text = getCardText(1);
    expect(text).toContain('Experiments: 1,400');
    expect(text).toContain('700 Ilumina test');
    expect(text).toContain('700 HiSeq test');
  });

  it('should properly show individuals', () => {
    const text = getCardText(2);
    expect(text).toContain('Individuals: 5,432');
    expect(text).toContain('1,935 Female');
    expect(text).toContain('2,358 Male');
  });

  it('should properly aggregate file types', () => {
    const text = getCardText(3);
    expect(text).toContain('Files: 703');
    expect(text).toContain('12 txt 462 bam 212 fastq 17 zip');
  });
});

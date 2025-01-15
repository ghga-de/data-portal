/**
 * Test the global stats component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { HomePageGlobalStatsComponent } from './home-page-global-stats.component';

import { metadataGlobalSummary } from '@app/../mocks/data';
import { MetadataService } from '@app/metadata/services/metadata.service';

/**
 * Mock the metadata service as needed for the global stats
 */
class MockMetadataService {
  globalSummary = signal(metadataGlobalSummary.resource_stats);
  globalSummaryError = signal(undefined);
}

describe('HomePageGlobalStatsComponent', () => {
  let component: HomePageGlobalStatsComponent;
  let fixture: ComponentFixture<HomePageGlobalStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageGlobalStatsComponent],
      providers: [{ provide: MetadataService, useClass: MockMetadataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageGlobalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

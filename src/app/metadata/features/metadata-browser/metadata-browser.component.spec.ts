/**
 * Test the metadata browser component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';

import { searchResults } from '@app/../mocks/data';
import { MetadataSearchService } from '@app/metadata/services/metadataSearch.service';
import { MetadataBrowserComponent } from './metadata-browser.component';

/**
 * Mock the metadata service as needed for the global stats
 */
class MockMetadataSearchService {
  searchResults = signal(searchResults);
  searchResultsError = signal(undefined);
}

describe('BrowseComponent', () => {
  let component: MetadataBrowserComponent;
  let fixture: ComponentFixture<MetadataBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataBrowserComponent],
      providers: [
        { provide: MetadataSearchService, useClass: MockMetadataSearchService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataBrowserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show filters', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent;
    expect(text).toContain('Test');
    expect(text).toContain('Test platform');
  });
});

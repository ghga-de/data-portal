/**
 * Test the metadata browser component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';

import { searchResults } from '@app/../mocks/data';
import { MassQueryService } from '@app/metadata/services/massQuery.service';
import { MetadataBrowserComponent } from './metadata-browser.component';

/**
 * Mock the metadata service as needed for the metadata browser
 */
class MockMASSQueryService {
  searchResults = signal(searchResults);
  searchResultsError = signal(undefined);
  loadQueryParameters(): void {}
}

describe('BrowseComponent', () => {
  let component: MetadataBrowserComponent;
  let fixture: ComponentFixture<MetadataBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataBrowserComponent],
      providers: [{ provide: MassQueryService, useClass: MockMASSQueryService }],
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
    expect(text).toContain('Dataset Type');
    expect(text).toContain('Test dataset type 1');
  });
});

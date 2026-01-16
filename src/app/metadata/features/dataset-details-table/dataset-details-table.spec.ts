/**
 * Tests for the dataset details table component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WellKnownValueService } from '@app/metadata/services/well-known-value';
import { ConfigService } from '@app/shared/services/config';
import { datasetDetails } from 'src/mocks/data';
import { MockWellKnownValueService } from '../dataset-details/dataset-details.spec';
import { DatasetDetailsTableComponent } from './dataset-details-table';

/**
 * Mock the config service as needed by the dataset details component
 */
class MockConfigService {
  wkvs_url = 'http://mock.dev/wkvs';
}

describe('DatasetDetailsTableComponent', () => {
  let component: DatasetDetailsTableComponent;
  let fixture: ComponentFixture<DatasetDetailsTableComponent>;

  const setInputs = () => {
    fixture.componentRef.setInput('tableName', 'samples');
    fixture.componentRef.setInput('data', datasetDetails.samples);
    fixture.detectChanges();
  };

  const openExpansionPanel = async () => {
    // Click the expansion panel header so lazy content (matExpansionPanelContent) is rendered
    const headerDe = fixture.debugElement.query(By.css('mat-expansion-panel-header'));
    headerDe.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const getFilterInput = (): HTMLInputElement => {
    // input has "matInput" directive, but in DOM it's still a normal <input>
    const el = fixture.nativeElement.querySelector(
      'mat-form-field input',
    ) as HTMLInputElement | null;
    expect(el).not.toBeNull();
    return el as HTMLInputElement;
  };

  const getRenderedRowEls = (): HTMLElement[] => {
    // Material row class names differ between versions; be permissive.
    const root: HTMLElement = fixture.nativeElement;
    const rows = Array.from(
      root.querySelectorAll('tr.mat-row, tr.mat-mdc-row, tr[mat-row]'),
    ) as HTMLElement[];
    return rows;
  };

  const typeIntoFilter = async (value: string) => {
    const input = getFilterInput();
    input.value = value;
    input.dispatchEvent(new Event('keyup')); // template uses (keyup)="applyFilter($event)"
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetDetailsTableComponent],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        { provide: WellKnownValueService, useClass: MockWellKnownValueService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetDetailsTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct header text in the UI for samples', async () => {
    await setInputs();

    const headerEl = fixture.nativeElement.querySelector(
      'mat-expansion-panel-header',
    ) as HTMLElement;

    expect(headerEl.textContent).toContain('List of samples (3 total');
  });

  it('should render all rows initially, then filter rows in the UI by substring', async () => {
    await setInputs();
    await openExpansionPanel();

    // initially: 3 rows rendered
    expect(getRenderedRowEls().length).toBe(3);

    // filter by accession substring -> should render only the matching row
    await typeIntoFilter('01235');

    const rows = getRenderedRowEls();
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('GHGAN12345678901235');
    expect(rows[0].textContent).not.toContain('GHGAN12345678901234');
    expect(rows[0].textContent).not.toContain('GHGAN12345678901236');
  });

  it('should trim + lowercase the filter value (verified via UI filtering)', async () => {
    await setInputs();
    await openExpansionPanel();

    await typeIntoFilter('   TeSt TiSsUe 2   ');

    const rows = getRenderedRowEls();
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Test tissue 2');
  });

  it('should reset UI filtering when filter is cleared', async () => {
    await setInputs();
    await openExpansionPanel();

    await typeIntoFilter('01235');
    expect(getRenderedRowEls().length).toBe(1);

    await typeIntoFilter('');
    expect(getRenderedRowEls().length).toBe(3);
  });

  it('should show a clear button when filter has value and clear on click', async () => {
    await setInputs();
    await openExpansionPanel();

    const getClearButton = (): HTMLButtonElement | null =>
      fixture.nativeElement.querySelector('button[aria-label="Clear filter"]');

    // Initially hidden
    expect(getClearButton()).toBeNull();
    expect(getRenderedRowEls().length).toBe(3);

    // Type -> filter applies + button appears
    await typeIntoFilter('01235');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getClearButton()).not.toBeNull();
    expect(getRenderedRowEls().length).toBe(1);

    // Click -> filter cleared + all rows back + button hidden
    getClearButton()!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = getFilterInput();
    expect(input.value).toBe('');
    expect(getRenderedRowEls().length).toBe(3);
    expect(getClearButton()).toBeNull();
  });

  it('should show empty state and hide filter when input data is empty', async () => {
    fixture.componentRef.setInput('tableName', 'samples');
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    await fixture.whenStable();

    // open panel to render lazy content
    await openExpansionPanel();

    const filterInput = fixture.nativeElement.querySelector(
      'mat-form-field input',
    ) as HTMLInputElement | null;
    expect(filterInput).toBeNull();

    const noDataRow =
      fixture.nativeElement.querySelector('tr.mat-mdc-no-data-row') ||
      fixture.nativeElement.querySelector('tr.mat-no-data-row');

    expect(noDataRow).toBeTruthy();
    expect((noDataRow as HTMLElement).textContent).toContain('No data available.');
  });

  it('should keep filter visible and show empty state when filtering yields no results', async () => {
    await setInputs();
    await openExpansionPanel();

    // Type something that yields no matches
    await typeIntoFilter('does-not-match-anything');

    // Filter input must still be present and keep the value (so user can clear it)
    const input = getFilterInput();
    expect(input.value).toBe('does-not-match-anything');

    // Clear button should be visible
    const clearBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Clear filter"]',
    ) as HTMLButtonElement | null;
    expect(clearBtn).toBeTruthy();

    // Empty-state row should be visible with "no results" messaging
    const noDataRow =
      fixture.nativeElement.querySelector('tr.mat-mdc-no-data-row') ||
      fixture.nativeElement.querySelector('tr.mat-no-data-row');

    expect(noDataRow).toBeTruthy();
    expect((noDataRow as HTMLElement).textContent).toContain('No results match');
    expect((noDataRow as HTMLElement).textContent).toContain('does-not-match-anything');

    // Clicking clear restores all rows
    clearBtn!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getFilterInput().value).toBe('');
    expect(getRenderedRowEls().length).toBe(3);
  });
});

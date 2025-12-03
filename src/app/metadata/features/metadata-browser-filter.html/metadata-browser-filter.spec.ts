/**
 * Test the metadata browser filter component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { fakeActivatedRoute } from '@app/../mocks/route';
import { ConfigService } from '@app/shared/services/config';
import { MetadataBrowserFilterComponent } from './metadata-browser-filter';

describe('MetadataBrowserFilterComponent', () => {
  let component: MetadataBrowserFilterComponent;
  let fixture: ComponentFixture<MetadataBrowserFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataBrowserFilterComponent],
      providers: [
        RouterModule,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ConfigService, useValue: { massUrl: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataBrowserFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

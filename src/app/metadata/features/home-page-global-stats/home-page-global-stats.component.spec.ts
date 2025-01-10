/**
 * Test the global stats component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageGlobalStatsComponent } from './home-page-global-stats.component';

describe('HomePageGlobalStatsComponent', () => {
  let component: HomePageGlobalStatsComponent;
  let fixture: ComponentFixture<HomePageGlobalStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageGlobalStatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageGlobalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

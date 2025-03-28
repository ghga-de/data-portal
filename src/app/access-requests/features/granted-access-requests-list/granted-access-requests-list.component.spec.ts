/**
 * This module contains the tests for the GrantedAccessRequestsListComponent.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { fakeActivatedRoute } from '@app/../mocks/route';
import {
  AccessRequestService,
  MockAccessRequestService,
} from '@app/access-requests/services/access-request.service';
import { GrantedAccessRequestsListComponent } from './granted-access-requests-list.component';

describe('GrantedAccessRequestsListComponent', () => {
  let component: GrantedAccessRequestsListComponent;
  let fixture: ComponentFixture<GrantedAccessRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrantedAccessRequestsListComponent],
      providers: [
        { provide: AccessRequestService, useClass: MockAccessRequestService },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GrantedAccessRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/**
 * This module contains the tests for the GrantedAccessGrantsListComponent.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { fakeActivatedRoute } from '@app/../mocks/route';
import { AccessRequestService } from '@app/access-requests/services/access-request';
import { MockAccessRequestService } from '@app/access-requests/services/access-request.mock-service';
import { GrantedAccessGrantsListComponent } from './granted-access-grants-list';

describe('GrantedAccessGrantsListComponent', () => {
  let component: GrantedAccessGrantsListComponent;
  let fixture: ComponentFixture<GrantedAccessGrantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrantedAccessGrantsListComponent],
      providers: [
        { provide: AccessRequestService, useClass: MockAccessRequestService },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GrantedAccessGrantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

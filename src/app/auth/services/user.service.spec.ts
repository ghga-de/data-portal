/**
 * User service tests
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@app/shared/services/config.service';
import { UserService } from './user.service';

/**
 * Mock ConfigService for testing
 */
class MockConfigService {
  authUrl = 'http://mock.dev/auth';
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, { provide: ConfigService, useClass: MockConfigService }],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have allUsers resource with default empty array', () => {
    expect(service.allUsers.value()).toEqual([]);
  });
});

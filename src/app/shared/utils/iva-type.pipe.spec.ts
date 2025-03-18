/**
 * These are the unit tests for the IVA type pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { IvaTypePipe } from './iva-type.pipe';

describe('IvaTypePipe', () => {
  it('can create an instance', () => {
    const pipe = new IvaTypePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return {display: "SMS",typeAndValue: "SMS: +49123456789",icon: "smartphone"} for "unverified"', () => {
    const pipe = new IvaTypePipe();
    const result = pipe.transform('Phone', '+49123456789');
    expect(result).toStrictEqual({
      display: 'SMS',
      typeAndValue: 'SMS: +49123456789',
      icon: 'smartphone',
    });
  });

  it('should return {display:"error",class:""} for "error"', () => {
    const pipe = new IvaTypePipe();
    const result = pipe.transform('error', 'error');
    expect(result).toStrictEqual({
      display: 'error',
      typeAndValue: '',
      icon: '',
    });
  });

  it('should return {display:"",class:""} for ""', () => {
    const pipe = new IvaTypePipe();
    const result = pipe.transform('');
    expect(result).toStrictEqual({
      display: '',
      typeAndValue: '',
      icon: '',
    });
  });
});

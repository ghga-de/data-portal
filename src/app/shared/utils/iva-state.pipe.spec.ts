/**
 * These are the unit tests for the IVA state pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { IvaStatePipe } from './iva-state.pipe';

describe('IvaStatePipe', () => {
  it('can create an instance', () => {
    const pipe = new IvaStatePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return {display:"Code Requested",class:"text-warning"} for "CodeRequested"', () => {
    const pipe = new IvaStatePipe();
    const result = pipe.transform('CodeRequested');
    expect(result).toStrictEqual({ display: 'Code Requested', class: 'text-warning' });
  });

  it('should return {display:"error",class:""} for "error"', () => {
    const pipe = new IvaStatePipe();
    const result = pipe.transform('error');
    expect(result).toStrictEqual({ display: 'error', class: '' });
  });

  it('should return {display:"",class:""} for ""', () => {
    const pipe = new IvaStatePipe();
    const result = pipe.transform('');
    expect(result).toStrictEqual({ display: '', class: '' });
  });
});

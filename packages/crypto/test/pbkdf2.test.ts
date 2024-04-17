import { bufferFromString, pbkdf2 } from '..';

/**
 * @group node
 * @group browser
 */
describe('pbkdf2', () => {
  it('should compute the PBKDF2 hash correctly', () => {
    const passwordBuffer = bufferFromString(String('password123').normalize('NFKC'), 'utf-8');
    const saltBuffer = bufferFromString(String('salt456').normalize('NFKC'), 'utf-8');
    const iterations = 1000;
    const keylen = 32;
    const algo = 'sha256';
    const expectedResult = '0x90eceedd899d5cdcdfd9b315ad6e2c3391bf95cc131b6f0f016339db5ee60494';

    const result = pbkdf2(passwordBuffer, saltBuffer, iterations, keylen, algo);

    expect(result).toBe(expectedResult);
  });

  it('should use the registered function for PBKDF2 computation', () => {
    const mockPbkdf2 = (password, salt, iterations, keylen, algo) => '';
    pbkdf2.register(mockPbkdf2);
    vi.spyOn(pbkdf2, 'mockPbkdf2');

    const passwordBuffer = bufferFromString(String('password123').normalize('NFKC'), 'utf-8');
    const saltBuffer = bufferFromString(String('salt456').normalize('NFKC'), 'utf-8');
    const iterations = 1000;
    const keylen = 32;
    const algo = 'sha256';

    pbkdf2(passwordBuffer, saltBuffer, iterations, keylen, algo);

    expect(mockPbkdf2).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      expect.any(Uint8Array),
      iterations,
      keylen,
      algo
    );
  });

  it('should throw an error when registering a function after locking', () => {
    pbkdf2.lock();

    expect(() => {
      pbkdf2.register(() => {});
    }).toThrowError('pbkdf2 is locked');
  });

  it('should have a frozen object', () => {
    expect(Object.isFrozen(pbkdf2)).toBe(true);
  });
});

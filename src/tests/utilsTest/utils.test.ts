import { calculatePreparationTime } from '../../utils/orderUtils';
describe('calculatePreparationTime', () => {

  it('handles items with zero complexity', () => {
    const time = calculatePreparationTime(
      20,
      [{ quantity: 5, preparationComplexity: 0 }],
      false
    );
    expect(time).toBe(20); // Should equal base time since complexity is 0
  });

  
  it('handles mix of items with varying preparation complexities', () => {
    const time = calculatePreparationTime(
      20,
      [
        { quantity: 2, preparationComplexity: 0 },
        { quantity: 1, preparationComplexity: 3 }
      ],
      false
    );
    // Only the last item should contribute: 20 + (1*3*2) = 26, rounded to 30
    expect(time).toBe(30);
  });

 
  it('returns exact time when already multiple of 5', () => {
    const time = calculatePreparationTime(
      20,
      [{ quantity: 5, preparationComplexity: 1 }],
      false
    );
    // 20 + (5*1*2) = 30, which is already a multiple of 5
    expect(time).toBe(30);
  });

  it('rounds 21 minutes to 25, not 20', () => {
    const time = calculatePreparationTime(
      21,
      [],
      false
    );
    expect(time).toBe(25); // Math.ceil(21/5)*5 = 25
  });

  it('applies peak hour multiplier', () => {
    const time = calculatePreparationTime(20, [], true);
    // 20 * 1.5 = 30
    expect(time).toBe(30);
  });

  it('handles items with very high complexity', () => {
    const time = calculatePreparationTime(
      20,
      [{ quantity: 1, preparationComplexity: 100 }],
      false
    );
    // 20 + (1*100*2) = 220
    expect(time).toBe(220);
    expect(time % 5).toBe(0);
  });

  it('correctly rounds after applying peak hour multiplier', () => {
    const time = calculatePreparationTime(
      20,
      [{ quantity: 1, preparationComplexity: 1 }],
      true
    );
    // 20 + (1*1*2) = 22, then 22 * 1.5 = 33, rounds to 35
    expect(time).toBe(35);
  });
});
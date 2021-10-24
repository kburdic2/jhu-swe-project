const mathOperations = require('./calculator');

describe("Calculator test1", () => {
 test('adding 1 + 2 should return 3', () => {
   expect(mathOperations.sum(1, 2)).toBe(3);
 });
})

describe("Calculator test2", () => {
 test('subtracting 6 - 2 should return 4', () => {
   // arrange and act
   var result = mathOperations.diff(6,2)

   // assert
   expect(result).toBe(4);
 });
})

describe("Calculator test3", () => {
  test('mult 2 * 4 should return 8', () => {
    // arrange and act
    var result = mathOperations.product(2,4)
 
    // assert
    expect(result).toBe(8);
});
})

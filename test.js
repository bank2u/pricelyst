// Import Node.js's built-in assertion library
const assert = require('assert');

// Import the functions to be tested from logic.js
const { getUnitType, calculateComparison } = require('./logic.js');

// =================================================================
// --- Unit Tests ---
// =================================================================
const runUnitTests = () => {
    console.log("Running Pricelyst Unit Tests...");
    
    // Test case 1: Basic volume comparison
    try {
        let testData1 = [
            { id: 1, price: 100, quantity: 500, unit: 'ml' }, // 0.2 / ml
            { id: 2, price: 150, quantity: 1, unit: 'L' }      // 0.15 / ml
        ];
        let result1 = calculateComparison(testData1);
        assert.deepStrictEqual(result1.bestProductIds, [2], "Test 1 Failed: Basic volume comparison");
        console.log("✔ Test 1 Passed");
    } catch (error) {
        console.error(error);
    }
    
    // Test case 2: Tie for best price
    try {
        let testData2 = [
            { id: 1, price: 100, quantity: 500, unit: 'g' }, // 0.2 / g
            { id: 2, price: 200, quantity: 1, unit: 'kg' }   // 0.2 / g
        ];
        let result2 = calculateComparison(testData2);
        assert.deepStrictEqual(result2.bestProductIds.sort(), [1, 2].sort(), "Test 2 Failed: Tie for best price");
        console.log("✔ Test 2 Passed");
    } catch(error) {
        console.error(error);
    }

    // Test case 3: Incompatible units
    try {
        let testData3 = [
            { id: 1, price: 100, quantity: 500, unit: 'ml' },
            { id: 2, price: 200, quantity: 1, unit: 'kg' }
        ];
        let result3 = calculateComparison(testData3);
        assert.strictEqual(result3.shouldShowResults, false, "Test 3.1 Failed: Incompatible units should not show results");
        assert.strictEqual(result3.results[1].isComparable, false, "Test 3.2 Failed: Incompatible unit not flagged");
        console.log("✔ Test 3 Passed");
    } catch(error) {
        console.error(error);
    }

    // Test case 4: Unitless comparison
    try {
        let testData4 = [
            { id: 1, price: 10, quantity: 2 }, // 5 / item
            { id: 2, price: 12, quantity: 3 }  // 4 / item
        ];
        let result4 = calculateComparison(testData4);
        assert.deepStrictEqual(result4.bestProductIds, [2], "Test 4 Failed: Unitless comparison");
        console.log("✔ Test 4 Passed");
    } catch(error) {
        console.error(error);
    }

    // Test case 5: getUnitType function
    try {
        assert.strictEqual(getUnitType('kg'), 'weight', "Test 5.1 Failed: getUnitType for 'kg'");
        assert.strictEqual(getUnitType('ml'), 'volume', "Test 5.2 Failed: getUnitType for 'ml'");
        assert.strictEqual(getUnitType(null), null, "Test 5.3 Failed: getUnitType for null");
        console.log("✔ Test 5 Passed");
    } catch(error) {
        console.error(error);
    }

    console.log("\nAll tests completed.");
};

// Run the tests
runUnitTests();
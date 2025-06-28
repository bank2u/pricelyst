// =================================================================
// --- Shared Constants & Configuration ---
// =================================================================

export const unitTypes = { 
    'volume': ['ml', 'L'],
    'weight': ['g', 'kg', 'oz', 'lb'],
    'length': ['cm', 'm', 'in', 'ft'],
};

export const conversionFactors = { 
    'ml': 1, 'L': 1000,
    'g': 1, 'kg': 1000, 'oz': 28.3495, 'lb': 453.592,
    'cm': 1, 'm': 100, 'in': 2.54, 'ft': 30.48,
};

export const unitIcons = { 'volume': '💧', 'weight': '⚖️', 'length': '📏', 'unitless': '📦' };


// =================================================================
// --- Core Logic (Testable Functions) ---
// =================================================================

/**
 * Helper to find the type of a given unit (e.g., 'ml' -> 'volume').
 * @param {string} unit - The unit to check.
 * @returns {string|null} - The type of the unit or null.
 */
export const getUnitType = (unit) => {
    if (!unit) return null;
    return Object.keys(unitTypes).find(type => unitTypes[type].includes(unit));
};

/**
 * Takes an array of product data, calculates prices, and finds the best deals.
 * This function is pure and does not interact with the DOM.
 * @param {Array<Object>} productData - An array of product objects.
 * @returns {Object} - An object containing the processed results.
 */
export const calculateComparison = (productData) => {
    const activeUnitType = productData.map(p => getUnitType(p.unit)).find(type => type) || null;
    
    const results = productData.map(p => {
        const currentUnitType = getUnitType(p.unit);
        let pricePerBaseUnit = null;
        let isComparable = false;

        // Check if the product is comparable
        if ((!activeUnitType && !currentUnitType) || (activeUnitType && currentUnitType === activeUnitType)) {
            isComparable = true;
        }

        if (p.price > 0 && p.quantity > 0 && isComparable) {
            const baseUnitValue = p.quantity * (conversionFactors[p.unit] || 1);
            pricePerBaseUnit = p.price / baseUnitValue;
        }
        
        return { ...p, pricePerBaseUnit, isComparable };
    });
    
    const comparableProducts = results.filter(p => p.pricePerBaseUnit !== null);
    const shouldShowResults = comparableProducts.length >= 2;

    let bestPrice = null;
    if (shouldShowResults) {
            bestPrice = Math.min(...comparableProducts.map(p => p.pricePerBaseUnit));
    }

    const bestProductIds = bestPrice === null ? [] : comparableProducts
        .filter(p => p.pricePerBaseUnit === bestPrice)
        .map(p => p.id);
    
    return { results, bestProductIds, shouldShowResults };
};

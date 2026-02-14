// matchEngine.js - Smart Matching Logic for Foundira

/**
 * Stop words to remove from search terms for better keyword matching
 */
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'my', 'your',
    'lost', 'found', 'item', 'missing', 'looking'
]);

/**
 * Tokenize text into meaningful keywords
 * @param {string} text 
 * @returns {Set<string>} Set of unique keywords
 */
function tokenize(text) {
    if (!text) return new Set();
    return new Set(
        text.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 2 && !STOP_WORDS.has(word))
    );
}

/**
 * Calculate Jaccard similarity coefficient for two sets of tokens
 * @param {Set} setA 
 * @param {Set} setB 
 * @returns {number} 0.0 to 1.0
 */
function jaccardSimilarity(setA, setB) {
    if (setA.size === 0 && setB.size === 0) return 0;
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
}

/**
 * Calculate time difference in hours
 * @param {string} date1 
 * @param {string} date2 
 * @returns {number} hours difference
 */
function getHoursDifference(date1, date2) {
    if (!date1 || !date2) return Infinity;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    // Return absolute difference in hours
    return Math.abs(d1 - d2) / 36e5;
}

/**
 * Core matching function
 * Compares a Lost item against a Found item and returns a match score details
 * 
 * Scoring Weights (Total 100):
 * - Category Match: +30 (Critical)
 * - Location Match: +25 (High importance)
 * - Title Keywords: +20
 * - Description Keywords: +15
 * - Time Proximity (<24h): +10
 */
function calculateMatchScore(lostItem, foundItem) {
    let score = 0;
    let reasons = [];

    // 0. Sanity Check: Must be different types (Lost vs Found) or generally matching context
    // In our case we compare Lost item (query) vs Found item (candidate)

    // 1. Category Match (Max 30) - Strict Filter usually, but we'll score it
    // If categories don't match (e.g. Phone vs Umbrella), score is penalized heavily implicitly by lack of visual/keyword match,
    // but here we might want to be strict.
    // However, some users might miscategorize "Electronics" vs "Mobile".
    // For specific hackathon simple logic: Exact match = 30 points.
    if (lostItem.category === foundItem.category ||
        (lostItem.title.toLowerCase().includes(foundItem.category.toLowerCase()))) {
        score += 30;
        reasons.push("Category match");
    }

    // 2. Location Analysis (Max 25)
    // Simple string inclusion or token match
    const locA = tokenize(lostItem.location);
    const locB = tokenize(foundItem.location);
    const locSim = jaccardSimilarity(locA, locB);

    if (locSim > 0.3) {
        const locScore = Math.round(locSim * 25);
        score += locScore;
        reasons.push(`Location Match (${Math.round(locSim * 100)}%)`);
    }

    // 3. Title Keyword Matching (Max 20)
    const titleA = tokenize(lostItem.title);
    const titleB = tokenize(foundItem.title);
    const titleSim = jaccardSimilarity(titleA, titleB);

    if (titleSim > 0) {
        const tScore = Math.round(titleSim * 20);
        score += tScore;
        reasons.push("Title similarity");
    }

    // 4. Description Context (Max 15)
    const descA = tokenize(lostItem.description);
    const descB = tokenize(foundItem.description);
    const descSim = jaccardSimilarity(descA, descB);

    if (descSim > 0) {
        const dScore = Math.round(descSim * 15);
        score += dScore;
        reasons.push("Description details match");
    }

    // 5. Time Proximity (Max 10)
    // "Lost" time should be ideally before "Found" time, but close.
    // We allow found time to be slightly before lost time (reporting error) or after.
    const timeDiff = getHoursDifference(lostItem.lastSeenTime, foundItem.lastSeenTime);
    if (timeDiff <= 24) {
        score += 10;
        reasons.push("Time match (<24h)");
    } else if (timeDiff <= 48) {
        score += 5;
    }

    return {
        score: Math.min(100, score),
        reasons: reasons,
        foundItem: foundItem
    };
}

/**
 * Find matches for a specific item against a database of items
 * @param {Object} targetItem - The item we are looking for (e.g., Lost Item)
 * @param {Array} databaseItems - List of potential matches (e.g., Found Items)
 * @param {number} threshold - Minimum score to include in results (default 30)
 * @returns {Array} Sorted list of matches
 */
function findMatches(targetItem, databaseItems, threshold = 30) {
    if (!targetItem || !databaseItems) return [];

    const matches = databaseItems
        .filter(item => item.id !== targetItem.id) // Don't match self
        .filter(item => item.category !== targetItem.category) // Must match Lost <-> Found
        .map(item => calculateMatchScore(targetItem, item))
        .filter(result => result.score >= threshold)
        .sort((a, b) => b.score - a.score);

    return matches;
}

// Check if running in browser environment
if (typeof window !== 'undefined') {
    window.MatchEngine = {
        findMatches,
        calculateMatchScore
    };
} else {
    // NodeJS export for testing if needed
    module.exports = { findMatches, calculateMatchScore };
}

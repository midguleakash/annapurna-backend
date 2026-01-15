// utils/aiHelper.js

// Distance calculation (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in KM
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 🧠 AI Matching Score
function calculateScore(donation, request) {
    let score = 0;

    // Food match
    if (
        donation.foodType.toLowerCase() ===
        request.foodType.toLowerCase()
    ) {
        score += 40;
    }

    // Quantity match
    if (donation.quantity >= request.quantity) {
        score += 20;
    }

    // Distance check
    const distance = getDistance(
        donation.location.lat,
        donation.location.lng,
        request.location.lat,
        request.location.lng
    );

    if (distance < 3) score += 20;

    // Urgency check
    const hoursWaiting =
        (Date.now() - new Date(request.createdAt)) / (1000 * 60 * 60);

    if (hoursWaiting > 3) score += 20;

    return score;
}

// 🔥 Priority AI
function getPriority(request) {
    const hours =
        (Date.now() - new Date(request.createdAt)) / (1000 * 60 * 60);

    if (hours > 5) return "HIGH";
    if (hours > 2) return "MEDIUM";
    return "LOW";
}

module.exports = {
    calculateScore,
    getPriority
};

const Donation = require("../models/Donation");
const ReceiverRequest = require("../models/ReceiverRequest");
const { calculateScore, getPriority } = require("../utils/aiHelper");

// 🎯 AI Suggest Receivers
exports.suggestReceivers = async (req, res) => {
    try {

        console.log("AI HIT for donation:", req.params.donationId);

        const donation = await Donation.findById(req.params.donationId);
        console.log("Donation:", donation);

        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        const requests = await ReceiverRequest.find({ status: "Waiting" })
            .populate("receiver")
            .populate("donor")
            .populate("volunteer");



        const scored = requests.map(r => {

            const score = calculateScore(donation, r);

            return {
                request: {
                    ...r._doc,
                    priority: getPriority(score)
                },
                score
            };

        });



        scored.sort((a, b) => b.score - a.score);

        res.json(scored.slice(0, 5));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// 🎯 AI Priority Prediction
exports.getRequestsWithPriority = async (req, res) => {
    try {
        const requests = await ReceiverRequest.find();

        const withPriority = requests.map(r => ({
            ...r._doc,
            priority: getPriority(r)
        }));

        res.json(withPriority);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

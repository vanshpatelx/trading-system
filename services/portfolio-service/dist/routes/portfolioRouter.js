"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const portfolioController_1 = require("../controllers/portfolioController");
const router = (0, express_1.Router)();
router.post('/reset', async (req, res) => {
    const { userId } = req.body;
    try {
        await (0, portfolioController_1.resetUserPortfolioConnection)(userId);
        res.status(200).json({ message: 'Portfolio reset' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to reset portfolio connection' });
    }
});
exports.default = router;

import { Router } from 'express';
import { resetUserPortfolioConnection } from '../controllers/portfolioController';

const router = Router();

router.post('/reset', async (req, res) => {
  const { userId } = req.body;
  try {
    await resetUserPortfolioConnection(userId);
    res.status(200).json({ message: 'Portfolio reset' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset portfolio connection' });
  }
});

export default router;

import jwt from 'jsonwebtoken';
import express from 'express';
import WebSocket from 'ws';
import portfolioRouter from './routes/portfolioRouter';
import { handleWebSocketConnection } from './controllers/portfolioController';
// import { authenticateToken } from './middleware/authMiddleware';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use('/portfolio', portfolioRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});
// Set up HTTP server
const server = app.listen(3000, () => console.log('Server running on port 3000'));


// Set up WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket, req) => {
  const token = req.url?.split('token=')[1];
  if (!token) {
    ws.send(JSON.stringify({ error: 'Token is required' }));
    ws.close();
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      ws.send(JSON.stringify({ error: 'Invalid token' }));
      ws.close();
      return;
    }

    const userId = (user as any)?.id;
    if (!userId) {
      ws.send(JSON.stringify({ error: 'User ID not found in token' }));
      ws.close();
      return;
    }

    handleWebSocketConnection(ws, userId);
  });
});

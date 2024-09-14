import WebSocket from 'ws';
import { getPortfolioByUserId } from '../models/portfolioModel';
import { Stock } from '../models/portfolioModel';

const clients = new Map<string, WebSocket>();
export async function handleWebSocketConnection(ws: WebSocket, userId: string) {
  console.log(`User ${userId} connected`);
  clients.set(userId, ws);

  const portfolio = await getPortfolioByUserId(userId);
  if (!portfolio) {
    ws.send(JSON.stringify({ error: 'Portfolio not found' }));
    ws.close();
    return;
  }

  const stockPriceSocket = connectToStockPriceServer(portfolio, ws);

  ws.on('close', () => {
    console.log(`User ${userId} disconnected`);
    clients.delete(userId);
    stockPriceSocket.close();
  });
}

function connectToStockPriceServer(portfolio: any, clientSocket: WebSocket) {
  const stockSymbols = portfolio.map((stock: Stock) => stock.symbol);
  const stockPriceSocket = new WebSocket('ws://stockpriceserver.com');

  stockPriceSocket.on('open', () => {
    console.log('Connected to stock price server');
    stockPriceSocket.send(JSON.stringify({ action: 'subscribe', stocks: stockSymbols }));
  });

  stockPriceSocket.on('message', (data) => {
    clientSocket.send(data);
  });

  stockPriceSocket.on('close', () => {
    console.log('Stock price server disconnected');
  });

  return stockPriceSocket;
}

export async function resetUserPortfolioConnection(userId: string) {
  const ws = clients.get(userId);
  if (ws) {
    const portfolio = await getPortfolioByUserId(userId);
    if (portfolio) {
      ws.send(JSON.stringify({ message: 'Portfolio updated, reconnecting...' }));
      ws.close();
    }
  }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebSocketConnection = handleWebSocketConnection;
exports.resetUserPortfolioConnection = resetUserPortfolioConnection;
const ws_1 = __importDefault(require("ws"));
const portfolioModel_1 = require("../models/portfolioModel");
const clients = new Map();
async function handleWebSocketConnection(ws, userId) {
    console.log(`User ${userId} connected`);
    clients.set(userId, ws);
    const portfolio = await (0, portfolioModel_1.getPortfolioByUserId)(userId);
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
function connectToStockPriceServer(portfolio, clientSocket) {
    const stockSymbols = portfolio.map((stock) => stock.symbol);
    const stockPriceSocket = new ws_1.default('ws://stockpriceserver.com');
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
async function resetUserPortfolioConnection(userId) {
    const ws = clients.get(userId);
    if (ws) {
        const portfolio = await (0, portfolioModel_1.getPortfolioByUserId)(userId);
        if (portfolio) {
            ws.send(JSON.stringify({ message: 'Portfolio updated, reconnecting...' }));
            ws.close();
        }
    }
}

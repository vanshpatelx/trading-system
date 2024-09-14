"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const portfolioRouter_1 = __importDefault(require("./routes/portfolioRouter"));
const portfolioController_1 = require("./controllers/portfolioController");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/portfolio', portfolioRouter_1.default);
// Set up HTTP server
const server = app.listen(3000, () => console.log('Server running on port 3000'));
// Set up WebSocket server
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws, req) => {
    const token = req.url?.split('token=')[1];
    if (!token) {
        ws.send(JSON.stringify({ error: 'Token is required' }));
        ws.close();
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            ws.send(JSON.stringify({ error: 'Invalid token' }));
            ws.close();
            return;
        }
        const userId = user?.id;
        if (!userId) {
            ws.send(JSON.stringify({ error: 'User ID not found in token' }));
            ws.close();
            return;
        }
        (0, portfolioController_1.handleWebSocketConnection)(ws, userId);
    });
});

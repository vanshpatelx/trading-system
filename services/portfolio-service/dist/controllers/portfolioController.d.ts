import WebSocket from 'ws';
export declare function handleWebSocketConnection(ws: WebSocket, userId: string): Promise<void>;
export declare function resetUserPortfolioConnection(userId: string): Promise<void>;

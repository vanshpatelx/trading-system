"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolioByUserId = getPortfolioByUserId;
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
});
async function getPortfolioByUserId(userId) {
    const query = `SELECT stock_symbol, quantity FROM user_portfolio WHERE user_id = $1`;
    const result = await client.query(query, [userId]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows.map(row => ({
        symbol: row.stock_symbol,
        quantity: row.quantity,
    }));
}

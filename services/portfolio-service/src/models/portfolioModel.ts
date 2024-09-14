import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export async function getPortfolioByUserId(userId: string) {
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


export interface Stock {
  symbol: string;
  quantity: number;
}

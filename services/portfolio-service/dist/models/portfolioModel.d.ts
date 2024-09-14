export declare function getPortfolioByUserId(userId: string): Promise<{
    symbol: any;
    quantity: any;
}[] | null>;
export interface Stock {
    symbol: string;
    quantity: number;
}

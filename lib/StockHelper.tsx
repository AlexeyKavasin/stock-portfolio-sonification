// get and transform stock data

const MOCKED_STOCK_DATA = [
  {
    ticker: 'MSFT',
    change: 0,
    share: 10,
  },
  {
    ticker: 'NEE',
    change: -0.7,
    share: 3,
  }
];

export default class StockHelper {
  private static instance: StockHelper;

  constructor() {
    if (StockHelper.instance) {
      return StockHelper.instance;
    }

    StockHelper.instance = this;
  }

  fetchStockData() {
    return MOCKED_STOCK_DATA;
  }
}

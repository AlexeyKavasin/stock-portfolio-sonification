// get and transform stock data
// data doesn't change on saturdays and sundays, no need to fetch
import { getApiClient, getSheetsData } from '../utils/googlesheetapi';

export default class StockHelper {
  private static instance: StockHelper;
  private apiClient: any;

  constructor() {
    if (StockHelper.instance) {
      return StockHelper.instance;
    }

    StockHelper.instance = this;
  }

  async initializeApiClient() {
    this.apiClient = await getApiClient();
  }

  async fetchStockData() {
    const [sheet] = await getSheetsData(this.apiClient);

    return sheet.data;
  }
}

import { IStockData } from './composeStockData';

export function isDataUpdated(
  newData: { stocks: IStockData[] },
  currentData: IStockData[]
) {
  if (!newData || !newData.stocks || !newData.stocks.length || !currentData || !currentData.length) {
    return false;
  }

  return JSON.stringify(newData.stocks) !== JSON.stringify(currentData);
}

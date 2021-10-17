export interface IGoogleRow {
  values: IGoogleRowValue[];
}

export interface IGoogleRowValue {
  formattedValue: string;
}

export interface IStockData {
  ticker: string;
  changePct: number;
  share: number;
  price: number;
}

export function composeStockData(rows: any): IStockData[] {
  if (!rows || !rows.length) {
    return [];
  }

  return rows.reduce((acc: IGoogleRow[], item: IGoogleRow) => {
    const ticker = item.values[0].formattedValue;
    const changePct = Number(item.values[3].formattedValue?.replace(',', '.'));
    const price = Number(item.values[5].formattedValue?.replace(',', '.'));
    const share = Number(item.values[7].formattedValue?.replace(',', '.'));
    
    return [...acc, {
      ticker,
      changePct,
      share,
      price,
    }];
  }, []);
}

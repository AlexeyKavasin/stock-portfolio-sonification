export interface IGoogleRow {
  values: IGoogleRowValue[];
}

export interface IGoogleRowValue {
  formattedValue: string;
}

export interface IStockData {
  ticker: string;
  changePct: string;
  share: string;
}

export function composeStockData(rows: any): IStockData[] {
  if (!rows || !rows.length) {
    return [];
  }

  return rows.reduce((acc: IGoogleRow[], item: IGoogleRow) => {
    const ticker = item.values[0].formattedValue;
    const changePct = item.values[3].formattedValue;
    const share = item.values[7].formattedValue;

    
    return [...acc, {
      ticker,
      changePct: changePct && changePct.startsWith('-') ? changePct : `+${changePct}`,
      share
    }];
  }, []);
}

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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function composeStockData(data: any): IStockData[] {
  return data && data.stocks ? data.stocks : [];
}

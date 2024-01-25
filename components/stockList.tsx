import { IStockData } from '../utils/composeStockData';
import styles from '../styles/Main.module.css';

type TStockListProps = {
  stockData: IStockData[];
};

export const StockList = ({ stockData }: TStockListProps) => {
  return (
    <div className={styles.stockListWrapper}>
      <ul className={styles.stockList}>
        {stockData.map((s) => {
          return (
            <li
              key={`stock-${s.ticker}`}
              className={`${styles.stockListItem} ${s.changePct >= 0 ? styles.green : styles.red}`}
            >
              {s.ticker} {s.changePct}%
            </li>
          );
        })}
      </ul>
    </div>
  );
};

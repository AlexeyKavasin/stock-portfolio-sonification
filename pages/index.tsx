import type { NextPage } from 'next';
import StockHelper from '../lib/StockHelper';
import { composeStockData } from '../utils/composeStockData';
import styles from '../styles/Main.module.css';

const stockHelper = new StockHelper();

const Index: NextPage = ({ data }: any) => {
  const rows = data && data.length ? data[0].rowData : [];
  const stockData = rows.length ? composeStockData(rows.slice(1, rows.length - 1)) : [];

  return (
    <div>
      <main className={styles.main}>
        💰
      </main>
      {stockData && stockData.length ? (
        <footer>
          <ul className={styles.stockList}>
            {stockData.map((s) => {
              return <li
                key={`stock-${s.ticker}`}
                className={`${styles.stockListItem} ${s.changePct.startsWith('+') ? styles.green : styles.red}`}>
                {s.ticker} {s.changePct}%
              </li>;
            })}
          </ul>
        </footer>
      ) : null}
    </div>
  )
}

export async function getStaticProps() {
  await stockHelper.initializeApiClient();

  return {
    props: {
      data: await stockHelper.fetchStockData(),
    },
    revalidate: 60,
  };
}

export default Index;

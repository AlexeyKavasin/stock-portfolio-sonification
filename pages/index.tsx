import type { NextPage } from 'next';
import StockHelper from '../lib/StockHelper';
import styles from '../styles/Main.module.css';

const Index: NextPage = () => {
  const stockHelper = new StockHelper();
  const stockData = stockHelper.fetchStockData();
  console.log(stockData);

  return (
    <div>
      <main className={styles.main}>
        💰
      </main>
    </div>
  )
}

export default Index;

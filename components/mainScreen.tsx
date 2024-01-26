/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Tone from 'tone';

import { useState } from 'react';
import { SoundButton } from './soundButton';
import { StockList } from './stockList';
import { useSequence } from '../hooks/hooks';

import styles from '../styles/Main.module.css';

type TMainScreenProps = {
  stockData: any;
  isLoading: boolean;
};

export default function MainScreen({ stockData, isLoading }: TMainScreenProps) {
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);

  useSequence(stockData, isSoundOn);

  const toggleSound = () => {
    // todo check toggling (cb)
    if (!isSoundOn) {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }

      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
    setIsSoundOn(!isSoundOn);
  };

  return (
    <div>
      <main className={styles.main}>
        {isLoading && <div className={styles.loader}></div>}
        {!isLoading && <SoundButton isSoundOn={isSoundOn} onToggleSound={toggleSound} disabled={!stockData.length} />}
      </main>
      <footer>{Boolean(stockData && stockData.length) && <StockList stockData={stockData} />}</footer>
    </div>
  );
}

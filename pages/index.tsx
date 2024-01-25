/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { credentials } from '../credentials';
import { composeStockData, IStockData } from '../utils/composeStockData';
import { isDataUpdated } from '../utils/isDataUpdated';
import { SequenceCreator } from '../lib/sequenceCreator';
import { StockList } from '../components/stockList';
import { SoundButton } from '../components/soundButton';
import styles from '../styles/Main.module.css';

const REQUEST_INTERVAL = 1000 * 60 * 5;
const fetcher = (...args: [any]) => fetch(...args).then((res) => res.json());

const Index = () => {
  // todos
  // data doesn't change on saturdays and sundays, no need to fetch
  const { data, mutate, isLoading } = useSWR(credentials.web_api, fetcher);
  const [soundOn, turnSoundOn] = useState<boolean>(false);
  // todo use useSequence
  const [sequence, setSequence] = useState<any>(null);
  const [stockData, setStockData] = useState<IStockData[]>([]);

  let interval: any = null;

  const createAudio = () => {
    if (!sequence) {
      // create bg tone?
      setSequence(new SequenceCreator(stockData));
    } else {
      sequence.update(stockData);
    }
  };

  const startTimer = () => {
    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      // send req and update with fetched data
      mutate();
    }, REQUEST_INTERVAL);
  };

  const toggleSound = () => {
    turnSoundOn(!soundOn);

    if (!soundOn) {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }

      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
  };

  useEffect(() => {
    // initial data -> start timer
    if (data && !stockData.length) {
      setStockData(composeStockData(data));
      startTimer();
    }

    // new data -> updateAudio
    if (data && isDataUpdated(data, stockData)) {
      setStockData(composeStockData(data));
    }

    if (soundOn) {
      createAudio();
    }
  }, [data, stockData, soundOn]);

  return (
    <div>
      <main className={styles.main}>
        {isLoading && <div className={styles.loader}></div>}
        {!isLoading && <SoundButton isSoundOn={soundOn} onToggleSound={toggleSound} disabled={!stockData.length} />}
      </main>
      <footer>{Boolean(stockData && stockData.length) && <StockList stockData={stockData} />}</footer>
    </div>
  );
};

export default Index;

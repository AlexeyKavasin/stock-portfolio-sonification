/* eslint-disable react-hooks/exhaustive-deps */
import * as Tone from 'tone';
import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { credentials } from '../credentials';
import { composeStockData, IStockData } from '../utils/composeStockData';
import { isDataUpdated } from '../utils/isDataUpdated';
import { SequenceCreator } from '../lib/sequenceCreator';
import styles from '../styles/Main.module.css'; 

const REQUEST_INTERVAL = 1000 * 60 * 5;
const fetcher = (...args: [any]) => fetch(...args).then(res => res.json());

const Index = () => {
  // TODO
  // data doesn't change on saturdays and sundays, no need to fetch
  const { data, mutate } = useSWR(credentials.web_api, fetcher);
  const [soundOn, turnSoundOn] = useState<boolean>(false);
  const [sequence, setSequence] = useState<any>(null);
  const [stockData, setStockData] = useState<IStockData[]>([]);

  let interval: NodeJS.Timer | null = null;

  const createAudio = () => {
    if (!sequence) {
      // create with stockData
      // setSequence(new SequenceCreator(stockData));
      setSequence(new SequenceCreator(stockData));
    } else {
      // sequence.update(stockData);
      sequence.update();
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
      // play sound
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
        <button onClick={toggleSound}>{soundOn ? 'Sound off' : 'Sound on'}</button>
      </main>
      {stockData && stockData.length ? (
        <footer>
          <ul className={styles.stockList}>
            {stockData.map((s) => {
              return <li
                key={`stock-${s.ticker}`}
                className={`${styles.stockListItem} ${s.changePct >= 0 ? styles.green : styles.red}`}>
                {s.ticker} {s.changePct}%
              </li>;
            })}
          </ul>
        </footer>
      ) : null}
    </div>
  );
};

export default Index;

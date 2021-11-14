/* eslint-disable react-hooks/exhaustive-deps */
import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { credentials } from '../credentials';
import { composeStockData, IStockData } from '../utils/composeStockData';
import { isDataUpdated } from '../utils/isDataUpdated';
import { SequencePattern } from '../lib/tone-helpers';
import styles from '../styles/Main.module.css'; 

const fetcher = (...args: [any]) => fetch(...args).then(res => res.json())

const Index = () => {
  // TODO
  // data doesn't change on saturdays and sundays, no need to fetch
  // 1 hour
  const { data } = useSWR(credentials.web_api, fetcher, { focusThrottleInterval: 60000 * 60 });
  const [soundOn, turnSoundOn] = useState<boolean>(false);
  const [stockData, setStockData] = useState<IStockData[]>([]);

  let interval: NodeJS.Timer | null = null;
  let pattern1: any = null;

  const initializeAudio = () => {
    // TODO map changePct and share
    // TODO create
    if (!pattern1) {
      pattern1 = new SequencePattern();
    } else {
      pattern1.destroy();
      pattern1.build(null, null, null, '8n');
    }
  };

  const startTimer = () => {
    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      // update with fetched data
      console.log('update sounds');
      initializeAudio();
    }, 10000);
  }

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
    if (data && !stockData.length) {
      setStockData(composeStockData(data));
      initializeAudio();
      startTimer();
    }

    if (data && isDataUpdated(data, stockData)) {
      setStockData(composeStockData(data));
    }
  }, [data, soundOn, stockData])

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
  )
}

export default Index;

/* eslint-disable react-hooks/exhaustive-deps */
import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { credentials } from '../credentials';
import { composeStockData, IStockData } from '../utils/composeStockData';
import { SequencePattern } from '../lib/tone-helpers';
import styles from '../styles/Main.module.css'; 

const fetcher = (...args: [any]) => fetch(...args).then(res => res.json())

function Index() {
  // TODO
  // data doesn't change on saturdays and sundays, no need to fetch
  const { data } = useSWR(credentials.web_api, fetcher, { refreshInterval: 30000 });
  const [soundOn, turnSoundOn] = useState<boolean>(false);
  const [stockData, setStockData] = useState<IStockData[]>([]);

  let interval: NodeJS.Timer | null = null;
  let pattern1: any = null;

  const createAudio = () => {
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
      setStockData(composeStockData(data));
      createAudio();
    }, 60000)
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
      // and data !== prev.data
      setStockData(composeStockData(data));
      createAudio();
      startTimer();
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

/* eslint-disable react-hooks/exhaustive-deps */
import * as Tone from 'tone';
import React, { useState, useEffect, useRef } from 'react';
// import useSWR from 'swr';
// import { credentials } from '../credentials';
// import { composeStockData, IStockData } from '../utils/composeStockData';
// import { isDataUpdated } from '../utils/isDataUpdated';
import { SequencePattern } from '../lib/tone-helpers';
import styles from '../styles/Main.module.css'; 

// const fetcher = (...args: [any]) => fetch(...args).then(res => res.json())

const patternConfig = [
  ['down', 0, '16n', '8n', 20],
  ['up', -5, '8n', '8n', 20],
];

const Index = () => {
  // TODO
  // data doesn't change on saturdays and sundays, no need to fetch
  // 1 hour
  // const { data, mutate } = useSWR(credentials.web_api, fetcher);
  const [soundOn, turnSoundOn] = useState<boolean>(false);
  const [patterns, setPatterns] = useState<any[]>([]);
  // const [stockData, setStockData] = useState<IStockData[]>([]);

  let interval: NodeJS.Timer | null = null;

  const createAudio = () => {
    // TODO create patterns and map with new data changePct and share
    // id = number, patternType = 'down', transposeNote = 0, noteDuration = '16n', tempo = '8n', reverbDecay = 20,
    if (!patterns.length) {
      const pattern1 = new SequencePattern(1, 'down', 0, '16n', '8n', 20);
      const pattern2 = new SequencePattern(2, 'up', 5, '8n', '8n', 20);

      setPatterns([pattern1, pattern2]);
    } else {
      patterns.forEach((p, ind) => {
        p.destroy();
        p.build(...patternConfig[ind]);
      });
    }
  };

  const startTimer = () => {
    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      // send req and update with fetched data
      // mutate();
    }, 30000);
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

  // useEffect(() => {
  //   initial data - start timer
  //   if (data && !stockData.length) {
  //     setStockData(composeStockData(data));
  //     startTimer();
  //   }
  //
  //   new data - updateAudio
  //   if (data && isDataUpdated(data, stockData)) {
  //     setStockData(composeStockData(data));
  //     createAudio();
  //   }
  // }, [data, stockData])

  useEffect(() => {
    if (soundOn) {
      createAudio();
    }
  }, [soundOn]);

  return (
    <div>
      <main className={styles.main}>
        <button onClick={toggleSound}>{soundOn ? 'Sound off' : 'Sound on'}</button>
      </main>
      {/* {stockData && stockData.length ? (
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
      ) : null} */}
    </div>
  );
};

export default Index;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { composeStockData } from '../utils/composeStockData';
import { useStockData } from '../hooks/hooks';
import MainScreen from '../components/mainScreen';

const REQUEST_INTERVAL = 1000 * 60 * 5;

const Index = () => {
  const { data, mutate, isLoading } = useStockData();
  const stockData = composeStockData(data);

  let interval: any = null;

  const startTimer = () => {
    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      // send req and update with fetched data
      mutate();
    }, REQUEST_INTERVAL);
  };

  useEffect(() => {
    // initial data -> start timer
    if (data) {
      startTimer();
    }
  }, [data]);

  return <MainScreen stockData={stockData} isLoading={isLoading} />;
};

export default Index;

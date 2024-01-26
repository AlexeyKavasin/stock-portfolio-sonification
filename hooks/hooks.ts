/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { SequenceCreator } from '../lib/sequenceCreator';
import { credentials } from '../credentials';
import useSWR from 'swr';

const fetcher = (...args: [any]) => fetch(...args).then((res) => res.json());

export function useSequence(stockData: any, isSoundOn: boolean) {
    const [sequence, setSequence] = useState<any>(null);


    useEffect(() => {
        if (!isSoundOn) {
            return;
        }

        if (!sequence) {
            setSequence(new SequenceCreator(stockData));
        } else {
            sequence.update(stockData);
        }
    }, [isSoundOn]);
}

export function useStockData() {
    const { data, mutate, isLoading } = useSWR(credentials.web_api, fetcher, {
        revalidateOnFocus: false,
    });

    return {
        data,
        isLoading,
        mutate,
    }
}
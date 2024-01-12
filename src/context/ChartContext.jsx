// ChartContext.js
import React, { createContext, useEffect, useReducer } from 'react';

// Initial state
const initialState = {
    forms: {
        annotation: {},
        general: {},
        xAxis: {},
        yAxis: {},
        styles: {},
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart',
            },
        },
    }

};

// Action types
export const UDPATE_FORM = 'UDPATE_FORM';
export const UPDATE_DATASETS = 'UPDATE_DATASETS';

// Reducer function
const reducer = (state, action) => {
    const { type, ...payload } = action
    switch (type) {
        case UDPATE_FORM: {
            const { data: forms } = payload
            return { ...state, forms };
        }
        case UPDATE_DATASETS:
            return { ...state, datasets: payload };
        default:
            return state;
    }
};
export const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
    const ColbyChartInfo = window.ColbyChartInfo
    if (!ColbyChartInfo) {
        throw Error('ColbyChartInfo is missing')
    }
    const { chartType, createDatasets, storageKey } = ColbyChartInfo
    if (!chartType || !createDatasets || !storageKey) {
        throw Error('ColbyChartInfo is insufficient')
    }

    // console.log('[ColbyChartInfo]', ColbyChartInfo)
    const storedState = JSON.parse(localStorage.getItem(storageKey)) || { ...initialState, chartType, data: createDatasets() };
    const [state, dispatch] = useReducer(reducer, storedState);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state, storageKey]);


    return (
        <ChartContext.Provider value={{ state, dispatch }}>
            {children}
        </ChartContext.Provider>
    );
};

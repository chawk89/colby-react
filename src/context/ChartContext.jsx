// ChartContext.js
import React, { createContext, useEffect, useReducer } from 'react';

// Initial state
const initialState = {
    annotation: {},
    general: {},
    datasets: [],
    xAxis: {},
    yAxis: {},
    styles: {},
};

// Action types
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

// Reducer function
const reducer = (state, action) => {
    const { type, ...payload } = action
    switch (type) {
        case INCREMENT:
            return { ...state, count: payload.count + 1 };
        case DECREMENT:
            return { count: payload.count - 1 };
        default:
            return state;
    }
};
export const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
    const storedState = JSON.parse(localStorage.getItem('appState')) || initialState;
    const [state, dispatch] = useReducer(reducer, storedState);

    useEffect(() => {
        localStorage.setItem('appState', JSON.stringify(state));
    }, [state]);

    return (
        <ChartContext.Provider value={{ state, dispatch }}>
            {children}
        </ChartContext.Provider>
    );
};

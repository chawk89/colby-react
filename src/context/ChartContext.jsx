// ChartContext.js
import React, { createContext, useReducer } from 'react';

// Initial state
const initialState = {
    count: 0,
};

// Action types
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

// Reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case INCREMENT:
            return { count: state.count + 1 };
        case DECREMENT:
            return { count: state.count - 1 };
        default:
            return state;
    }
};
export const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ChartContext.Provider value={{ state, dispatch }}>
            {children}
        </ChartContext.Provider>
    );
};

// ChartContext.js
import React, { createContext, useEffect, useReducer } from 'react';


// Initial state
const initialState = {
    forms: {
        annotation: {
            line: {
                enabled: false,
                axis: "X",
                position: "",
                style: "None",
                thickness: "1",
                color: "#180a0a"
            },
            box: {
                enabled: false
            },
            label: {
                enabled: false
            },
            arrow: {
                enabled: false
            }
        },
        general: {
            title: "asdfasdf",
            xAxis: "January",
            plotted: false,
            stacked: false,
            switchRowColumn: false,
            showLabels: false,
            showLegend: false
        },
        xAxis: {
            xMin: "",
            xMax: ""
        },
        yAxis: {
            yMin: "",
            yMax: ""
        },
        styles: {
            fontName: "Lora",
            fontSize: "18",
            fontColor: "#3e1818"
        }
    },
    options: {
        responsive: true,
        aspectRatio: 1,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '',
            },
            datalabels: {
                display: false,
                align: "end",
                anchor: "end",
                formatter: (value) => value,
            },
        },
        scales: {
            x: {
                stacked: false,
                title: {
                    display: true,
                    text: "Default X-Axis Label",
                },
            },
            y: {
                stacked: false,
                title: {
                    display: true,
                    text: "Default Y-Axis Label",
                },
            }
        }
    }

};

// Action types
export const UDPATE_FORM = 'UDPATE_FORM';
export const UPDATE_DATASETS = 'UPDATE_DATASETS';

const generalOptionUpdate = (oldOptions, general) => {
    const newOptions = { ...oldOptions }
    const {
        title,
        xAxis,
        plotted,
        stacked,
        switchRowColumn,
        showLabels,
        showLegend
    } = general
    // title
    newOptions.plugins.title.text = title
    // stacked
    newOptions.scales.y.stacked = stacked
    newOptions.scales.x.stacked = stacked
    // legend
    newOptions.plugins.legend.display = showLegend
    // show datalabels
    newOptions.plugins.datalabels.display = showLabels
    return newOptions
}
const updateAxisRangeValue = (oldOptions, { xAxis, yAxis }) => {
    const newOptions = { ...oldOptions }

    if (xAxis.min) newOptions.scales.x.suggestedMin = xAxis.min;
    if (xAxis.max) newOptions.scales.x.suggestedMax = xAxis.max;
    if (yAxis.min) newOptions.scales.y.suggestedMin = yAxis.min;
    if (yAxis.max) newOptions.scales.y.suggestedMax = yAxis.max;

    return newOptions
}

const updateGlobalStyles = (oldOptions, styles) => {
    const newOptions = { ...oldOptions }
    // styles
    // newOptions.plugins.title.text = title

    const { fontName, fontSize, fontColor } = styles
    const font = {}
    newOptions.plugins.title.color = fontColor
    if (fontName) {
        font.family = fontName
    }
    if (fontSize) {
        font.size = +fontSize
    }
    console.log('[font]', font, styles)
    newOptions.plugins.title.font = font
    return newOptions
}


const updateChartOptions = (oldOptions, forms) => {
    console.log(oldOptions, forms)
    // chart title
    const { annotation, general, xAxis, yAxis, styles } = forms

    // general options
    let newOptions = generalOptionUpdate(oldOptions, general)
    // axis options
    newOptions = updateAxisRangeValue(newOptions, { xAxis, yAxis })

    // updateGlobalStyles
    newOptions = updateGlobalStyles(newOptions, styles)

    return newOptions
}
// Reducer function
const reducer = (state, action) => {
    const { type, ...payload } = action
    switch (type) {
        case UDPATE_FORM: {
            const { data: forms } = payload
            const options = updateChartOptions(state.options, forms)
            const newState = { ...state, options, forms };
            return newState
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
    console.log('[storedState]', storedState)

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state, storageKey]);


    return (
        <ChartContext.Provider value={{ state, dispatch }}>
            {children}
        </ChartContext.Provider>
    );
};

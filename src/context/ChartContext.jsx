// ChartContext.js
import React, { createContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { AnnotationDragger } from '../utils/chart/AnnotationDragger';
import { md5 } from 'js-md5';

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
                color: "#180a0a",
                label: "",
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
            title: "",
            xAxis: "",
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
        },
        axes: {
            keyLabels: [],
        }
    },
    options: {
        responsive: true,
        events: ["mousedown", "mouseup", "mousemove", "mouseout", "mouseleave"],
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
            annotation: {
                annotations: {}
            }
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
    // switch RowColumn

    newOptions.indexAxis = switchRowColumn ? 'y' : 'x'
    return newOptions
}
const updateAxisRangeValue = (oldOptions, { xAxis, yAxis }) => {
    const newOptions = { ...oldOptions }

    if (xAxis.min) newOptions.scales.x.suggestedMin = xAxis.min;
    if (xAxis.max) newOptions.scales.x.suggestedMax = xAxis.max;
    if (xAxis.label) newOptions.scales.x.title.text = xAxis.label;
    if (yAxis.min) newOptions.scales.y.suggestedMin = yAxis.min;
    if (yAxis.max) newOptions.scales.y.suggestedMax = yAxis.max;
    if (yAxis.label) newOptions.scales.y.title.text = yAxis.label;

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
    newOptions.plugins.title.font = font
    return newOptions
}

const updateAnnotation = (oldOptions, param, global) => {
    const newOptions = { ...oldOptions }

    const { line, box, label, arrow } = param
    const { switchRowColumn } = global.general
    const annotation = {
        annotations: {},

    }
    if (line.enabled) {
        const { axis: lineAxis, position: linePosition, style: lineStyle, thickness: lineThickness, color: lineColor, label: lineLabel } = line
        const lineAnnotation = {
            type: "line",
            id: "lineAnnotation",
            borderColor: lineColor,
            borderWidth: lineThickness,
        };

        if (lineStyle == "dashed") {
            lineAnnotation.borderDash = [5, 5];
        } else if (lineStyle == "wave") {
            lineAnnotation.borderDash = [10, 5, 5];
        }

        if (lineLabel) {
            lineAnnotation.label = {
                content: [lineLabel],
                display: true,
                textAlign: 'center',
            };
        }


        if ((switchRowColumn && lineAxis == "x") || (!switchRowColumn && lineAxis == "y")) {
            lineAnnotation.yScaleID = "y"
            lineAnnotation.yMin = linePosition
            lineAnnotation.yMax = linePosition
        } else if ((switchRowColumn && lineAxis == "y") || (!switchRowColumn && lineAxis == "x")) {
            lineAnnotation.xScaleID = "x"
            lineAnnotation.xMin = linePosition
            lineAnnotation.xMax = linePosition
        }
        annotation.annotations.lineAnnotation = lineAnnotation
    }

    newOptions.plugins.annotation = { ...newOptions.plugins.annotation, ...annotation }

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

    // updateAnnotation
    newOptions = updateAnnotation(newOptions, annotation, forms)

    // updateGlobalStyles
    newOptions = updateGlobalStyles(newOptions, styles)

    // console.log('[newOptions]', newOptions)

    return newOptions
}
const updateDatasets = (data, option) => {

}


// Reducer function
const reducer = (state, action) => {
    const { type, ...payload } = action
    switch (type) {
        case UDPATE_FORM: {
            
            const { data: forms } = payload
            console.log('[UDPATE_FORM]', forms, state.forms)
            

            const options = updateChartOptions(state.options, forms)
            const newState = { ...state, options, forms };

            updateChartDatasets(newState);
            return newState
        }

        default:
            return state;
    }
};
export const ChartContext = createContext();

const getChartDataObj = (labels, cols) => {
    const result = {}
    for (let i = 0; i < labels.length; i++) {
        const { key, label } = labels[i]
        result[key] = {
            values: cols[i],
            label,
            key
        }
    }
    return result
}
const getInitialState = ({ state, info }) => {
    // { ...initialState, chartType }
    const { chartType, getDatasets } = info
    const chartData = getDatasets()

    const keyLabels = chartData.header.map(h => ({ key: md5.base64(h), label: h }))
    const datasets = getChartDataObj(keyLabels, chartData.cols)
    const yAxis = keyLabels.reduce((p, c) => ({ ...p, [c.key]: true }), {})
    return {
        ...state,
        forms: {
            ...state.forms,
            general: {
                ...state.forms.general,
                xAxis: keyLabels[0].key,
                yAxis
            },
            axes: {
                keyLabels,
                datasets
            }
        },
        chartType
    }
}
const getXAxisDatafield = (data) => {
    const { forms: { general: { xAxis } } } = data
    return xAxis
}
const getYAxisDatafield = (data) => {
    const { forms: { general: { yAxis } } } = data
    return yAxis
}

const getFilteredDatasets = (data) => {
    console.log('[getFilteredDatasets]', data)
    const { forms } = data
    const { axes: { datasets: axesDatasets } } = forms
    const xAxis = getXAxisDatafield(data)
    const yAxis = getYAxisDatafield(data)


    if (!xAxis) return null;
    const labels = axesDatasets[xAxis]
    const filteredKeys = Object.keys(axesDatasets).filter(k => (k != xAxis && yAxis[k]))
    const datasets = filteredKeys.length > 0 ? filteredKeys.map(key => axesDatasets[key]) : []
    return {
        labels,
        datasets
    }
}
const updateChartDatasets = (state) => {
    const data = getFilteredDatasets(state);
    const result = createDatasets(data);
    if (result) {
        state.data = result
    }
}

export const ChartProvider = ({ children }) => {
    const ColbyChartInfo = window.ColbyChartInfo
    if (!ColbyChartInfo) {
        throw Error('ColbyChartInfo is missing')
    }
    const { chartType, createDatasets, storageKey, getDatasets } = ColbyChartInfo
    if (!chartType || !createDatasets || !storageKey || !getDatasets) {
        throw Error('ColbyChartInfo is insufficient')
    }
    const chartRef = useRef(null);
    const draggerPlugin = useMemo(() => new AnnotationDragger(), [])

    const storedState = JSON.parse(localStorage.getItem(storageKey)) || getInitialState({ state: initialState, info: ColbyChartInfo });
    storedState.chartType = chartType

    storedState.onChartRefresh = () => {
        if (!chartRef || !chartRef.current) return;
    }


    storedState.options.plugins.annotation = {
        ...storedState.options.plugins.annotation,
        enter(ctx) {
            draggerPlugin?.enter(ctx)
        },
        leave() {
            draggerPlugin?.leave()
        }
    }

    const xAxis = getXAxisDatafield(storedState)
    if (xAxis) {
        updateChartDatasets(storedState)
    }

    const [state, dispatch] = useReducer(reducer, storedState);

    const onDownloadChart = () => {
        const canvas = chartRef.current.canvas;

        if (canvas) {
            console.log('chartRef.current', canvas)
            // Convert canvas to data URL
            const dataURL = canvas.toDataURL('image/png');
            // Create a link element
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = 'canvas_image.jpg';

            // Trigger a click event on the link to initiate download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }


    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state, storageKey]);

    return (
        <ChartContext.Provider value={{ state, dispatch, chartRef, onDownloadChart, draggerPlugin }}>
            {children}
        </ChartContext.Provider>
    );
};


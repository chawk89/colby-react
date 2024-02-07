// ChartContext.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { AnnotationDragger } from '../utils/chart/AnnotationDragger';
import { md5 } from 'js-md5';
import { copySimpleObject } from '../utils/utils';

// Initial state
const initialState = {
    forms: {
        annotationTemp: {
            line: {
                enabled: false,
                axis: "x",
                position: 0,
                style: "dashed",
                thickness: "1",
                color: "#8F0000",
                label: "",
                type: 'line',
                id: 'lineTemp',
            },
            box: {
                enabled: false,
                label: "",
                xMax: "",
                xMin: "",
                yMax: "",
                yMin: "",
                type: 'box',
                id: 'boxTemp'
            },
            label: {
                enabled: false,
                nindex: "",
                name: "",
                caption: "",
                fontName: "",
                fontSize: "",
                anchor: "",
                color: "#000000",
                type: 'label',
                id: 'labelTemp'
            },
            arrow: {
                enabled: false,
                xMin: "",
                xMax: "",
                yMin: "",
                yMax: "",
                doubleArrow: "1",
                label: "",
                color: "#000000",
                type: 'arrow',
                id: 'arrowTemp'
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
        },
        dataRange: ''
    },
    annotation: {},
    annotationSelected: '',
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
                    text: "",
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
    },
    eventId: ''
};

// Action types
export const UDPATE_FORM = 'UDPATE_FORM';
export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const RELOAD_FORM = 'RELOAD_FORM';
export const FETCH_DATA_RANGE = 'FETCH_DATA_RANGE';
export const ADD_ANNOTATION_ITEM = 'ADD_ANNOTATION_ITEM';
export const ACTIVE_ANNOTATION_ITEM = 'ACTIVE_ANNOTATION_ITEM';
export const UPDATE_ANNOTATION_POSITION = 'UPDATE_ANNOTATION_POSITION';

export const SELECTED_COLOR = '#0000FFFF'


const generalOptionUpdate = (oldOptions, general) => {
    const newOptions = { ...oldOptions }
    const {
        title,
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
    // newOptions.indexAxis = switchRowColumn ? 'y' : 'x'

    return newOptions
}

const validateMinMaxValue = (v) => {
    if (v == "" || v == undefined || v == null) return false
    if (typeof v == "number") return true;
    if (typeof v == "string" && +v == v) return true;
    return false
}

const updateAxisRangeValue = (oldOptions, { xAxis, yAxis }) => {
    const newOptions = { ...oldOptions }


    newOptions.scales.x.min = validateMinMaxValue(xAxis.min) ? xAxis.min : undefined;
    newOptions.scales.x.max = validateMinMaxValue(xAxis.max) ? xAxis.max : undefined;
    newOptions.scales.x.title.text = xAxis.label ?? "";


    newOptions.scales.y.min = validateMinMaxValue(yAxis.min) ? yAxis.min : undefined
    newOptions.scales.y.max = validateMinMaxValue(yAxis.max) ? yAxis.max : undefined;
    newOptions.scales.y.title.text = yAxis.label ?? "";


    return newOptions
}

function findYValueForX(data, xIndex, nameOrIndex, isStacked) {

    if (xIndex < 0 || xIndex > data.datasets.length - 1) {
        console.log("xIndex out of range:", xIndex);
        return null;
    }

    let datasetIndex;
    if (typeof nameOrIndex === "string") {
        datasetIndex = data.labels.indexOf(nameOrIndex);
        if (datasetIndex === -1) {
            console.log("Column header not found:", nameOrIndex);
            return null;
        }
    } else {
        datasetIndex = nameOrIndex;
    }


    if (datasetIndex < 0 || datasetIndex >= data.labels.length) {
        console.log("datasetIndex out of range:", datasetIndex);
        return null;
    }

    if (isStacked) {
        let sum = 0;
        for (let i = 1; i <= datasetIndex; i++) {
            sum += data[xIndex + 1][i];
        }
        return sum;
    }


    return data.datasets[xIndex][datasetIndex];
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
const getLineAnnotation = (line, state) => {
    if (!line.id) return null
    if (line.id == 'lineTemp' && !line.enabled) return null

    const { axis: lineAxis, position: linePosition, style: lineStyle, thickness: lineThickness, color: lineColor, label: lineLabel } = line

    const { annotationSelected } = state

    const lineAnnotation = {
        type: "line",
        id: line.id,
        borderColor: annotationSelected == line.id ? SELECTED_COLOR : lineColor,
        borderWidth: annotationSelected == line.id ? +lineThickness + 2 : lineThickness,
    };
    if (annotationSelected == line.id) {
        lineAnnotation.borderDash = [5, 5];
    } else {
        if (lineStyle == "dashed") {
            lineAnnotation.borderDash = [5, 5];
        } else if (lineStyle == "wave") {
            lineAnnotation.borderDash = [10, 5, 5];
        }
    }


    if (lineLabel) {
        lineAnnotation.label = {
            content: [lineLabel],
            display: true,
            textAlign: 'center',
        };
    }

    if (lineAxis == "x") {
        lineAnnotation.yScaleID = "y"
        lineAnnotation.yMin = linePosition
        lineAnnotation.yMax = linePosition
    } else if (lineAxis == "y") {
        lineAnnotation.xScaleID = "x"
        lineAnnotation.xMin = linePosition
        lineAnnotation.xMax = linePosition
    }
    return lineAnnotation
}

const getBoxAnnotation = (box, state) => {
    if (!box.id) return null
    if (box.id == 'boxTemp' && !box.enabled) return null
    const active = box.id && state.annotationSelected == box.id

    const { xMin, xMax, yMin, yMax, label } = box
    const boxAnnotation = {
        type: "box",
        id: box.id ?? 'boxTemp',
        xMin,
        xMax,
        yMin,
        yMax,
        backgroundColor: active ? SELECTED_COLOR : 'rgba(255, 99, 132, 0.25)'
    };



    if (label) {
        boxAnnotation.label = {
            content: [label],
            display: true,
            textAlign: 'center',
        };
    }
    return boxAnnotation
}

const getArrowAnnotation = (arrow) => {
    if (!arrow.id) return null
    if (arrow.id == 'arrowTemp' && !arrow.enabled) return null

    const { xMin: arrowXMin, xMax: arrowXMax, yMin: arrowYMin, yMax: arrowYMax, doubleArrow, label: arrowLabel, color: arrowColor } = arrow

    const arrowAnnotation = {
        type: "arrow",
        borderColor: arrowColor,
        borderWidth: 2,
        curve: true,
        label: {
            display: false,
        },
        arrowHeads: {
            start: {
                display: doubleArrow == "1",
                borderColor: arrowColor,
            },
            end: {
                display: true,
                borderColor: arrowColor,
            },
        },
        xMin: parseFloat(arrowXMin),
        xMax: parseFloat(arrowXMax),
        yMin: parseFloat(arrowYMin),
        yMax: parseFloat(arrowYMax),
        xScaleID: "x",
        yScaleID: "y",
        draggable: true,
    };

    if (arrowLabel) {
        arrowAnnotation.label = {
            display: true,
            backgroundColor: "rgb(211,211,211)",
            borderRadius: 0,
            color: "rgb(169,169,169)",
            content: [arrowLabel],
        }

    }
    console.log('[arrowAnnotation]', arrowAnnotation)
    return arrowAnnotation;
}

const getLabelAnnotation = (label, state) => {
    if (!label.id) return null
    if (label.id == 'labelTemp' && !label.enabled) return null

    const { nindex, name, caption: labelText, fontName: labelFont, fontSize, anchor: labelAnchor, color: labelColor } = label

    if (nindex == "" || name == "") return null
    const labelX = parseFloat(nindex)
    const labelY = parseFloat(name)
    const labelSize = parseFloat(fontSize)


    let adjustValueX = 0;
    let adjustValueY = 0;

    if (labelAnchor == true) {
        if (labelX == 0) {
            adjustValueX = 50;
            adjustValueY = -30;
        }

        if (
            labelY >= 0.9 * state.options.scales.y.suggestedMax
        ) {
            adjustValueX = 0;
            adjustValueY = 20;
        } else {
            adjustValueX = -30;
            adjustValueY = -30;
        }
    }


    let isStacked = state.forms.general.stacked;

    let correspondingYValue = findYValueForX(
        state.data,
        labelX,
        labelY,
        isStacked
    );



    const labelAnnotation = {
        type: "label",
        xValue: labelX,
        yValue: correspondingYValue ? correspondingYValue : labelY,
        backgroundColor: labelColor,
        borderRadius: 6,
        borderWidth: 1,
        content: [labelText],
        callout: {
            display: true,
            position: "bottom",
            margin: 0,
        },
        font: {
            family: labelFont,
            size: parseFloat(labelSize),
        },
        xAdjust: adjustValueX,
        yAdjust: adjustValueY,
    };

    console.log('[getLabelAnnotation]', label, labelAnnotation)

    return labelAnnotation;
}

const getAnnotation = (item, state) => {
    // Line Annotation
    if (item.type == 'line') {
        return getLineAnnotation(item, state)
    }

    if (item.type == 'box') {
        return getBoxAnnotation(item, state)
    }

    if (item.type == 'label') {
        return getLabelAnnotation(item, state)
    }

    if (item.type == 'arrow') {
        return getArrowAnnotation(item, state)
    }

    return null;

}
const updateAnnotation = (oldOptions, param, global, state) => {
    const newOptions = { ...oldOptions }

    const { line, box, label, arrow } = param
    const annotation = {
        annotations: {},
    }

    const { annotation: stateAnnotation } = state

    for (let annoKey in stateAnnotation) {
        const anno = stateAnnotation[annoKey]
        const item = getAnnotation(anno, state)

        if (item) {
            annotation.annotations = {
                ...annotation.annotations,
                [annoKey]: item
            }
        }
    }

    const lineTemp = getLineAnnotation(line, state)
    if (lineTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            lineTemp
        }
    }
    const boxTemp = getBoxAnnotation(box, state)
    if (boxTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            boxTemp
        }
    }

    const labelTemp = getLabelAnnotation(label, state)
    if (labelTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            labelTemp
        }
    }

    const arrowTemp = getArrowAnnotation(arrow, state)
    if (arrowTemp) {
        annotation.annotations = {
            ...annotation.annotations,
            arrowTemp
        }
    }

    newOptions.plugins.annotation = { ...newOptions.plugins.annotation, ...annotation }

    return newOptions
}
const updateChartOptions = (oldOptions, forms, state) => {
    // chart title
    const { annotationTemp, general, xAxis, yAxis, styles } = forms

    // general options
    let newOptions = generalOptionUpdate(oldOptions, general)
    // axis options
    newOptions = updateAxisRangeValue(newOptions, { xAxis, yAxis })

    // updateAnnotation
    newOptions = updateAnnotation(newOptions, annotationTemp, forms, state)

    // updateGlobalStyles
    newOptions = updateGlobalStyles(newOptions, styles)

    // console.log('[newOptions]', newOptions)

    return newOptions
}
const onMoveAnnotation = (data, state) => {
    const { id } = data
    const { annotation, forms: { annotationTemp } } = state
    let selected = null;

    switch (id) {
        case 'lineTemp':
        case 'line': {
            selected = annotationTemp['line'];
            break;
        }
        case 'boxTemp':
        case 'box': {
            selected = annotationTemp['box'];
            break;
        }
        case 'labelTemp':
        case 'label': {
            selected = annotationTemp['label'];
            break;
        }
        case 'arrowTemp':
        case 'arrow': {
            selected = annotationTemp['arrow'];
            break;
        }
        default:
            selected = annotation[id];

    }
    if (!selected) return;

    const { type, ...rest } = selected
    switch (type) {
        case 'line': {
            const { axis } = rest
            const { posX, posY, dx, dy } = data
            if (axis == "x") {
                selected.position = +selected.position + dy
            } else if (axis == "y") {
                selected.position = +selected.position + dx
            }
            return selected;
        }
        case 'box': {
            const { dx, dy, dxRate, dyRate } = data
            
            if (dx) {
                const width = +selected.xMax - selected.xMin
                selected.xMin = +selected.xMin + dx + dxRate * width
                selected.xMax = +selected.xMax + dx + dxRate * width
            }
            if (dy) {
                const height = +selected.yMax - selected.yMin
                selected.yMin = +selected.yMin + dy + dyRate * height
                selected.yMax = +selected.yMax + dy + dyRate * height                
            }

            return selected;
        }
        default: {
            return selected;
        }
    }

}


const fetchDataRange = (range) => {
    if (window?.ColbyChartInfo?.fetchDataRange) {
        window.ColbyChartInfo.fetchDataRange(range)
    }
}


// Reducer function
const reducer = (state, action) => {
    const { type, ...payload } = action
    switch (type) {
        case UDPATE_FORM: {
            const { data: forms } = payload
            const options = updateChartOptions(state.options, forms, state)
            const newState = { ...state, options, forms: { ...state.forms, ...forms } };
            updateChartDatasets(newState);
            return newState
        }
        case RELOAD_FORM: {
            const { data } = payload
            const newState = { ...state, ...data }
            return newState
        }
        case FETCH_DATA_RANGE: {
            const { data: newDataRange } = payload
            const newState = {
                ...state, forms: {
                    ...state.forms,
                    dataRange: newDataRange
                }
            };
            fetchDataRange(newDataRange);
            return newState

        }
        case ADD_ANNOTATION_ITEM: {
            const { type: annotationType, id } = payload.data
            console.log('[ADD_ANNOTATION_ITEM]', payload.data)

            let newState = {
                ...state,
            }
            const annoTemp = newState.forms.annotationTemp[annotationType]
            const annoInit = initialState.forms.annotationTemp[annotationType]

            if (annoTemp.enabled) {
                const initValue = copySimpleObject(annoInit)

                const newAnnotation = copySimpleObject({
                    ...annoTemp,
                    id,
                    type: annotationType
                })

                // Get the current timestamp in milliseconds          
                newState.forms = {
                    ...newState.forms,
                    annotationTemp: {
                        ...newState.forms.annotationTemp,
                        [annotationType]: initValue
                    }
                }
                newState.annotation = {
                    ...newState.annotation,
                    [id]: newAnnotation
                }

                // const options = updateChartOptions(state.options, newState.forms, newState)
                // newState = { ...newState, options };
                // updateChartDatasets(newState);
            }

            return newState
        }
        case ACTIVE_ANNOTATION_ITEM: {
            const { id: annotationId } = payload
            let newState = { ...state, annotationSelected: annotationId };
            const options = updateChartOptions(state.options, newState.forms, newState)
            newState = { ...newState, options };
            updateChartDatasets(newState);
            return newState;
        }
        case UPDATE_ANNOTATION_POSITION: {
            const { id: annotationId } = payload

            let newState = { ...state };
            if (annotationId) {
                const annotation = onMoveAnnotation(payload, state)
                newState.annotation = {
                    ...newState.annotation,
                    [annotationId]: { ...annotation }
                }
                const options = updateChartOptions(state.options, newState.forms, newState)
                newState = { ...newState, options };
            }
            return newState;
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
const onInitializeState = ({ state, info }) => {

    const { chartType, rawDatasets } = info
    const chartData = rawDatasets

    const keyLabels = chartData.header.map(h => ({ key: md5.base64(h), label: h }))
    const datasets = getChartDataObj(keyLabels, chartData.cols)
    const yAxis = keyLabels.reduce((p, c) => ({ ...p, [c.key]: true }), {})


    let newState = {
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
    // const options = updateChartOptions(state.options, state.forms, state)
    // newState = { ...state, options };
    // console.log('[onInitializeState]', newState)
    // updateChartDatasets(newState);

    return newState
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


    if (!xAxis) return {
        labels: [],
        datasets: [],
        xAxisLabel: 'test'
    };

    const labels = axesDatasets[xAxis]
    const filteredKeys = Object.keys(axesDatasets).filter(k => (k != xAxis && yAxis[k]))
    const datasets = filteredKeys.length > 0 ? filteredKeys.map(key => axesDatasets[key]) : []
    return {
        labels,
        datasets,
        xAxisLabel: axesDatasets[xAxis].label
    }
}
const updateChartDatasets = (state) => {
    const filteredDatasets = getFilteredDatasets(state);

    if (!filteredDatasets) return;

    const { xAxisLabel, ...data } = filteredDatasets
    const createDatasets = window?.ColbyChartInfo?.createDatasets
    if (!createDatasets || !xAxisLabel) return;
    const result = createDatasets(data);
    if (result) {
        state.data = result
        if (!state.options.scales.x.title.text) {
            state.options.scales.x.title.text = xAxisLabel
        }
    }
}
const onAdditionalUpdates = (state, { chartType, chartRef, draggerPlugin }) => {
    state.chartType = chartType

    state.onChartRefresh = () => {
        if (!chartRef || !chartRef.current) return;
    }


    state.options.plugins.annotation = {
        ...state.options.plugins.annotation,
        enter(ctx) {
            draggerPlugin?.enter(ctx)
        },
        leave() {
            draggerPlugin?.leave()
        }

    }
    state.options.scales.x.ticks = {
        ...state.options.scales.x.ticks,

    }
    state.options.scales.y.ticks = {
        ...state.options.scales.y.ticks,
        callback: function (value) {
            // console.log(value)
            // if (typeof value === 'number' && value == Math.floor(value)) return Math.floor(value)
            return value
        }
    }

    const xAxis = getXAxisDatafield(state)
    if (xAxis) {
        updateChartDatasets(state)
    }
}

export const ChartProvider = ({ children }) => {
    const ColbyChartInfo = window.ColbyChartInfo

    if (!ColbyChartInfo) return <></>

    const { storageKey, fetchDataRange, loadingStatus } = ColbyChartInfo

    if (!storageKey || !fetchDataRange || !loadingStatus) {
        throw Error(`ColbyChartInfo is insufficient: loadingStatus, storageKey or fetchDataRange--4`)
    }

    const storageValue = JSON.parse(localStorage.getItem(storageKey))


    if (!ColbyChartInfo) {
        throw Error('ColbyChartInfo is missing')
    }

    console.log(`[loadingStatus]`, loadingStatus)

    if (loadingStatus == 'none' || loadingStatus == 'loading') {
        if (loadingStatus == 'none') fetchDataRange(storageValue?.forms?.dataRange ?? '')
        return <></>
    }

    const { chartType, createDatasets, rawDatasets } = ColbyChartInfo

    if (!chartType || !createDatasets || !storageKey || !rawDatasets) {
        throw Error('ColbyChartInfo is insufficient')
    }

    const chartRef = useRef(null);
    const storedState = onInitializeState({ state: storageValue || initialState, info: ColbyChartInfo });
    const draggerPlugin = useMemo(() => new AnnotationDragger(), [])

    onAdditionalUpdates(storedState, { chartRef, chartType, draggerPlugin })

    const [state, dispatch] = useReducer(reducer, storedState);

    draggerPlugin.initPlugin(dispatch)




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
    const onClearCache = () => {
        localStorage.removeItem(storageKey)
        // console.log('[initialState.forms]', initialState.forms)
        // const state = getInitialState({ state: initialState, info: ColbyChartInfo })
        // onAdditionalUpdates(state)        
        // dispatch({ type: RELOAD_FORM, data: state })
    }
    const onAddAnnotation = (data) => {
        // type is line, box, arrow, label
        dispatch({
            type: ADD_ANNOTATION_ITEM,
            data
        })
    }


    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state, storageKey]);

    return (
        <ChartContext.Provider value={{ state, dispatch, chartRef, onDownloadChart, draggerPlugin, onClearCache, onAddAnnotation }}>
            {children}
        </ChartContext.Provider>
    );
};


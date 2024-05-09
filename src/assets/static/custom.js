function fetchUUID() {
    return new Promise((res, rej) => {
        try {
            google.script.run
                .withSuccessHandler(function (uuid) {
                    res(uuid)
                })
                .getCurrentTabUuid();
        } catch (ex) {
            rej('failed on loading the data')
        }

    })
}
function fetchData(range) {
    return new Promise((res, rej) => {
        try {
            google.script.run
                .withSuccessHandler(function (data) {
                    res(data)
                })
                .getSheetData(range);
        } catch (ex) {
            rej('failed on loading the data')
        }
    })
}

function fetchDefaultValues() {
    return new Promise((res, rej) => {
        try {
            google.script.run
                .withSuccessHandler(function (defaultValues) {
                    res(defaultValues)
                })
                .getDefaultValues(); 
        } catch (ex) {
            rej(`failed fetching values ${ex.message}`)
        }
    })
}


function rotateSheetData(sheetData) {
    const data = []
    const rLen = sheetData.length
    const cLen = sheetData[0].length

    for (let c = 0; c < cLen; c++) {
        const row = []

        for (let r = 0; r < rLen; r++) {
            row.push(sheetData[r][c])
        }

        data.push(row)
    }


    const result = {
        colCount: data.length,
        header: data.map((r, index) => r[0] ? r[0] : `Column #${index + 1}`),
        cols: data.map(r => r.slice(1))
    }
    return result
}

function createDatasets(data) {
    const { labels, datasets } = data
    if (!labels || !labels.key || !labels.values || labels.values.length == 0 || !datasets) return null;

    const colorArray = ['rgba(255, 99, 132, 0.5)', 'rgba(53, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(53, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(53, 162, 235, 0.5)']
    const result = {
        labels: labels.values,
        datasets: datasets.map(({ key, values, label }, index) => ({
            key,
            data: values,
            label,
            backgroundColor: colorArray[index]
        }))
    }

    return result
}

async function init() {
    const uuid = await fetchUUID()
    //  not yet
    const chartType = window?.ColbyChartType ?? 'line'

    window.ColbyChartInfo = {
        chartType,
        createDatasets,
        fetchDataRange,
        fetchDefaults,
        loadingStatus: 'none',
        storageKey: `appState-${uuid}-${chartType}`,
    }
    window.onInsertImage = (data) => {
        return new Promise((res, rej) => {
            google.script.run
                .withSuccessHandler(function (rlt) {
                    res(rlt)
                })
                .insertImageToCurrentTab(data);
        });
    }
    console.log('colby init succesfully!', window.ColbyChartInfo)    
}

const fetchDataRange = async (range) => {
    window.ColbyChartInfo = {
        ...window.ColbyChartInfo,
        loadingStatus: 'loading',
    }

    try {
        const sheetData = await fetchData(range)

        window.ColbyChartInfo = {
            ...window.ColbyChartInfo,
            rawDatasets: rotateSheetData(sheetData),
            loadingStatus: 'loaded'
        }
    } catch (ex) {
        console.log(ex)
    }
}

const fetchDefaults = async () => {
    window.ColbyChartInfo = {
        ...window.ColbyChartInfo,
        loadingStatus: 'loading',
    }
    try {
        const defaultValues = await fetchDefaultValues()

        window.ColbyChartInfo = {
            ...window.ColbyChartInfo,
            defaultValues, 
            loadingStatus: 'loaded'
        }
    } catch (ex) {
        console.log(ex)
    }
}

window.colbyInit = init; 
console.log('[window.colbyInit]')   
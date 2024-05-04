import React, { useEffect, useState } from 'react'
import { Card, Checkbox, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { Controller, useFormContext } from "react-hook-form"

import ColbyTextInput from '../elements/ColbyTextInput';
import { useChartContext } from '../../../hooks/useChartContext';
import { FETCH_DATA_RANGE } from '../../../context/ChartContext';
import { PopoverPicker } from '../../common/PopoverPicker';
import useIsNonAxisChart from '../../../hooks/useIsNonAxisChart';

const GlobalTab = ({ keyLabels }) => {
    const { control, register, watch } = useFormContext()
    const xAxis = watch('global.xAxis')
    const dataRange = watch('dataRange')
    const { dispatch } = useChartContext()
    const [pastDataRange, setPastDataRange] = useState(dataRange)
    const { state } = useChartContext()
    const { chartType } = state


    useEffect(() => {
        const dateRangePattern = /^[A-Za-z]{1,2}[0-9]+\:[A-Za-z]{1,2}[0-9]+$/;
        // data range
        if (pastDataRange == dataRange) return;
        if (dataRange.trim() == '' || dateRangePattern.test(dataRange)) {
            setPastDataRange(pastDataRange)
            dispatch({ type: FETCH_DATA_RANGE, data: dataRange })
        }

    }, [dataRange, dispatch])

    const isNonAxis = useIsNonAxisChart(chartType)
    return (
        <div className="w-full">
            <Card className="w-full mb-2">
                <h3 className="w-full text-xl font-bold mb-2">
                    Main
                </h3>
                <div className="w-full grid grid-cols-3 gap-4 px-8">
                    <div className="col-span-1">
                        <div className="flex items-center h-full">
                            <Label className="inline mr-2" htmlFor="style-color" value="Background Color:" />
                            <Controller
                                name="global.bgColor"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return <PopoverPicker color={value} onChange={onChange} />;
                                }}
                            />
                        </div>
                    </div>

                    {!isNonAxis && <div className="col-span-2">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="global stacking" value="Stacked:" />
                            <Select id="global stacking" {...register('global.stacked')}>
                                <option value='none'>None</option>
                                <option value='stacked'>Stacked</option>
                                <option value='100-stacked'>100% Stacked</option>
                            </Select>
                        </div>
                    </div>}
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Controller
                                name="global.switchRowColumn"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return <ToggleSwitch label="Switch rows and columns" checked={value} onChange={onChange} />
                                }}
                            />
                        </div>
                    </div>


                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Controller
                                name="global.showLabels"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return <ToggleSwitch label="Show Labels" checked={value} onChange={onChange} />
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="flex items-center">
                        <Label className="inline mr-2" htmlFor="labelsColor" value="Labels Color:" />
                            <Controller
                                    name="global.labelsColor"
                                    control={control}
                                    render={({ field: { value, onChange } }) => {
                                        return <PopoverPicker color={value} onChange={onChange} />;
                                    }}
                                />
                        </div>
                    </div>

                </div>
            </Card>
            <Card className="w-full">
                <h3 className="w-full text-xl font-bold mb-2">
                    Title
                </h3>
                <div className="w-full grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="title" value="Title:" />
                            <ColbyTextInput
                                type="text"
                                control={control}
                                name="global.title"
                                placeholder="Default title"
                            />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="titleFont" value="Title Font:" />
                            <TextInput id="titleFont" type="text" placeholder="" control={control} name='global.fontName' />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="title-style" value="Title Style:" />
                            <Select id="title-style" {...register('global.titleStyle')}>
                                <option value='normal'>Normal</option>
                                <option value='bold'>Bold</option>
                                <option value='italic'>Italic</option>
                                <option value='italic-bold'>Italic-Bold</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="style-fontsize" value="Font Size:" />
                            <TextInput id="style-fontsize" type="text" placeholder="18" {...register('global.fontSize')} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center h-full">
                            <Label className="inline mr-2" htmlFor="style-color" value="Title Color:" />
                            <Controller
                                name="global.titleColor"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return <PopoverPicker color={value} onChange={onChange} />;
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Card>
            <Card className="w-full mt-2">
                <h3 className="w-full text-xl font-bold mb-2">
                    Datasets
                </h3>
                <div className="w-full grid grid-cols-3 gap-4 px-8">

                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="globalXAxisSelect" value="X-Axis Dataset:" />
                            <Select id="globalXAxisSelect" {...register('global.xAxis')}>
                                {keyLabels.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <Label className="inline mr-2" htmlFor="plotted-datasets" value="Plotted Datasets:" />
                                <div className="flex gap-3">
                                    {keyLabels.map(({ key, label }) => key != xAxis && <div key={key}><Checkbox  {...register(`global.yAxis.${key}`)} /> <Label value={label} /> </div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="dataRange" value="Data Range:" />
                            <ColbyTextInput
                                type="text"
                                control={control}
                                name="dataRange"
                            />
                        </div>
                    </div>
                </div>
            </Card>
            <Card className="w-full mt-2">
                <h3 className="w-full text-xl font-bold mb-2">
                    Legend
                </h3>
                <div className="w-full grid grid-cols-3 gap-4 px-8">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Controller
                                name="global.showLegend"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return <ToggleSwitch label="Show Legend" checked={value} onChange={onChange} />
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="legend-pos" value="Legend Position:" />
                            <Select id="legend-pos" {...register('global.legendPosition')}>
                                <option value='top'>Top</option>
                                <option value='right'>Right</option>
                                <option value='bottom'>Bottom</option>
                                <option value='left'>Left</option>
                            </Select>
                        </div>
                    </div>

                </div>
            </Card>

        </div>
    );
}


export default GlobalTab
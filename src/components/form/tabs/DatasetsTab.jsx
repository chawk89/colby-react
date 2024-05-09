import React, { useEffect, useMemo, useState } from 'react'
import { Card, Checkbox, Label, RangeSlider, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { Controller, useFormContext } from "react-hook-form"

import ColbyTextInput from '../elements/ColbyTextInput';
import { useChartContext } from '../../../hooks/useChartContext';
import { FETCH_DATA_RANGE } from '../../../context/ChartContext';
import { PopoverPicker } from '../../common/PopoverPicker';
import useChartDatasetKeys from '../../../hooks/useChartDatasetKeys';
import DoughnutFormFields from '../elements/datasets/DoughnutFormFields';
import WaterfallFormFields from '../elements/datasets/WaterfallFormFields';
import ScatterFormFields from '../elements/datasets/ScatterFormFields';
import LineFormFields from '../elements/datasets/LineFormFields';
import BarFormFields from '../elements/datasets/BarFormFields';
import BubbleFormFields from '../elements/datasets/BubbleFormFields';
import PieFormFields from '../elements/datasets/PieFormFields';

const BackgroundTab = () => {
    const { control, register, watch } = useFormContext()
    const xAxis = watch('global.xAxis')
    const { state } = useChartContext()
    const keyLabels = useChartDatasetKeys(state, xAxis)
    const { chartType } = state
    const datasetOptions = watch('datasets')
    const selected = watch('global.yAxis')
    const geChartType = (key) => {
        const datasetChartType = datasetOptions[key]?.chartType ?? 'default'
        if (datasetChartType == 'default') {
            return chartType
        }
        return datasetChartType
    }


    return (
        <div className="w-full px-8 py-4">
            <div className="w-full flex flex-col gap-2">
                {keyLabels.map(({ key, label }) => (
                    <React.Fragment key={key}> 
                    {selected[key] ? (
                    <Card key={key} className="w-full">
                    <h4 className="w-full text-lg font-bold mb-2 col-span-3" >
                        {label}
                    </h4>
                    <div>
                    </div>
                    <div className="w-full  grid grid-cols-3 gap-4">
                        <div className="col-span-1 mt-4">
                            <div className="flex items-center h-full">
                                <Label className="inline mr-2 shrink-0" htmlFor="chartType" value="Chart Type:" />
                                <Select className="w-full" {...register(`datasets.${key}.chartType`)}>
                                    <option value={'default'}>Default</option>
                                    <option value={'line'}>Line</option>
                                    <option value={'bar'}>Bar</option>
                                    <option value={'scatter'}>Scatter</option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center h-full">
                                <Label className="inline mr-2" htmlFor="style-color" value="Color:" />
                                <Controller
                                    name={`datasets.${key}.color`}
                                    control={control}
                                    render={({ field: { value, onChange } }) => {
                                        return <PopoverPicker color={value} onChange={onChange} />;
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center h-full">
                                <Label className="inline mr-2" htmlFor="style-color" value="Opactity:" />
                                <Controller
                                    name={`datasets.${key}.opacity`}
                                    control={control}
                                    render={({ field: { value, onChange } }) => {
                                        return <RangeSlider color={value} onChange={onChange} min="0" max="1" step="0.01" />;
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center">
                                <Label className="inline mr-2 shrink-0" htmlFor="label-style" value="Gradient:" />
                                <Select id="label-style" {...register(`datasets.${key}.gradient`)}>
                                    <option value='yes'>Yes</option>
                                    <option value='no'>No</option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-3 bg-gray-200 h-px w-full border-t border-gray-300"></div>
                        {/* markertype in non-bar chart case  */}
                        {geChartType(key) == 'line' && <LineFormFields datakey={key} />}
                        {geChartType(key) == 'bar' && <BarFormFields datakey={key} />}
                        {geChartType(key) == 'scatter' && <ScatterFormFields datakey={key} />}
                        {geChartType(key) == 'bubble' && <BubbleFormFields datakey={key} />}
                        {geChartType(key) == 'waterfall' && <WaterfallFormFields datakey={key} />}
                        {geChartType(key) == 'pie' && <PieFormFields datakey={key} />}
                        {geChartType(key) == 'doughnut' && <DoughnutFormFields datakey={key} />}
                        
                    </div>
                    </Card>
                    ): null}

            </React.Fragment>))}
            </div>
        </div>


    );
}


export default BackgroundTab
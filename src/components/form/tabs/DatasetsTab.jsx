import React, { useEffect, useMemo, useState } from 'react'
import { Card, Checkbox, Label, RangeSlider, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { Controller, useFormContext } from "react-hook-form"

import ColbyTextInput from '../elements/ColbyTextInput';
import { useChartContext } from '../../../hooks/useChartContext';
import { FETCH_DATA_RANGE } from '../../../context/ChartContext';
import { PopoverPicker } from '../../common/PopoverPicker';
import useChartDatasetKeys from '../../../hooks/useChartDatasetKeys';

const BackgroundTab = () => {
    const { control, register, watch } = useFormContext()
    const xAxis = watch('global.xAxis')
    const { state } = useChartContext()
    const keyLabels = useChartDatasetKeys(state, xAxis)
    const { chartType } = state
    const datasetOptions = watch('datasets')
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
                {keyLabels.map(({ key, label }) =>
                    <Card key={key} className="w-full">
                        <h4 className="w-full text-lg font-bold mb-2 col-span-3" >
                            {label}
                        </h4>
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
                            {/* markertype in non-bar chart case  */}
                            {geChartType(key) != 'bar' && <div className="col-span-1 mt-4">
                                <div className="flex items-center h-full">
                                    <Label className="inline mr-2 shrink-0" htmlFor="markertype" value="Marker Type:" />
                                    <Select className="w-full" {...register(`datasets.${key}.markertype`)}>
                                        <option value={'triangle'}>Triangle</option>
                                        <option value={'square'}>Square</option>
                                        <option value={'point'}>Point</option>
                                    </Select>
                                </div>
                            </div>}
                            <div className="col-span-3 bg-gray-200 h-px w-full border-t border-gray-300"></div>
                            {/* line type in line chart case  */}
                            {geChartType(key) == 'line' && <>
                                <div className="col-span-1 mt-4">
                                    <div className="flex items-center h-full">
                                        <Label className="inline mr-2 shrink-0" htmlFor="lineStyle" value="Line Type:" />
                                        <Select className="w-full" {...register(`datasets.${key}.lineStyle`)}>
                                            <option value={'dashed'}>Dashed</option>
                                            <option value={'solid'}>Solid</option>
                                            <option value={'dotted'}>Dotted</option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-span-1 mt-4">
                                    <div className="flex items-center">
                                        <Label className="inline mr-2" htmlFor="line-thickness" value="Thickness:" />
                                        <TextInput id="line-thickness" type="number" min="1" placeholder="0" {...register(`datasets.${key}.thickness`)} />
                                    </div>
                                </div>
                                <div className="col-span-1 mt-4">
                                    <div className="flex items-center h-full">
                                        <Label className="inline mr-2 shrink-0" htmlFor="linetype" value="Fill:" />
                                        <Select className="w-full" {...register(`datasets.${key}.fill`)}>
                                            <option value={false}>None</option>
                                            <option value={true}>Fill</option>
                                        </Select>
                                    </div>
                                </div>
                            </>}
                            {/* line type in line chart case  */}
                            {geChartType(key) == 'scatter' && <>
                                <div className="col-span-1 mt-4">
                                    <div className="flex items-center h-full">
                                        <Label className="inline mr-2 shrink-0" htmlFor="pointStyle" value="Point Style:" />
                                        <Select className="w-full" {...register(`datasets.${key}.pointStyle`)}>
                                            <option value={'circle'} >Circle</option>
                                            <option value={'cross'} >Cross</option>
                                            <option value={'crossRot'} >CrossRot</option>
                                            <option value={'dash'} >Dash</option>
                                            <option value={'line'} >Line</option>
                                            <option value={'rect'} >Rect</option>
                                            <option value={'rectRounded'} >RectRounded</option>
                                            <option value={'rectRot'} >RectRot</option>
                                            <option value={'star'} >Star</option>
                                            <option value={'triangle'} >Triangle</option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-span-1 mt-4">
                                    <div className="flex items-center">
                                        <Label className="inline mr-2" htmlFor="line-thickness" value="Point Size:" />
                                        <TextInput id="line-thickness" type="number" min="1" placeholder="1" {...register(`datasets.${key}.pointRadius`)} />
                                    </div>
                                </div>

                            </>}
                            {/* line type in line chart case  */}
                            {geChartType(key) == 'bar' && <div className="col-span-1 mt-4">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="bar-padding" value="Padding:" />
                                    <TextInput id="bar-padding" type="number" min="0" max="1" step="0.01" placeholder="0" {...register(`datasets.${key}.barPadding`)} />
                                </div>
                            </div>}
                        </div>
                    </Card>
                )}
            </div>
        </div>


    );
}


export default BackgroundTab
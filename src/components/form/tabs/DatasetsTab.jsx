import React, { useEffect, useState } from 'react'
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

    return (
        <div className="w-full px-8 py-4">
            <div className="w-full flex flex-col gap-2">
                {keyLabels.map(({ key, label }) =>
                    <Card key={key} className="w-full">
                        <h4 className="w-full text-lg font-bold mb-2 col-span-3" >
                            {label}
                        </h4>
                        <div className="w-full  grid grid-cols-3 gap-4">
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
                            {chartType != 'bar' && <div className="col-span-1 mt-4">
                                <Label className="inline mr-2" htmlFor="markertype" value="Marker Type:" />
                                <Select className="w-full" {...register(`datasets.${key}.markertype`)}>
                                    <option value={'triangle'}>Triangle</option>
                                    <option value={'square'}>Square</option>
                                    <option value={'point'}>Point</option>
                                </Select>
                            </div>}
                            {/* line type in line chart case  */}
                            {chartType == 'line' && <div className="col-span-1 mt-4">
                                <Label className="inline mr-2" htmlFor="linetype" value="Line Type:" />
                                <Select className="w-full" {...register(`datasets.${key}.linetype`)}>
                                    <option value={'dashed'}>Dashed</option>
                                    <option value={'solid'}>Solid</option>
                                    <option value={'dotted'}>Dotted</option>
                                </Select>
                            </div>}
                            {/* line type in line chart case  */}
                            {chartType == 'bar' && <div className="col-span-1 mt-4">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="bar-padding" value="Padding:" />
                                    <TextInput id="bar-padding" type="text" placeholder="0" {...register(`datasets.${key}.barpadding`)} />
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
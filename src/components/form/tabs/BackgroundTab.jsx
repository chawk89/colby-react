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
    const xAxis = watch('general.xAxis')
    const dataRange = watch('dataRange')
    const { state, dispatch } = useChartContext()
    const [pastDataRange, setPastDataRange] = useState(dataRange)
    const keyLabels = useChartDatasetKeys(state, xAxis)
    const context = useChartContext()
    const { chartType } = state

    return (
        <div className="w-full px-8 py-4">
            <h3 className="w-full text-xl font-bold mb-2">
                Global
            </h3>
            <Card className="w-full min-h-32">
                <div className="w-full grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="style-titlefont" value="Title Font:" />
                            <TextInput id="style-titlefont" type="text" placeholder="Lora" {...register('global.fontName')} />
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
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="style-fontsize" value="Font Size:" />
                            <TextInput id="style-fontsize" type="text" placeholder="18" {...register('global.fontSize')} />
                        </div>
                    </div>
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
                </div>
            </Card>
            <div className="col-span-3 mt-4">
                <h3 className="w-full text-xl font-bold mb-2">
                    Datasets
                </h3>
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
                                            name={`global.datasets.${key}.color`}
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
                                            name={`global.datasets.${key}.opacity`}
                                            control={control}
                                            render={({ field: { value, onChange } }) => {                                                
                                                return <RangeSlider color={value} onChange={onChange} min="0" max="1" step="0.01" />;
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* markertype in non-bar chart case  */}
                                {chartType != 'bar' && <div className="col-span-1 mt-4">
                                    <Label className="inline mr-2" htmlFor="markertype" value="Marker Type:" />
                                    <Select className="w-full" {...register(`global.datasets.${key}.markertype`)}>
                                        <option value={'triangle'}>Triangle</option>
                                        <option value={'square'}>Square</option>
                                        <option value={'point'}>Point</option>
                                    </Select>

                                </div>}
                                {/* line type in line chart case  */}
                                {chartType == 'line' && <div className="col-span-1 mt-4">
                                    <Label className="inline mr-2" htmlFor="linetype" value="Line Type:" />
                                    <Select className="w-full" {...register(`global.datasets.${key}.linetype`)}>
                                        <option value={'dashed'}>Dashed</option>
                                        <option value={'solid'}>Solid</option>
                                        <option value={'dotted'}>Dotted</option>
                                    </Select>
                                </div>}
                                {/* line type in line chart case  */}
                                {chartType == 'bar' && <div className="col-span-1 mt-4">
                                    <div className="flex items-center">
                                        <Label className="inline mr-2" htmlFor="bar-padding" value="Padding:" />
                                        <TextInput id="bar-padding" type="text" placeholder="0" {...register(`global.datasets.${key}.barpadding`)} />
                                    </div>
                                </div>}
                            </div>
                        </Card>
                    )}
                </div>
            </div>


        </div >
    );
}


export default BackgroundTab
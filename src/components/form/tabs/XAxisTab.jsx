import React from 'react'
import { Label, Select, TextInput } from 'flowbite-react';
import { Controller, useFormContext } from "react-hook-form"

import ColbyTextInput from '../elements/ColbyTextInput';
import { PopoverPicker } from '../../common/PopoverPicker';

const XAxisTab = () => {
    const { control, register, watch } = useFormContext()

    return (
        <div className="w-full min-h-32 grid grid-cols-3 gap-4">
            <div className="col-span-1">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="xMin" value="X-Min:" />
                    <ColbyTextInput id="xMin" type="number" placeholder="xMin" control={control} name='xAxis.min' />
                </div>
            </div>
            <div className="col-span-2">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="xMax" value="X-Max:" />
                    <ColbyTextInput id="xMax" type="number" placeholder="xMax" control={control} name='xAxis.max' />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="xLabel" value="Label:" />
                    <ColbyTextInput id="xLabel" type="text" placeholder="Default X Axis" control={control} name='xAxis.label' />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="xLabelSize" value="Label Size:" />
                    <ColbyTextInput id="xLabelSize" type="text" placeholder="10" control={control} name='xAxis.labelSize' />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="xAixs-labelColor" value="Label Color:" />
                    <Controller
                        name="xAxis.labelColor"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                            return <PopoverPicker color={value} onChange={onChange} />;
                        }}
                    />
                </div>
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="xAixs-ticksColor" value="Ticks Color:" />
                    <Controller
                        name="xAxis.ticksColor"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                            return <PopoverPicker color={value} onChange={onChange} />;
                        }}
                    />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="xLabelFont" value="Label Font:" />
                    <ColbyTextInput id="xLabelFont" type="text" placeholder="" control={control} name='xAxis.labelFont' />
                </div>
            </div>
            <div className="col-span-2">
                <div className="flex items-center">
                    <Label className="inline mr-2 shrink-0" htmlFor="label-style" value="Label Style:" />
                    <Select id="label-style" {...register('xAxis.labelStyle')}>
                        <option value='normal'>Normal</option>
                        <option value='bold'>Bold</option>
                        <option value='italic'>Italic</option>
                        <option value='italic-bold'>Italic Bold</option>
                    </Select>
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center">
                    <Label className="inline mr-2 shrink-0" htmlFor="show-grid-lines" value="Show Grid Lines:" />
                    <Select id="show-grid-lines" {...register('xAxis.showGrid')}>
                        <option value='1'>Yes</option>
                        <option value='0'>No</option>
                    </Select>
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center">
                    <Label className="inline mr-2 shrink-0" htmlFor="show-axis-lines" value="Show Axis Lines:" />
                    <Select id="show-axis-lines" {...register('xAxis.showAxis')}>
                        <option value='1'>Yes</option>
                        <option value='0'>No</option>
                    </Select>
                </div>
            </div>
        </div>
    );
}


export default XAxisTab
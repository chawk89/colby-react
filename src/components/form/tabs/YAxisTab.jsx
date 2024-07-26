import React from 'react'
import { Label, Select, TextInput } from 'flowbite-react';
import { Controller, useFormContext } from "react-hook-form"

import ColbyTextInput from '../elements/ColbyTextInput';
import { PopoverPicker } from '../../common/PopoverPicker';

const YAxisTab = () => {
    const { control, register, watch } = useFormContext()

    return (
        <div className="w-full min-h-32 grid grid-cols-3 gap-4 px-8">
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2" htmlFor="yMin" value="Y-Min:" />
                    <ColbyTextInput id="yMin" type="number" placeholder="xMin" control={control} name='yAxis.min' />
                </div>
            </div>
            <div className="col-span-2">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2" htmlFor="yMax" value="Y-Max:" />
                    <ColbyTextInput id="yMax" type="number" placeholder="yMax" control={control} name='yAxis.max' />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2" htmlFor="yLabel" value="Label:" />
                    <ColbyTextInput id="yLabel" type="text" placeholder="Default Y Axis" control={control} name='yAxis.label' />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2" htmlFor="yLabelSize" value="Label Size:" />
                    <ColbyTextInput id="yLabelSize" type="text" placeholder="10" control={control} name='yAxis.labelSize' />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="yAixs-labelColor" value="Label Color:" />
                    <Controller
                        name="yAxis.labelColor"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                            return <PopoverPicker color={value} onChange={onChange} />;
                        }}
                    />
                </div>
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="yAixs-ticksColor" value="Ticks Color:" />
                    <Controller
                        name="yAxis.ticksColor"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                            return <PopoverPicker color={value} onChange={onChange} />;
                        }}
                    />
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2" htmlFor="yLabelFont" value="Label Font:" />
                    <TextInput id="ColbyTextInput" type="text" placeholder="" control={control} name='yAxis.labelFont' />
                </div>
            </div>
            <div className="col-span-2">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="label-style" value="Label Style:" />
                    <Select id="label-style" {...register('yAxis.labelStyle')}>
                        <option value='normal'>Normal</option>
                        <option value='bold'>Bold</option>
                        <option value='italic'>Italic</option>
                        <option value='italic-bold'>Italic Bold</option>
                    </Select>
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="show-grid-lines" value="Show Grid Lines:" />
                    <Select id="show-grid-lines" {...register('yAxis.showGrid')}>
                        <option value='1'>Yes</option>
                        <option value='0'>No</option>
                    </Select>
                </div>
            </div>
            <div className="col-span-1">
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="show-axis-lines" value="Show Axis Lines:" />
                    <Select id="show-axis-lines" {...register('yAxis.showAxis')}>
                        <option value='1'>Yes</option>
                        <option value='0'>No</option>
                    </Select>
                </div>
            </div>
        </div>
    );
}


export default YAxisTab
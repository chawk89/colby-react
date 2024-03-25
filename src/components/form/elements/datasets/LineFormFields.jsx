import React from 'react'
import { Card, Checkbox, Label, RangeSlider, Select, TextInput, ToggleSwitch } from 'flowbite-react';
import { useFormContext } from 'react-hook-form';
import MarkerFormType from '../MarkerFormType';



const LineFormFields = ({ datakey }) => {
    const { control, register, watch } = useFormContext()
    return (
        <>
            <div className="col-span-1 mt-4">
                <div className="flex items-center h-full">
                    <Label className="inline mr-2 shrink-0" htmlFor="markertype" value="Marker Type:" />
                    <MarkerFormType className="w-full" datakey={datakey} />
                </div>
            </div>
            <div className="col-span-1 mt-4">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="line-thickness" value="Marker Size:" />
                    <TextInput id="line-thickness" type="number" min="2" placeholder="2" {...register(`datasets.${datakey}.pointRadius`)} />
                </div>
            </div>
            <div className="col-span-1 mt-4">
                <div className="flex items-center h-full">
                    <Label className="inline mr-2 shrink-0" htmlFor="lineStyle" value="Line Type:" />
                    <Select className="w-full" {...register(`datasets.${datakey}.lineStyle`)}>
                        <option value={'dashed'}>Dashed</option>
                        <option value={'solid'}>Solid</option>
                        <option value={'dotted'}>Dotted</option>
                    </Select>
                </div>
            </div>
            <div className="col-span-1 mt-4">
                <div className="flex items-center">
                    <Label className="inline mr-2" htmlFor="line-thickness" value="Thickness:" />
                    <TextInput id="line-thickness" type="number" min="1" placeholder="0" {...register(`datasets.${datakey}.thickness`)} />
                </div>
            </div>
            <div className="col-span-1 mt-4">
                <div className="flex items-center h-full">
                    <Label className="inline mr-2 shrink-0" htmlFor="linetype" value="Fill:" />
                    <Select className="w-full" {...register(`datasets.${datakey}.fill`)}>
                        <option value={false}>None</option>
                        <option value={true}>Fill</option>
                    </Select>
                </div>
            </div>
        </>
    )
}

export default LineFormFields
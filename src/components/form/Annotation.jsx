import React, { useState } from 'react'
import { Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../common/PopoverPicker';

const Annotation = () => {
    const { control, getValues, register, watch } = useFormContext()
    const lineEnabled = watch('annotation.line.enabled')
    console.log('[line]', lineEnabled)


    return (
        <div className="flex flex-col gap-4">
            <div>
                <Controller
                    name="annotation.line.enabled"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return <ToggleSwitch label="Line Annotation" checked={value} onChange={onChange} />
                    }}
                />

                {lineEnabled && (<div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="annotationAxisSelect" value="Axis:" />
                            <Select id="annotationAxisSelect" {...register('annotation.line.axis')}>
                                <option>X</option>
                                <option>Y</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="axis-position" value="Axis Position:" />
                            <TextInput id="axis-position" type="text" placeholder="10" {...register("annotation.line.position")} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="anno-linestyle" value="Line Style:" />
                            <Select id="anno-linestyle" {...register("annotation.line.style")} >
                                <option>None</option>
                                <option>Dashed</option>
                                <option>Wave</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center h-full">
                            <Label className="inline mr-2 shrink-0" htmlFor="anno-linecolor" value="Line Color:" />
                            <Controller
                                name="annotation.line.color"
                                control={control}
                                render={({ field: { value, onChange } }) => {
                                    return <PopoverPicker color={value} onChange={onChange} />;
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="anno-line-thickness" value="Line Thickness:" />
                            <TextInput id="anno-line-thickness" type="text" placeholder="10" {...register("annotation.line.thickness")} />
                        </div>
                    </div>

                </div>)
                }
            </div>
            <div>
                <Controller
                    name="annotation.box.enabled"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return <ToggleSwitch label="Box Annotation" checked={value} onChange={onChange} />
                    }}
                />
            </div>
            <div>
                <Controller
                    name="annotation.label.enabled"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return <ToggleSwitch label="Label Annotation" checked={value} onChange={onChange} />
                    }}
                />
            </div>
            <div>
                <Controller
                    name="annotation.arrow.enabled"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                        return <ToggleSwitch label="Arrow Annotation" checked={value} onChange={onChange} />
                    }}
                />
            </div>
        </div>
    );

}

export default Annotation
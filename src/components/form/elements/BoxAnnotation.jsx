import React, { useState } from 'react'
import { Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';

const BoxAnnotation = () => {
    const { control, register, watch } = useFormContext()
    const lineEnabled = watch('annotationTemp.box.enabled')

    return (
        <Card className="w-full">
            <Controller
                name="annotationTemp.box.enabled"
                control={control}
                render={({ field: { value, onChange } }) => {
                    return <ToggleSwitch label="Box Annotation" checked={value} onChange={onChange} />
                }}
            />

            <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2" htmlFor="annotationAxisSelect" value="Axis:" />
                        <Select id="annotationAxisSelect" {...register('annotationTemp.box.axis')}>
                            <option value="x">X</option>
                            <option value="y">Y</option>
                        </Select>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="axis-position" value="Axis Position:" />
                        <TextInput id="axis-position" type="text" placeholder="10" {...register("annotationTemp.box.position")} />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="anno-linestyle" value="Line Style:" />
                        <Select id="anno-linestyle" {...register("annotationTemp.box.style")} >
                            <option value='none'>None</option>
                            <option value='dashed'>Dashed</option>
                            <option value='wave'>Wave</option>
                        </Select>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center">
                        <Label className="inline mr-2 shrink-0" htmlFor="axis-label" value="Label:" />
                        <TextInput id="axis-label" type="text" placeholder="Default Label" {...register("annotationTemp.box.label")} />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="flex items-center h-full">
                        <Label className="inline mr-2 shrink-0" htmlFor="anno-linecolor" value="Line Color:" />
                        <Controller
                            name="annotationTemp.box.color"
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
                        <TextInput id="anno-line-thickness" type="text" placeholder="10" {...register("annotationTemp.box.thickness")} />
                    </div>
                </div>

            </div>
        </Card>
    );

}

export default BoxAnnotation
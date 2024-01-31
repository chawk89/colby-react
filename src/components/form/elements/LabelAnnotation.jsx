import React, { useState } from 'react'
import { Card, Label, Select, TextInput, ToggleSwitch } from 'flowbite-react'
import { Controller, useFormContext } from 'react-hook-form';
import { PopoverPicker } from '../../common/PopoverPicker';

const LabelAnnotation = () => {
    const { control, register, watch } = useFormContext()
    const labelEnabled = watch('annotationTemp.label.enabled')

    return (
        <Card className="w-full">
            <Controller
                name="annotationTemp.label.enabled"
                control={control}
                render={({ field: { value, onChange } }) => {
                    return <ToggleSwitch label="Label Annotation" checked={value} onChange={onChange} />
                }}
            />
            {labelEnabled &&
                <div className="w-full grid grid-cols-3 gap-3 my-4 p-2">
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2" htmlFor="annotationAxisSelect" value="Axis:" />
                            <Select id="annotationAxisSelect" {...register('annotationTemp.label.axis')}>
                                <option value="x">X</option>
                                <option value="y">Y</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="axis-position" value="Axis Position:" />
                            <TextInput id="axis-position" type="text" placeholder="10" {...register("annotationTemp.label.position")} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="anno-linestyle" value="Line Style:" />
                            <Select id="anno-linestyle" {...register("annotationTemp.label.style")} >
                                <option value='none'>None</option>
                                <option value='dashed'>Dashed</option>
                                <option value='wave'>Wave</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center">
                            <Label className="inline mr-2 shrink-0" htmlFor="axis-label" value="Label:" />
                            <TextInput id="axis-label" type="text" placeholder="Default Label" {...register("annotationTemp.label.label")} />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center h-full">
                            <Label className="inline mr-2 shrink-0" htmlFor="anno-linecolor" value="Line Color:" />
                            <Controller
                                name="annotationTemp.label.color"
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
                            <TextInput id="anno-line-thickness" type="text" placeholder="10" {...register("annotationTemp.label.thickness")} />
                        </div>
                    </div>

                </div>
            }
        </Card>
    );

}

export default LabelAnnotation 
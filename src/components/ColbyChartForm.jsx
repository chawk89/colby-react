import React, { useState } from 'react'
import { Button, Checkbox, Label, Select, Tabs, TextInput, ToggleSwitch, Accordion } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import Annotation from './form/Annotation';
import { useChartContext } from '../hooks/useChartContext';
import { PopoverPicker } from './common/PopoverPicker'
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form"

const ColbyChartForm = () => {

    const {state, dispatch} = useChartContext()


    const methods = useForm({

    })
    const { register, control } = methods

    const onSubmit = (data) => {
        console.log('[onSubmit]', data)
    }
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Tabs style="fullWidth" className='w-full'>
                    {/* general tab start */}
                    <Tabs.Item active title="General" icon={MdDashboard}>
                        <div className="w-full grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="title" value="Title:" />
                                    <TextInput id="title" type="text" placeholder="Default title" {...register('general.title')} />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="generalXAxisSelect" value="X-Axis Dataset:" />
                                    <Select id="generalXAxisSelect" {...register('general.xAxis')}>
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>France</option>
                                        <option>Germany</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        <Label className="inline mr-2" htmlFor="plotted-datasets" value="Plotted Datasets:" />
                                        <Checkbox id="plotted-datasets" {...register('general.plotted')} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Controller
                                        name="general.stacked"
                                        control={control}
                                        render={({ field: { value, onChange } }) => {
                                            return <ToggleSwitch label="Stacked" checked={value} onChange={onChange} />
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-center">
                                    <Controller
                                        name="general.switchRowColumn"
                                        control={control}
                                        render={({ field: { value, onChange } }) => {
                                            return <ToggleSwitch label="Switch rows and columns" checked={value} onChange={onChange} />
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Controller
                                        name="general.showLabels"
                                        control={control}
                                        render={({ field: { value, onChange } }) => {
                                            return <ToggleSwitch label="Show Labels" checked={value} onChange={onChange} />
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Controller
                                        name="general.showLegend"
                                        control={control}
                                        render={({ field: { value, onChange } }) => {
                                            return <ToggleSwitch label="Show Legend" checked={value} onChange={onChange} />
                                        }}
                                    />
                                </div>
                            </div>

                        </div>
                    </Tabs.Item>
                    {/* general tab end */}
                    {/* X Axis tab start */}
                    <Tabs.Item title="X-Axis" icon={MdDashboard}>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="xMin" value="X-Min:" />
                                    <TextInput id="xMin" type="number" placeholder="xMin" {...register('xAxis.xMin')} />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="xMax" value="X-Max:" />
                                    <TextInput id="xMax" type="number" placeholder="xMax" {...register('xAxis.xMax')} />
                                </div>
                            </div>
                        </div>
                    </Tabs.Item>
                    {/* X Axis tab end */}
                    {/* Y Axis tab start */}
                    <Tabs.Item title="Y-Axis" icon={HiAdjustments}>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="yMin" value="Y-Min:" />
                                    <TextInput id="yMin" type="number" placeholder="yMin" {...register('yAxis.yMin')} />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="yMax" value="Y-Max:" />
                                    <TextInput id="yMax" type="number" placeholder="yMax" {...register('yAxis.yMax')} />
                                </div>
                            </div>
                        </div>
                    </Tabs.Item>
                    {/* Y Axis tab end */}
                    {/* Annotations tab start */}
                    <Tabs.Item title="Annotations" icon={HiClipboardList}>
                        <Annotation />
                    </Tabs.Item>
                    {/* Annotations tab end */}
                    {/* Style tab start */}
                    <Tabs.Item title="Style" icon={HiAdjustments}>
                        <div className="w-full grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="style-titlefont" value="Title Font:" />
                                    <TextInput id="style-titlefont" type="text" placeholder="Lora" {...register('style.titlefont')} />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center h-full">
                                    <Label className="inline mr-2" htmlFor="style-color" value="Title Color:" />
                                    <Controller
                                        name="style.color"
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
                                    <TextInput id="style-fontsize" type="text" placeholder="18" {...register('style.fontsize')} />
                                </div>
                            </div>
                        </div>

                    </Tabs.Item>
                </Tabs>
                <div className="w-full flex justify-between mt-10">
                    <Button type="submit" color="blue">Save</Button>
                    <Button color="blue" outline>Force Refresh</Button>
                    <Button color="success">Download Chart</Button>
                </div>

            </form>
        </FormProvider>
    );
}


export default ColbyChartForm
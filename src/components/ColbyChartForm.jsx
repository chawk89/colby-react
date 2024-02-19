import React, { useCallback } from 'react'
import { Button, Checkbox, Label, Select, Tabs, TextInput, ToggleSwitch, Accordion } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { useForm, FormProvider, Controller } from "react-hook-form"

import { useChartContext } from '../hooks/useChartContext';
import { PopoverPicker } from './common/PopoverPicker'
import { UDPATE_FORM } from '../context/ChartContext';
import useFormValue from '../hooks/useFormValue';
import AnnotationTab from './form/tabs/AnnotationTab';
import ColbyTextInput from './form/elements/ColbyTextInput';
import GeneralTab from './form/tabs/GeneralTab';
import PropertiesTab from './form/tabs/PropertiesTab';

const FormPropertyValues = ["annotationTemp", "general", "xAxis", "yAxis", "styles", "axes"]

const ColbyChartForm = () => {

    const { state: { forms, data, annotationSelected }, dispatch, onDownloadChart, onInsertImage, onClearCache } = useChartContext()

    const methods = useForm({ defaultValues: forms })

    const { register, control, watch, reset: resetForm } = methods

    const { axes } = forms
    const { keyLabels } = axes
    console.log('[axes]', axes)

    const handleUpdate = useCallback((data) => {
        dispatch({ type: UDPATE_FORM, data })
    }, [dispatch])
    const handleClearCache = useCallback(() => {
        resetForm()
        // onClearCache()
    }, [onClearCache])


    useFormValue(watch, handleUpdate, FormPropertyValues)

    const onSubmit = (data) => {
        // dispatch({ type: UDPATE_FORM, data })
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className='w-full'>
                <Tabs style="fullWidth" className='w-full'>
                    {/* general tab start */}
                    <Tabs.Item title="General" icon={MdDashboard}>
                        <GeneralTab keyLabels={keyLabels} />
                    </Tabs.Item>
                    {/* general tab end */}
                    {/* X Axis tab start */}
                    <Tabs.Item title="X-Axis" icon={MdDashboard}>
                        <div className="w-full min-h-32 grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="xMin" value="X-Min:" />
                                    <ColbyTextInput id="xMin" type="number" placeholder="xMin" control={control} name='xAxis.min' />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="xMax" value="X-Max:" />
                                    <ColbyTextInput id="xMax" type="number" placeholder="xMax" control={control} name='xAxis.max' />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="xLabel" value="Label:" />
                                    <ColbyTextInput id="xLabel" type="text" placeholder="Default X Axis" control={control} name='xAxis.label' />
                                </div>
                            </div>
                        </div>
                    </Tabs.Item>
                    {/* X Axis tab end */}
                    {/* Y Axis tab start */}
                    <Tabs.Item title="Y-Axis" icon={HiAdjustments}>
                        <div className="w-full min-h-32 grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="yMin" value="Y-Min:" />
                                    <ColbyTextInput id="yMin" type="number" placeholder="yMin" control={control} name='yAxis.min' />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="yMax" value="Y-Max:" />
                                    <ColbyTextInput id="yMax" type="number" placeholder="yMax" control={control} name='yAxis.max' />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex items-center">
                                    <Label className="inline mr-2" htmlFor="yLabel" value="Label:" />
                                    <ColbyTextInput id="yLabel" type="text" placeholder="Default Y Axis" control={control} name='yAxis.label' />
                                </div>
                            </div>
                        </div>
                    </Tabs.Item>
                    {/* Y Axis tab end */}
                    {/* Annotations tab start */}
                    <Tabs.Item active title="Annotations" icon={HiClipboardList}>
                        <AnnotationTab />
                    </Tabs.Item>
                    {/* Annotations tab end */}
                    {/* Style tab start */}
                    <Tabs.Item title="Style" icon={HiAdjustments}>
                        <div className="w-full min-h-32">
                            <div className="w-full grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <div className="flex items-center">
                                        <Label className="inline mr-2" htmlFor="style-titlefont" value="Title Font:" />
                                        <TextInput id="style-titlefont" type="text" placeholder="Lora" {...register('styles.fontName')} />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="flex items-center h-full">
                                        <Label className="inline mr-2" htmlFor="style-color" value="Title Color:" />
                                        <Controller
                                            name="styles.fontColor"
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
                                        <TextInput id="style-fontsize" type="text" placeholder="18" {...register('styles.fontSize')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tabs.Item>
                    <Tabs.Item title="Properties" icon={HiClipboardList} >
                        {annotationSelected && <PropertiesTab />}
                    </Tabs.Item>
                </Tabs>
                <div className="w-full flex justify-between mt-10">
                    <Button color="blue" onClick={handleClearCache}>Reset Form</Button>
                    <Button color="success" onClick={onInsertImage}>Insert Image</Button>
                    <Button color="success" onClick={onDownloadChart}>Download Chart</Button>
                </div>

            </form>
        </FormProvider>
    );
}


export default ColbyChartForm
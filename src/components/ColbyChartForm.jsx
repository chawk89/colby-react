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
import GlobalTab from './form/tabs/GlobalTab';
import PropertiesTab from './form/tabs/PropertiesTab';
import DatasetsTab from './form/tabs/DatasetsTab';
import XAxisTab from './form/tabs/XAxisTab';
import YAxisTab from './form/tabs/YAxisTab';

const FormPropertyValues = ["annotationTemp", "global", "xAxis", "yAxis", "datasets", "axes"]

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
                    {/* global tab start */}
                    <Tabs.Item title="Global"  icon={MdDashboard}>
                        <GlobalTab keyLabels={keyLabels} />
                    </Tabs.Item>
                    {/* global tab end */}
                    {/* X Axis tab start */}
                    <Tabs.Item title="X-Axis" icon={MdDashboard}>
                        <XAxisTab />
                    </Tabs.Item>
                    {/* X Axis tab end */}
                    {/* Y Axis tab start */}
                    <Tabs.Item title="Y-Axis" icon={HiAdjustments}>
                        <YAxisTab />
                    </Tabs.Item>
                    {/* Y Axis tab end */}
                    {/* Style tab start */}
                    <Tabs.Item title="Datasets" active icon={HiAdjustments}>
                        <DatasetsTab />
                    </Tabs.Item>
                    {/* Annotations tab start */}
                    <Tabs.Item  title="Annotations"  icon={HiClipboardList}>
                        {annotationSelected && <PropertiesTab />}
                        <AnnotationTab />
                    </Tabs.Item>
                    {/* Annotations tab end */}
                    {/* <Tabs.Item title="Properties" icon={HiClipboardList} >
                    </Tabs.Item> */}
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
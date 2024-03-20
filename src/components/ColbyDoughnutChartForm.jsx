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

const ColbyDoughnutChartForm = () => {

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
                    <Tabs.Item title="Global" active icon={MdDashboard}>
                        <GlobalTab keyLabels={keyLabels} />
                    </Tabs.Item>
                    {/* global tab end */}
                  
                    {/* Style tab start */}
                    <Tabs.Item title="Datasets" icon={HiAdjustments}>
                        <DatasetsTab />
                    </Tabs.Item>                  
                    {/* Style tab End */}
                  
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


export default ColbyDoughnutChartForm
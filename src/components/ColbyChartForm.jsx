import React, { useCallback } from 'react'
import { Button, Tabs } from 'flowbite-react';
import { HiAdjustments, HiClipboardList } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { useForm, FormProvider } from "react-hook-form"
import { useChartContext } from '../hooks/useChartContext';
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
    const { state: { forms, annotationSelected }, dispatch, onDownloadChart, onInsertImage, onClearCache } = useChartContext()
    const methods = useForm({ defaultValues: forms })
    const {watch, reset: resetForm } = methods

    const { axes } = forms
    const { keyLabels } = axes
    console.log('[axes]', axes)

    const handleUpdate = useCallback((data) => {
        dispatch({ type: UDPATE_FORM, data })
    }, [dispatch])
    const handleClearCache = useCallback(() => {
        resetForm()
    }, [onClearCache])


    useFormValue(watch, handleUpdate, FormPropertyValues)

    const onSubmit = (data) => {
        // dispatch({ type: UDPATE_FORM, data })
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className='w-full'>
                <Tabs style="fullWidth" className='w-full'>
                    <Tabs.Item title="Global"  icon={MdDashboard}>
                        <GlobalTab keyLabels={keyLabels} />
                    </Tabs.Item>
                    <Tabs.Item title="X-Axis" icon={MdDashboard}>
                        <XAxisTab />
                    </Tabs.Item>
                    <Tabs.Item title="Y-Axis" icon={HiAdjustments}>
                        <YAxisTab />
                    </Tabs.Item>
                    <Tabs.Item title="Datasets" active icon={HiAdjustments}>
                        <DatasetsTab />
                    </Tabs.Item>
                    <Tabs.Item  title="Annotations"  icon={HiClipboardList}>
                        {annotationSelected && <PropertiesTab />}
                        <AnnotationTab />
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
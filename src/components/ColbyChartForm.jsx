import React, { useCallback, useState, useEffect } from 'react'
import { Button as MuiButton, Tabs, Tab, Box } from '@mui/material';
import { Button } from 'flowbite-react';
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
import TabsPanel from './form/tabs/TabsPanel'

const FormPropertyValues = ["annotationTemp", "global", "xAxis", "yAxis", "datasets", "axes"]

const ColbyChartForm = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [condition, setCondition] = useState(false);
    const { state: { forms, annotationSelected }, dispatch, onDownloadChart, onInsertImage, onClearCache } = useChartContext()
    const methods = useForm({ defaultValues: forms })
    const {watch, reset: resetForm } = methods

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        if (annotationSelected) {
            setActiveTab(4); 
        }
    }, [annotationSelected]);

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
            <Box sx={{ width: '100%' }}>
                    <Tabs value={activeTab} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
                        <Tab label="Global" icon={<MdDashboard />} />
                        <Tab label="X-Axis" icon={<MdDashboard />} />
                        <Tab label="Y-Axis" icon={<HiAdjustments />} />
                        <Tab label="Datasets" icon={<HiAdjustments />} />
                        <Tab label="Annotations" icon={<HiClipboardList />} />
                    </Tabs>
                    <TabsPanel value={activeTab} index={0}>
                        <GlobalTab keyLabels={keyLabels} />
                    </TabsPanel>
                    <TabsPanel value={activeTab} index={1}>
                        <XAxisTab />
                    </TabsPanel>
                    <TabsPanel value={activeTab} index={2}>
                        <YAxisTab />
                    </TabsPanel>
                    <TabsPanel value={activeTab} index={3}>
                        <DatasetsTab />
                    </TabsPanel>
                    <TabsPanel value={activeTab} index={4}>
                        {annotationSelected && <PropertiesTab />}
                        <AnnotationTab />
                    </TabsPanel>
                </Box>
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
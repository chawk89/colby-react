import React, { useCallback } from 'react';
import { useChartContext } from '../hooks/useChartContext'
import { useForm, FormProvider, Controller } from "react-hook-form"
import { UDPATE_FORM, FETCH_BOT_RES } from '../context/ChartContext'
import useFormValue from '../hooks/useFormValue';

const ChatBox = () => {
    const { state: { forms }, dispatch, onClearCache } = useChartContext()
    const methods = useForm({ defaultValues: forms })
    const { control, watch, reset: resetForm } = methods

    useFormValue(watch, ['message'])

    const onSubmit = useCallback((data) => {
        dispatch({ type: FETCH_BOT_RES, data: { message: data.message }})
        
    }, [dispatch]);

    return (
        <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full" style={{marginTop: '10px'}}>
            <label htmlFor="message" className="block mb-2 text-2xl font-medium text-gray-700 dark:text-white">Chat Box</label>
            <Controller
                name="message"
                control={control}
                defaultValue=''
                render={({ field }) => (
                    <textarea 
                        {...field}
                        id="message"
                        rows="20" 
                        className="block p-2.5 w-full text-normal text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write your thoughts here..."
                    />
                )}
            />
            <button type="submit"  style={{marginTop:'10px', borderRadius: '7px', border:'1px solid rgb(209 213 219)', padding:'4px'}}>submit</button>
            </form>
    )
}

export default ChatBox
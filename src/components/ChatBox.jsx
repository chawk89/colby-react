import React from 'react';
import { useChartContext } from '../hooks/useChartContext'
import { useFormContext } from 'react-hook-form';

const ChatBox = () => {
    const ColbyChartInfo = window.ColbyChartInfo; 
    const context = useChartContext(); 
    const { register, handleSubmit, watch } = useFormContext();
    const message = watch('global.message'); 


    const onSubmit = async (data) => {
        console.log('Submitted Message:', data.message);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full" style={{marginTop: '10px'}}>
            <label htmlFor="message" className="block mb-2 text-2xl font-medium text-gray-700 dark:text-white">Chat Box</label>
            <textarea rows="20" className="block p-2.5 w-full text-normal text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder='Write your thoughts here...'
            value={message}
            {...register('global.message')}
            >
            </textarea>
            <button type="submit"  style={{marginTop:'10px', borderRadius: '7px', border:'1px solid rgb(209 213 219)', padding:'4px'}}>submit</button>
            </form>
    )
}

export default ChatBox
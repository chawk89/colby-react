import React, { useState } from 'react'
import { useChartContext } from '../hooks/useChartContext'

const NarrativeMessage = () => {
    const ColbyChartInfo = window.ColbyChartInfo; 
    const botResponse = ColbyChartInfo.botResponse ? ColbyChartInfo.botResponse : {}; 
    const title = `Key Insights \n\n`
    const [textAreaContent, setTextAreaContent] = useState(title + botResponse.insights);

    return (
        <div className="w-full" style={{marginTop: '90px'}}>
            <label htmlFor="message" className="block mb-2 text-2xl font-medium text-gray-700 dark:text-white">Recommended Narrative</label>
            <textarea rows="20" className="block p-2.5 w-full text-normal text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder='Write your thoughts here...'
            value={textAreaContent}
            onChange={(e) => setTextAreaContent(e.target.value)}
            >
            </textarea>
        </div>
    )
}

export default NarrativeMessage
import React from 'react'

const ChartMenu = () => {
    return (
        // <ul className="colby-menu">
        //     <li className="colby-menu-title ">
        //         Add Annotations
        //         <span className="colby-tooltip">Interactive annotations can be added directly to the chart canvas. Click on any annotation to move it. Edit the details of the active annotation in the box below.</span>
        //     </li>
        //     <li className="colby-menu-title-separator"></li>
        //     <li>
        //         Line Annotation
        //         <ul className="colby-submenu">
        //             <li>Horizontal Line</li>
        //             <li>Vertical Line</li>
        //         </ul>
        //         <span className="colby-tooltip">A line with an optional label to highlight a baseline, value, or event.</span>
        //     </li>
        //     <li>Box Annotation<span className="colby-tooltip">A box and optional label to highlight a group of datapoints or provide an "unanchored" callout.</span></li>
        //     <li>Label Annotation<span className="colby-tooltip">Add a text label to annotate and describe a specific part of the chart.</span></li>
        //     <li>Arrow Annotation<span className="colby-tooltip">A directed line and optional label to highlight a trend.</span></li>
        //     <li>Growth/Difference Arrow<span className="colby-tooltip">Automatically calculate the percentage change between two data points.</span></li>
        //     <li>CAGR Arrow<span className="colby-tooltip">Automatically calculate the CAGR between two data points.</span></li>
        // </ul>
        <div id="dropdownDelay" className="colby-menu absolute z-10 hidden bg-[#f2f2f2] divide-y divide-gray-100 rounded-lg shadow w-44">
            <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDelayButton">
                <li>
                    <h4 className="block px-4 py-2 font-bold">Add Annotations</h4>
                </li>
                <li className='my-1 px-2'>
                    <hr className="h-px bg-gray-300 border-0"></hr>
                </li>
                <li className='relative group'>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-200">Line Annotation</a>
                    
                    <ul className="hidden py-2 group-hover:block translate-x-full top-0 p-0 bg-[#f2f2f2] absolute right-0 text-sm text-gray-700" aria-labelledby="dropdownDelayButton">
                        <li className='relative'>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Horizontal</a>
                        </li>
                        <li className='relative'>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Vertical</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-200">Box Annotation</a>
                </li>
                <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-200">Label Annotation</a>
                </li>
                <li className='relative group'>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-200">Arrow Annotation</a>
                    <ul className="hidden py-2 group-hover:block translate-x-full top-0 p-0 bg-[#f2f2f2] absolute right-0 text-sm text-gray-700" aria-labelledby="dropdownDelayButton">
                        <li className='relative'>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-200">General</a>
                        </li>
                        <li className='relative'>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-200">Growth/Difference</a>
                        </li>
                        <li className='relative'>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-200">CAGR</a>
                        </li>                        
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default ChartMenu
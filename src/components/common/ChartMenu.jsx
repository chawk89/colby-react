import React from 'react'

const ChartMenu = ({ onClick }) => {
    return (
        <div id="dropdownDelay" className="colby-menu absolute z-10 hidden bg-[#f2f2f2] divide-y divide-gray-100 rounded-lg shadow w-44">
            <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDelayButton">
                <li>
                    <h4 className="block px-4 py-2 font-bold">Add Annotations</h4>
                </li>
                <li className='my-1 px-2'>
                    <hr className="h-px bg-gray-300 border-0"></hr>
                </li>
                <li className='relative group'>
                    <span className="block hover:cursor-pointer px-4 py-2 hover:bg-gray-200 flex justify-between items-center"><span>Line Annotation</span>
                        <svg className="w-3 h-3 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"></path>
                        </svg>
                    </span>

                    <ul className="hidden py-2 group-hover:block translate-x-full top-0 p-0 bg-[#f2f2f2] absolute right-0 text-sm text-gray-700 rounded-lg shadow" aria-labelledby="dropdownDelayButton">
                        <li className='relative'>
                            <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'line', subtype: 'horizontal' })}>Horizontal</span>
                        </li>
                        <li className='relative'>
                            <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'line', subtype: 'vertical' })}>Vertical</span>
                        </li>
                    </ul>
                </li>
                <li>
                    <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'box', subtype: 'box' })}>Box Annotation</span>
                </li>
                <li>
                    <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'label', subtype: 'label' })}>Label Annotation</span>
                </li>
                <li className='relative group'>
                    <span className="block hover:cursor-pointer px-4 py-2 hover:bg-gray-200 flex justify-between items-center"><span>Arrow Annotation</span>
                        <svg className="w-3 h-3 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"></path>
                        </svg>
                    </span>
                    <ul className="hidden py-2 group-hover:block translate-x-full top-0 p-0 bg-[#f2f2f2] absolute right-0 text-sm text-gray-700 rounded-lg shadow" aria-labelledby="dropdownDelayButton">
                        <li className='relative'>
                            <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'arrow', subtype: 'general' })}>General</span>
                        </li>
                        <li className='relative'>
                            <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'arrow', subtype: 'grow' })}>Growth/Difference</span>
                        </li>
                        <li className='relative'>
                            <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'arrow', subtype: 'cagr' })}>CAGR</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default ChartMenu
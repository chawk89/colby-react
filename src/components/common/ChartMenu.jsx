import React, { useState, useEffect} from 'react'
import { ARROW_LINE_TYPE_CAGR, ARROW_LINE_TYPE_GENERAL, ARROW_LINE_TYPE_GROW_METRIC } from './types'
import { Select, Label, TextInput} from 'flowbite-react';
import useChartLabels from '../../hooks/useChartLabels';
import { useChartContext } from '../../hooks/useChartContext';
import { PopoverPicker } from './PopoverPicker';

const ChartMenu = ({ onClick, selectedAnnotationType }) => {
    const [axis, setAxis] = useState("x"); 
    const [axisPosition, setAxisPosition] = useState('10'); 
    const [lineStyle, setLineStyle] = useState('None'); 
    const [axisLabel, setAxisLabel] = useState(''); 
    const [lineThickness, setLineThickness] = useState('10'); 
    const { state, onAddAnnotation } = useChartContext(); 
    const [colorValue, setColorValue] = useState(''); 
    const labels = useChartLabels(state);

    useEffect(() => {
        console.log("axis??", axis)
    }, [axis])

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
                    <span className="block hover:cursor-pointer px-4 py-2 hover:bg-gray-200 flex justify-between items-center" onClick={(e) => onClick(e, { type: 'line', subtype: 'vertical' })}><span>Line Annotation</span>

                    </span>
                <div className="absolute left-full top-0 ml-4 hidden group-hover:block bg-white shadow-lg p-2" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', border: '1px solid red', width: '350px'}}>
                    <div style={{display: 'flex', justifyContent: 'flex-start', alignItems:'center', width: '100%'}}>
                        <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Label className="inline mr-2" htmlFor="annotationAxisSelect" value="Axis:" />
                            <Select value={axis} onChange={(e) => setAxis(e.target.value)}>
                                <option value="x">X</option>
                                <option value="y">Y</option>
                            </Select>
                        </div>
                            <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                                <Label className="inline mr-2 shrink-0" htmlFor="axis-position" value="Axis Position:" />
                                {
                                    axis === 'x' ?
                                        <TextInput id="axis-position" type="text" placeholder="10"  /> :
                                        <Select id="axis-position" >
                                            {labels.map((label, index) => <option value={label} key={index}>{label}</option>)}
                                        </Select>
                                }
                            </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-around', alignItems:'center'}}>
                    <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Label className="inline mr-2 shrink-0" htmlFor="anno-linestyle" value="Line Style:" />
                        <Select id="anno-linestyle" value={lineStyle} onChange={(e) => setLineStyle(e.target.value)} >
                            <option value='none'>None</option>
                            <option value='dashed'>Dashed</option>
                            <option value='wave'>Wave</option>
                        </Select>
                    </div>
                    <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Label className="inline mr-2 shrink-0" htmlFor="axis-label" value="Label:" />
                        <TextInput id="axis-label" type="text" placeholder="Default Label" onChange={(e) => setAxisLabel(e.target.value)} />
                    </div>
                </div>
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="anno-line-thickness" value="Line Thickness:" />
                    <TextInput id="anno-line-thickness" type="text" placeholder="10" onChange={(e) => setLineThickness(e.target.value)}/>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-around', alignItems:'center'}}>
                <div className="flex items-center" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Label className="inline mr-2 shrink-0" htmlFor="anno-linecolor" value="Line Color:" />
                    <PopoverPicker color={colorValue}/>
                </div>
                </div>
                </div>
                

                </li>
                <li>
                    <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'box', subtype: 'box' })}>Box Annotation</span>
                </li>
                <li>
                    <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'label', subtype: 'label' })}>Label Annotation</span>
                </li>
                <li className='relative group'>
                    <span className="block hover:cursor-pointer px-4 py-2 hover:bg-gray-200 flex justify-between items-center" onClick={(e) => onClick(e, { type: 'arrow', subtype: ARROW_LINE_TYPE_GENERAL })}><span>Arrow Annotation</span>
                        {/* <svg className="w-3 h-3 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"></path>
                        </svg> */}
                    </span>
                    <ul className="hidden py-2 group-hover:block translate-x-full top-0 p-0 bg-[#f2f2f2] absolute right-0 text-sm text-gray-700 rounded-lg shadow" aria-labelledby="dropdownDelayButton" >
                        {/* <li className='relative'>
                            <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'arrow', subtype: ARROW_LINE_TYPE_GENERAL })}>Global</span>
                        </li>
                        <li className='relative'>
                            <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'arrow', subtype: ARROW_LINE_TYPE_GROW_METRIC })}>Growth/Difference</span>
                        </li>
                        <li className='relative'>
                            <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'arrow', subtype: ARROW_LINE_TYPE_CAGR })}>CAGR</span>
                        </li> */}
                    </ul>
                </li>
                <li>
                    <span className="block px-4 py-2 hover:bg-gray-200 hover:cursor-pointer" onClick={(e) => onClick(e, { type: 'emphasis', subtype: 'emphasis' })}>Emphasis Annotation</span>
                </li>
            </ul>
        </div>
    )
}

export default ChartMenu
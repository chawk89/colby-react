import React from 'react'

const ChartMenu = () => {
    return (
        <ul className="colby-menu">
            <li className="colby-menu-title ">
                Add Annotations
                <span className="colby-tooltip">Interactive annotations can be added directly to the chart canvas. Click on any annotation to move it. Edit the details of the active annotation in the box below.</span>
            </li>
            <li className="colby-menu-title-separator"></li>
            <li>
                Line Annotation
                <ul className="colby-submenu">
                    <li>Horizontal Line</li>
                    <li>Vertical Line</li>
                </ul>
                <span className="colby-tooltip">A line with an optional label to highlight a baseline, value, or event.</span>
            </li>
            <li>Box Annotation<span className="colby-tooltip">A box and optional label to highlight a group of datapoints or provide an "unanchored" callout.</span></li>
            <li>Label Annotation<span className="colby-tooltip">Add a text label to annotate and describe a specific part of the chart.</span></li>
            <li>Arrow Annotation<span className="colby-tooltip">A directed line and optional label to highlight a trend.</span></li>
            <li>Growth/Difference Arrow<span className="colby-tooltip">Automatically calculate the percentage change between two data points.</span></li>
            <li>CAGR Arrow<span className="colby-tooltip">Automatically calculate the CAGR between two data points.</span></li>
        </ul>
    )
}

export default ChartMenu
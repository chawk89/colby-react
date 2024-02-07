import React from 'react'
import { Spinner } from 'flowbite-react';

const ColbyLoader = () => {
    return (
        <div className="flex flex-wrap gap-2 h-full items-center justify-center">
            <Spinner aria-label="Loading" size="xl" />
        </div>
    )
}

export default ColbyLoader
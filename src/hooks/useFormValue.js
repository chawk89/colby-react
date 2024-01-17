import { useState } from 'react'
import { copySimpleObject, isEqualObject } from '../utils/utils';
import useDebounceEffect from './useDebounceEffect';


const useFormValue = (watch, onChangeHandle) => {

    const formValues = watch();
    const [preValues, setPrevValues] = useState(formValues)

    useDebounceEffect(() => {
        if (isEqualObject(preValues, formValues)) return;
        setPrevValues(copySimpleObject(formValues))
        onChangeHandle(formValues)
    }, [formValues, preValues, setPrevValues, onChangeHandle], 200)   

}

export default useFormValue
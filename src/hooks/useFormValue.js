import { useState } from 'react'
import { copySimpleObject, isEqualObject } from '../utils/utils';
import useDebounceEffect from './useDebounceEffect';

const checkValidateValueSame = (isEqual, propertyList, { preValues, curValues }) => {
    return propertyList.every(a => isEqual(preValues[a], curValues[a]))
}
const useFormValue = (watch, onChangeHandle, list) => {

    const formValues = watch();
    const [preValues, setPrevValues] = useState(formValues)

    useDebounceEffect(() => {
        if (checkValidateValueSame(isEqualObject, list, { preValues, curValues: formValues })) return;
        setPrevValues(copySimpleObject(formValues))
        onChangeHandle(formValues)
    }, [formValues, preValues, setPrevValues, onChangeHandle, list], 200)

}

export default useFormValue




import { useCallback } from "react"

const useIsStorageValueExists = () => {
    const ColbyChartInfo = window?.ColbyChartInfo

    if (!ColbyChartInfo) {
        throw Error('ColbyChartInfo is missing test')
    }

    const { storageKey } = ColbyChartInfo
    const storageValue = JSON.parse(localStorage.getItem(storageKey))
    const clearStorageCache = useCallback(() => {
        localStorage.removeItem(storageKey)
    }, [storageKey])
    if (!storageValue) return [false, clearStorageCache]
    return [true, clearStorageCache];
}

export default useIsStorageValueExists
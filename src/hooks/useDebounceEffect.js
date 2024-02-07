import { useEffect, useRef } from 'react';

export const useDebounceEffect = (effect, dependency, delay) => {
    const timeoutIdRef = useRef(null);

    useEffect(() => {
        // Cleanup function to clear the timeout on unmount or when the dependency changes
        const cleanup = () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };

        // Set up the timeout to trigger the effect after the specified delay
        timeoutIdRef.current = setTimeout(() => {
            effect();
        }, delay);

        // Cleanup the previous timeout on dependency changes or component unmount
        return cleanup;
    }, [effect, dependency, delay]);

    // Return the cleanup function for external use if needed
    return () => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }
    };
};

export default useDebounceEffect;

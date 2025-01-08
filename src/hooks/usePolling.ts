import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function usePolling(ms: number=50000, searchParam: string|null) {

    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Interval running")
            if(!searchParam) {
                console.log("refreshing data") 
                router.refresh();
            }
        },ms)
        return () => clearInterval(interval);
    },[searchParam, ms]) // eslint-disable-line react-hooks/exhaustive-deps
}
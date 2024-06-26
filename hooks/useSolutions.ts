import { useEffect, useState, useTransition } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"

type Solutions = Record<string, any>;

export function useSolutions(filter: any) {
    // solutions
    const [isPending, startTransition] = useTransition();
    const [solutions, setSolutions] = useState<Solutions>({});

    useEffect(() => {
        fetch("/lc-rating/solutions.json?t=" + (new Date().getTime() / 100000).toFixed(0))
            .then((res) => res.json())
            .then((result: Solutions) => {
                startTransition(() => {
                    setSolutions(result);
                });
            });
    }, [filter]);

    return { solutions, isPending };
}
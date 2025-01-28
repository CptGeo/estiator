import type { PropsWithChildren, ReactNode } from "react";
import { useEffect, useState } from "react";

/**
 * Creates a wrapper that allows a component to be in the DOM only for a specified ammount of time.
 * Then, the child component is getting hidden from the DOM.
 */
export function TimeLimited(props: PropsWithChildren<{ delay: number }>): ReactNode {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setHidden(true);
        }, props.delay);

        return () => {
            clearTimeout(t);
        }
    }, []);

    if (!hidden) {
        return props.children;
    }
}
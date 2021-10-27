import { useCallback, useEffect, useRef, useState } from "react";

export interface StrobeProps {
    classNames?: string;
    style?: CSSStyleSheet;
    flashOptions?: {flashFrames: number, loopFrames: number}
}


const Strobe = (props: StrobeProps) => {
    const [, setUpdater] = useState(false);
    const [options] = useState(props.flashOptions || {flashFrames: 2, loopFrames: 5});
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef(0);
    const previousTimeRef = useRef(0);

    const counterRef = useRef(0);
    const animate = useCallback((time: number) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            if (deltaTime > 1000 / 30) {
                previousTimeRef.current = time;
                if (counterRef) counterRef.current = (counterRef.current + 1) % options.loopFrames;
                setUpdater(b => !b);
            }
        } else {
            previousTimeRef.current = time;
        }
        requestRef.current = requestAnimationFrame(animate);
    }, [options]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]); // Make sure the effect runs only once

    return (
        <div className="w-100 h-100 ">
            <div className="w-100 h-100 flash" style={{ opacity: counterRef.current < options.flashFrames ? 1 : 0 }}>
                {counterRef.current}
            </div>
        </div>
    );
};

export default Strobe;

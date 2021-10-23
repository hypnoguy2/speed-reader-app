import { useEffect, useRef } from "react";
import _ from "lodash";

export interface StrobeProps {
    classNames?: string;
    style?: CSSStyleSheet;
    fps: number;
}

const Strobe = (props: StrobeProps) => {
    const renderTime = useRef(0);

    useEffect(() => {
        console.log("interval ", performance.now() - renderTime.current, " ", props.fps);

        renderTime.current = performance.now();
    });

    const animationDuration = props.fps ? `calc(1000ms/${props.fps})` : "0s";

    return (
        <div className="w-100 h-100 ">
            <div
                className="w-100 h-100 flash"
                style={{ animationDuration: animationDuration }}></div>
        </div>
    );
};

export default Strobe;

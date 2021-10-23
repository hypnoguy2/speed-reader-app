import { useEffect, useRef } from "react";
import _ from "lodash";

export interface StrobeProps {
    classNames?: string;
    style?: CSSStyleSheet;
    fps: number;
    // colors: string[];
}

const Strobe = (props: StrobeProps) => {
    // const { colors } = props;
    // const [bg, setBg] = useState<string>(colors[0]);
    const renderTime = useRef(0);

    // const updateBg = useCallback(() => {
    //     setBg((state) => {
    //         const filtered = colors.filter((c) => c !== state);
    //         return filtered[_.random(0, filtered.length - 1)];
    //     });
    // }, [colors]);

    useEffect(() => {
        console.log("interval ", performance.now() - renderTime.current);
        renderTime.current = performance.now();
    });

    // useEffect(() => {
    //     const time = props.fps ? (1 / props.fps) * 1000 : 1000;
    //     const interval = setInterval(updateBg, time);
    //     return () => {
    //         clearInterval(interval);
    //     };
    // }, [props, updateBg]);

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

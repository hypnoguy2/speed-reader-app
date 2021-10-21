import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";

export interface StrobeProps {
    fps: number;
    colors: string[];
}

const Strobe = (props: StrobeProps) => {
    const {colors} = props
    const [bg, setBg] = useState<string>(colors[0]);

    const updateBg = useCallback(() => {
        setBg((state) => {
            const filtered = colors.filter((c) => c !== state);
            return filtered[_.random(0, filtered.length - 1)];
        });
    }, [colors]);

    useEffect(() => {
        const time = props.fps ? (1 / props.fps) * 1000 : 1000;
        const interval = setInterval(updateBg, time);

        console.log(time);
        return () => {
            clearInterval(interval);
        };
    }, [props, updateBg]);

    return (
        <div className="w-100 h-100 " style={{background: bg, transition: "all .05s linear" }}>
        </div>
    );
};

export default Strobe;

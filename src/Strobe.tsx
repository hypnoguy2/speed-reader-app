import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";

const styles: CSSProperties = {
    width: "100%",
    height: "100%",
};

export interface StrobeProps {
    fps?: number;
    colors?: string[];
}

const Strobe = (props: StrobeProps) => {
    const colors = useMemo(() => props.colors || ["white", "black"], [props]);
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

        return () => clearInterval(interval);
    }, [props, updateBg]);

    return (
        <div className="Strobe" style={{ ...styles, background: bg }}>
            {bg}
        </div>
    );
};

export default Strobe;

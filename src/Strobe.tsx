export interface StrobeProps {
    classNames?: string;
    style?: CSSStyleSheet;
    fps: number;
}

const Strobe = (props: StrobeProps) => {
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

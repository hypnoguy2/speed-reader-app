import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useScript } from "./ScriptDisplay";
import { loremIpsum } from "./Scripts";
import MenuContainer from "./SettingsContainer";
import Strobe from "./Strobe";

const App = () => {
    const [strobo] = useState(false);
    const [show, setShow] = useState(true);
    const [fps, setFps] = useState(1);
    const [fontSize, setFontSize] = useState("10vw");
    const [script, setScript] = useState(loremIpsum);
    const [words, setWords] = useState(script.split(" "));
    const [loops, setLoops] = useState(0);

    const {
        isRunning,
        isActive,
        index,
        wpm,
        handleWPMChange,
        handleStart,
        handleResume,
        handlePause,
        handleReset,
    } = useScript();

    const renderTime = useRef(0);

    useEffect(() => {
        console.log("interval ", performance.now() - renderTime.current, " ", fps);

        renderTime.current = performance.now();
    });

    useEffect(() => {
        if (index > 0 && index >= words.length - 1) {
            handleReset();
            setLoops((l) => l + 1);
        }
    }, [index, words, handleReset, setLoops]);

    useEffect(() => {
        if (show) {
            if (isRunning) handlePause();
        } else {
            if (isActive && !isRunning) handleResume();
            if (!isActive && loops === 0) handleStart();
        }
    }, [show, loops, isRunning, isActive, handleStart, handleResume, handlePause]);

    useEffect(() => {
        const handleSDown = (ev: KeyboardEvent) => {
            if (ev.key === "s") setShow(true);
        };
        document.addEventListener("keydown", handleSDown);

        return () => document.removeEventListener("keydown", handleSDown);
    }, [setShow]);

    const handleScriptChange = (value: string) => {
        setScript(value);
        setWords(value.split(/\s+/));
        handleReset();
    };

    return (
        <Container className="h-100 w-100 p-0" fluid>
            {!show && strobo && <Strobe fps={fps} />}
            <div className="text-wrapper">
                <div className="text">{words[index]}</div>
            </div>
            <MenuContainer
                show={show}
                backdrop={false}
                placement="end"
                fps={fps}
                script={script}
                wpm={wpm}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                onFpsChange={setFps}
                onWpmChange={handleWPMChange}
                onScriptChange={handleScriptChange}
                onHide={() => setShow((show) => !show)}
            />
        </Container>
    );
};

export default App;

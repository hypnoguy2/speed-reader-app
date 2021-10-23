import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useScript } from "./ScriptDisplay";
import { loremIpsum } from "./Scripts";
import SettingsContainer from "./SettingsContainer";
import Strobe from "./Strobe";

const App = () => {
    const [isStrobo, setIsStrobo] = useState(false);
    const [show, setShow] = useState(true);
    const [fps, setFps] = useState(1);
    const [script, setScript] = useState(loremIpsum);
    const [words, setWords] = useState(script.split(" "));
    const [loops, setLoops] = useState(0);
    // const [colors, setColors] = useState(["black", "white"]);

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
    } = useScript(words);

    const startStrobo = () => setIsStrobo(true);
    const stopStrobo = () => setIsStrobo(false);

    useEffect(() => {
        if (index >= words.length - 1) {
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
    }

    return (
        <Container className="h-100 w-100 p-0" fluid>
            {isStrobo && <Strobe fps={fps} />}
            <div className="text-wrapper">
                <div className="text">{words[index]}</div>
            </div>
            <SettingsContainer
                show={show}
                backdrop={false}
                fps={fps}
                script={script}
                wpm={wpm}
                // colors={colors}
                onStopStrobo={stopStrobo}
                onStartStrobo={startStrobo}
                onFpsChange={setFps}
                onWpmChange={handleWPMChange}
                onScriptChange={handleScriptChange}
                // onColorChange={(value) => setColors(value)}
                onHide={() => setShow((show) => !show)}
            />
        </Container>
    );
};

export default App;

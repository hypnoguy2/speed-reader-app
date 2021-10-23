import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ScriptDisplay, { ScriptEvent } from "./ScriptDisplay";
import { loremIpsum } from "./Scripts";
import SettingsContainer from "./SettingsContainer";
import Strobe from "./Strobe";

const App = () => {
    const [isStrobo, setIsStrobo] = useState(false);
    const [fps, setFps] = useState(1);
    // const [colors, setColors] = useState(["black", "white"]);

    const startStrobo = () => setIsStrobo(true);
    const stopStrobo = () => setIsStrobo(false);

    const handleSettingsClose = () => {
        //setTimeout(() => handleStart(), 1000);
    };

    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
        const event = new CustomEvent(ScriptEvent, { detail: "resume" });
        document.dispatchEvent(event);
    };

    const handleOpen = () => {
        setShow(true);
        const event = new CustomEvent<string>(ScriptEvent, { detail: "pause" });
        document.dispatchEvent(event);
    };

    useEffect(() => {
        const handleSDown = (ev: KeyboardEvent) => {
            if (ev.key === "s") show ? handleClose() : handleOpen();
        };
        document.addEventListener("keydown", handleSDown);

        return () => document.removeEventListener("keydown", handleSDown);
    });
    return (
        <Container className="h-100 w-100 p-0" fluid>
            {isStrobo && <Strobe fps={fps} />}
            <ScriptDisplay script={loremIpsum} wpm={600} />
            <SettingsContainer
                show={show}
                backdrop={false}
                fps={fps}
                // colors={colors}
                onStopStrobo={stopStrobo}
                onStartStrobo={startStrobo}
                onFpsChange={(value) => setFps(value)}
                // onColorChange={(value) => setColors(value)}
                onHide={handleSettingsClose}
            />
        </Container>
    );
};

export default App;

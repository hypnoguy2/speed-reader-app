import React, { useState } from "react";
import { Container } from "react-bootstrap";
import ScriptDisplay from "./ScriptDisplay";
import SettingsContainer from "./SettingsContainer";
import Strobe from "./Strobe";

const App = () => {
    const [isStrobo, setIsStrobo] = useState(false);

    const [fps, setFps] = useState("10");
    const [colors, setColors] = useState(["black", "white"]);

    const startStrobo = () => setIsStrobo(true);
    const stopStrobo = () => setIsStrobo(false);

    return (
        <Container className="h-100 w-100 p-0" fluid>
            {isStrobo && <Strobe fps={Number(fps)} colors={colors} />}
            <ScriptDisplay></ScriptDisplay>
            <SettingsContainer
                fps={fps}
                colors={colors}
                onStopStrobo={stopStrobo}
                onStartStrobo={startStrobo}
                onFpsChange={(value) => setFps(value)}
                onColorChange={value => setColors(value)}
            />
        </Container>
    );
};

export default App;

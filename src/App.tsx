import React, { useState } from "react";
import { Container } from "react-bootstrap";
import ScriptDisplay from "./ScriptDisplay";
import SettingsModal from "./SettingsModal";
import Strobe from "./Strobe";

const App = () => {
    const [isStrobo, setIsStrobo] = useState(false);

    const [fps, setFps] = useState("10");
    const [colors, setColors] = useState(["black", "white"]);

    const startStrobo = () => setIsStrobo(true);
    const stopStrobo = () => setIsStrobo(false);

    return (
        <Container className="App" fluid>
            {isStrobo && <Strobe fps={Number(fps)} colors={["white", "black", "red", "blue"]} />}
            <ScriptDisplay></ScriptDisplay>
            <SettingsModal
                fps={fps}
                colors={colors}
                onStopStrobo={stopStrobo}
                onStartStrobo={startStrobo}
                onFpsChange={(value) => setFps(value)}
            />
        </Container>
    );
};

export default App;

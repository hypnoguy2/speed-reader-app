import React from "react";
import { Button } from "react-bootstrap";
import Strobe from "./Strobe";

const App = () => {
    return (
        <div className="App">
            <Strobe fps={1} colors={["white", "black", "blue", "red", "#FFFF00"]} />
            <Button>Test</Button>
        </div>
    );
};

export default App;

import React from "react";
import ReactDOM from "react-dom";
import "./sass/index.scss";
import App from "./App";
import { ScriptProvider } from "./ScriptContext";

ReactDOM.render(
    <React.StrictMode>
        <ScriptProvider>
            <App />
        </ScriptProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

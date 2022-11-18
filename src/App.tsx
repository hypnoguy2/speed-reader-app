import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Toast, ToastContainer } from "react-bootstrap";

import { MenuModal } from "./MenuModal";
import { useContextScript } from "./ScriptContext";

const App = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const [coverBG, setCoverBG] = useState(false);
    const [isPaused, setIsPaused] = useState(true);

    const {
        element,
        isActive,
        isRunning,
        handlePause: pauseScript,
        handleResume: resumeScript,
        handleStart,
        handleReset,
        resetScriptHook,
    } = useContextScript();

    // Performance checker
    // const renderTime = useRef(0);
    // useEffect(() => {
    //     console.log("interval ", performance.now() - renderTime.current);

    //     renderTime.current = performance.now();
    // });

    useEffect(() => {
        resetScriptHook();
    }, []);

    const handlePause = useCallback(() => {
        pauseScript();
        setIsPaused(true);
    }, [pauseScript]);

    const handleResume = useCallback(() => {
        setIsPaused(false);
        resumeScript();
    }, [resumeScript]);

    const toggleMenu = useCallback(() => {
        if (menuOpen) handleResume();
        else handlePause();
        setMenuOpen(!menuOpen);
    }, [handlePause, handleResume, menuOpen]);

    // --- effects for useScript implementation --
    useEffect(() => {
        const handleSDown = (ev: KeyboardEvent) => {
            if (ev.key === "Escape") {
                toggleMenu();
            }
            if (ev.key === "p") {
                if (isRunning) handlePause();
                else handleResume();
            }
            if (ev.key === "s") {
                handleStart();
            }
            if (ev.key === "r") {
                handleReset();
            }
        };
        document.addEventListener("keydown", handleSDown);

        return () => document.removeEventListener("keydown", handleSDown);
    }, [handlePause, handleReset, handleResume, handleStart, isRunning, toggleMenu]);

    // Option change handlers
    const handleFileChange = (file: File | null) => {
        if (file) setFile(file);
    };

    const handleCoverChange = (val: boolean) => {
        setCoverBG(val);
    };

    const background = useMemo(() => {
        if (file)
            return (
                <img className="background" src={URL.createObjectURL(file)} alt="background file" />
            );
    }, [file]);

    return (
        <Container className="h-100 w-100 p-0" fluid>
            <div className={"background-wrapper " + (coverBG ? "cover" : "")}>
                {!menuOpen && background}
            </div>
            {isActive && element}
            <ToastContainer className="p-3" position="bottom-center">
                <Toast show={!menuOpen && isPaused}>
                    <Toast.Body>Script is paused</Toast.Body>
                </Toast>
            </ToastContainer>
            <MenuModal
                show={menuOpen}
                onHide={toggleMenu}
                onFileChange={handleFileChange}
                onCoverChange={handleCoverChange}
            />
        </Container>
    );
};

export default App;

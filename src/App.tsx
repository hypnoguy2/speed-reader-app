import { useEffect, useMemo, useState } from "react";
import { Container, Toast, ToastContainer } from "react-bootstrap";

import { MenuModal } from "./MenuModal";
import { useContextScript } from "./ScriptContext";

const App = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [paused, setPaused] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [coverBG, setCoverBG] = useState(false);

    const { element, isActive, handlePause, handleResume } = useContextScript();

    // Performance checker
    // const renderTime = useRef(0);
    // useEffect(() => {
    //     console.log("interval ", performance.now() - renderTime.current);

    //     renderTime.current = performance.now();
    // });

    // --- effects for useScript implementation --
    useEffect(() => {
        const handleSDown = (ev: KeyboardEvent) => {
            if (ev.key === "Escape") {
                handlePause();
                setMenuOpen(true);
            }
            if (ev.key === "p") {
                if (isActive) {
                    if (paused) {
                        handleResume();
                        setPaused(false);
                    } else {
                        handlePause();
                        setPaused(true);
                    }
                }
            }
        };
        document.addEventListener("keydown", handleSDown);

        return () => document.removeEventListener("keydown", handleSDown);
    }, [handlePause, handleResume, isActive, paused]);

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
                <Toast show={!menuOpen && paused}>
                    <Toast.Body>Script is paused</Toast.Body>
                </Toast>
            </ToastContainer>
            <MenuModal
                show={menuOpen}
                onHide={() => setMenuOpen(false)}
                onFileChange={handleFileChange}
                onCoverChange={handleCoverChange}
            />
        </Container>
    );
};

export default App;

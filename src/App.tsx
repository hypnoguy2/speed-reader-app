import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
    Button,
    Card,
    Container,
    Form,
    ListGroup,
    Modal,
    Nav,
    Navbar,
    Tab,
    Toast,
    ToastContainer,
} from "react-bootstrap";

import { standardWrapper, pivot } from "./Helpers";
import { HowToPage } from "./HowToPage";
import { useContextScript } from "./ScriptContext";
import { example } from "./Scripts";

const App = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [activeKey, setActiveKey] = useState("howTo");
    const [script, setScript] = useState(example);
    const [loops, setLoops] = useState(0);
    const [usePivot, setUsePivot] = useState(false);
    const [paused, setPaused] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [coverBG, setCoverBG] = useState(false);

    const {
        script: hookScript,
        index,
        element,
        isActive,
        handleStart,
        handlePause,
        handleResume,
        setPivotFunction,
        resetScript,
        setLoops: setHookLoops,
        setScript: setHookScript,
    } = useContextScript();

    // Performance checker
    // const renderTime = useRef(0);
    // useEffect(() => {
    //     console.log("interval ", performance.now() - renderTime.current);

    //     renderTime.current = performance.now();
    // });

    // --- effects for useScript implementation ---
    useEffect(() => {
        setHookLoops(loops);
    }, [loops, setHookLoops]);

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

    // -----------------------------------------------

    // Option change handlers
    const handleScriptChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setScript(ev.target.value);
    };

    const handleLoopsChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) setLoops(Number(ev.target.value));
    };

    const handlePivotChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setUsePivot(ev.target.checked);
        setPivotFunction(() => (ev.target.checked ? pivot : standardWrapper));
    };

    const handleNavSelect = (eventKey: string | null, e: React.SyntheticEvent<unknown>) => {
        if (eventKey !== null) setActiveKey(eventKey);
    };

    const handleApplyScript = () => {
        setHookScript(script);
    };

    const handleStartScript = () => {
        setMenuOpen(false);
        setPaused(false);

        if (!isActive) {
            if (index !== 0) resetScript();
            handleStart();
        } else handleResume();
    };

    const handleFileChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files) setFile(ev.target.files[0]);
    };

    const handleCoverChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setCoverBG(ev.target.checked);
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
            <Modal
                show={menuOpen}
                backdrop={false}
                fullscreen="lg-down"
                size="lg"
                scrollable
                centered
                dialogClassName="align-items-stretch">
                <Navbar bg="light">
                    <Container>
                        <Nav
                            className="me-auto"
                            onSelect={handleNavSelect}
                            defaultActiveKey={activeKey}>
                            <Nav.Link eventKey="editor">Editor</Nav.Link>
                            <Nav.Link eventKey="settings">Settings</Nav.Link>
                            <Nav.Link eventKey="howTo">How to use</Nav.Link>
                        </Nav>
                        <button className="btn-close" onClick={() => setMenuOpen(false)}></button>
                    </Container>
                </Navbar>
                <Modal.Body>
                    <Tab.Content className="h-100">
                        <Tab.Pane active={activeKey === "editor"} className="h-100">
                            <div className="d-flex flex-column h-100">
                                <Form.Control
                                    as="textarea"
                                    value={script}
                                    style={{ resize: "none", flexGrow: 1 }}
                                    autoFocus
                                    onChange={handleScriptChange}
                                />
                            </div>
                        </Tab.Pane>
                        <Tab.Pane active={activeKey === "settings"}>
                            <Card className="mb-4 border-0">
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Form.Label>Number of Loops</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={loops}
                                            onChange={handleLoopsChange}
                                            max={10}
                                            min={0}
                                        />
                                        <Form.Text>
                                            Number of times the script should be repeated.
                                        </Form.Text>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Check
                                            type="checkbox"
                                            id="use-pivot"
                                            label="Use pivot centering"
                                            checked={usePivot}
                                            onChange={handlePivotChange}
                                        />
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                            <Card className="mb-4 border-0">
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Form.Group className="mb-3" controlId="formFile">
                                            <Form.Label>Set background file</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </Form.Group>
                                        {file && (
                                            <img
                                                className="previewImg"
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                            />
                                        )}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Check
                                            type="checkbox"
                                            id="scale-img"
                                            label="Scale image to full background"
                                            checked={coverBG}
                                            disabled={!file}
                                            onChange={handleCoverChange}
                                        />
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Tab.Pane>
                        <Tab.Pane active={activeKey === "howTo"}>
                            <HowToPage />
                        </Tab.Pane>
                    </Tab.Content>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={hookScript === script ? "secondary" : "success"}
                        onClick={handleApplyScript}>
                        {hookScript === script ? "Script processed" : "Process Script"}
                    </Button>
                    <Button variant="primary" onClick={handleStartScript}>
                        {isActive ? "Resume" : "Start"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default App;

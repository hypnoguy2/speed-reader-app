import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Container, Form, ListGroup, Modal, Nav, Navbar, Tab } from "react-bootstrap";
import { standardWrapper, pivot } from "./Helpers";
import { HowToPage } from "./HowToPage";

import { useScriptDisplay } from "./ScriptDisplay";
import { induction } from "./Scripts";
import Strobe from "./Strobe";

const App = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [activeKey, setActiveKey] = useState("howTo");

    const [script, setScript] = useState(induction);

    const [fontSize, setFontSize] = useState("10");
    const [loops, setLoops] = useState(0);

    const [usePivot, setUsePivot] = useState(false);
    const [strobo, setStrobo] = useState(false);

    const {
        script: hookScript,
        element,
        isActive,
        isRunning,
        wpm,
        handleStart,
        handlePause,
        handleResume,
        handleStop,
        breakFor,
        setWPM,
        setPivotFunction,
        setLoops: setHookLoops,
        setScript: setHookScript,
    } = useScriptDisplay(script);

    // Performance checker
    // const renderTime = useRef(0);
    // useEffect(() => {
    //     console.log("interval ", performance.now() - renderTime.current);

    //     renderTime.current = performance.now();
    // });

    // --- effects for useScript implementation ---
    useEffect(() => {
        if (!menuOpen)
            setTimeout(() => {
                handleStart();
            }, 1000);
    }, [handleStart, menuOpen]);

    useEffect(() => {
        setHookLoops(loops);
    }, [loops, setHookLoops]);

    useEffect(() => {
        const handleSDown = (ev: KeyboardEvent) => {
            if (ev.key === "m") {
                handlePause();
                setMenuOpen(true);
            }
            if (ev.key === "p") {
                if (!isActive) return;
                if (isRunning) handlePause();
                else handleResume();
            }
            if (ev.key === "s") {
                handleStop();
            }
            if (ev.key === "b") {
                breakFor(2);
            }
            if (ev.key === "w") {
                setWPM(wpm === 300 ? 100 : 300);
            }
        };
        document.addEventListener("keydown", handleSDown);

        return () => document.removeEventListener("keydown", handleSDown);
    }, [breakFor, handlePause, handleResume, handleStop, isActive, isRunning, setWPM, wpm]);

    // -----------------------------------------------

    // Option change handlers
    const handleScriptChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setScript(ev.target.value);
    };

    const handleWPMChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) {
            // setWPM(Number(ev.target.value));
        }
    };

    const handleFontSizeChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) setFontSize(ev.target.value);
    };

    const handleLoopsChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) setLoops(Number(ev.target.value));
    };

    const handlePivotChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setUsePivot(ev.target.checked);
        setPivotFunction(() => (ev.target.checked ? pivot : standardWrapper));
    };

    const handleStroboChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setStrobo(ev.target.checked);
    };

    const handleNavSelect = (eventKey: string | null, e: React.SyntheticEvent<unknown>) => {
        if (eventKey !== null) setActiveKey(eventKey);
    };

    const handleApplyScript = () => {
        setHookScript(script);
    };

    return (
        <Container className="h-100 w-100 p-0" fluid>
            <div style={{ fontSize: "10vw" }}>{isActive && element}</div>
            {strobo && isActive && <Strobe flashOptions={{ flashFrames: 1, loopFrames: 2 }} />}
            <Modal
                show={menuOpen}
                backdrop={false}
                fullscreen="lg-down"
                size="lg"
                scrollable
                centered
                dialogClassName="align-items-stretch"
                onHide={() => setMenuOpen(false)}>
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
                                        <Form.Label>WPM (Words Per Second)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={wpm}
                                            onChange={handleWPMChange}
                                            max={1000}
                                        />
                                        <Form.Text>
                                            The value has to be between 100 and 700.
                                        </Form.Text>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Label htmlFor="font-size-input">Font size</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={fontSize}
                                            onChange={handleFontSizeChange}
                                            min={1}
                                            step={0.1}
                                        />
                                        <Form.Text>Fontsize in vw (viewport width).</Form.Text>
                                    </ListGroup.Item>
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
                                        <ListGroup>
                                            <ListGroup.Item variant={!usePivot ? "secondary" : ""}>
                                                <Form.Label>Pivot color</Form.Label>
                                                <Form.Control
                                                    disabled={!usePivot}
                                                    type="color"
                                                    defaultValue="#de0000"
                                                />
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                            <h5>Strobe settings</h5>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Form.Check
                                            type="checkbox"
                                            id="use-strobo"
                                            label="Activate strobo"
                                            checked={strobo}
                                            onChange={handleStroboChange}
                                        />
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Label>FlashFrames</Form.Label>
                                        <Form.Control type="number" disabled />
                                        <Form.Text>Amount of white frames.</Form.Text>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Label>Frames</Form.Label>
                                        <Form.Control type="number" disabled />
                                        <Form.Text>Amount of total frames.</Form.Text>
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
                    <Button variant="primary" onClick={() => setMenuOpen(false)}>
                        Start
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default App;

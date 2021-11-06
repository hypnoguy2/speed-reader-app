import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Container, Form, ListGroup, Modal, Nav, Navbar, Tab } from "react-bootstrap";

import { standardWrapper, pivot } from "./Helpers";
import { HowToPage } from "./HowToPage";
import { useScriptDisplay } from "./ScriptDisplay";
import { example } from "./Scripts";

const App = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [activeKey, setActiveKey] = useState("howTo");

    const [script, setScript] = useState(example);

    const [loops, setLoops] = useState(0);

    const [usePivot, setUsePivot] = useState(false);

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

    return (
        <Container className="h-100 w-100 p-0" fluid>
            <div style={{ fontSize: "10vw" }}>{isActive && element}</div>
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

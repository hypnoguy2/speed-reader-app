import { ChangeEvent, useEffect, useState } from "react";
import { Accordion, Button, Container, Form, ListGroup, Stack } from "react-bootstrap";
import { standardWrapper, pivot, processScript } from "./Helpers";

import { useScriptDisplay } from "./ScriptDisplay";
import ScriptEditor from "./ScriptEditor";
import { induction } from "./Scripts";
import MenuContainer from "./SettingsContainer";
import Strobe from "./Strobe";

// interface OptionManagerType {
//     [key: string]: (value: string | number) => void;
// }

const App = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [editorOpen, setEditorOpen] = useState(false);

    const [script, setScript] = useState(induction);
    const [splittedScript, setSplittetScript] = useState(processScript(script));
    // const [words, setWords] = useState(splittedScript.filter((w) => !w.startsWith("<")));

    const [fontSize, setFontSize] = useState("10");
    const [loops, setLoops] = useState("1");

    const [usePivot, setUsePivot] = useState(false);
    const [strobo, setStrobo] = useState(false);

    const {
        element,
        words,
        index,
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
    } = useScriptDisplay(script);

    const [startOptions, setStartOptions] = useState({
        wpm,
        loops,
        fontSize,
    });

    // Performance checker
    // const renderTime = useRef(0);
    // useEffect(() => {
    //     console.log("interval ", performance.now() - renderTime.current);

    //     renderTime.current = performance.now();
    // });

    // const optionsManager: OptionManagerType = useMemo(() => {
    //     return {
    //         wpm: setWPM,
    //         fontSize: setFontSize,
    //         pause: handlePause,
    //     } as OptionManagerType;
    // }, [setWPM, handlePause]);

    useEffect(() => {
        if (menuOpen) {
            setStartOptions({ wpm, loops, fontSize });
        }
    }, [menuOpen, wpm, loops, fontSize]);

    // --- effects for useScript implementation ---
    useEffect(() => {
        if (!menuOpen)
            setTimeout(() => {
                handleStart();
            }, 1000);
    }, [handleStart, menuOpen]);

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
    const handleScriptChange = (value: string) => {
        setScript(value);
        const splitted = processScript(value);
        setSplittetScript(splitted);
        // setWords(splitted.filter((w) => !w.startsWith("<")));
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
        if (ev.target.validity.valid) setLoops(ev.target.value);
    };

    const handlePivotChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setUsePivot(ev.target.checked);
        setPivotFunction(() => ev.target.checked ? pivot : standardWrapper);
    };

    const handleStroboChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setStrobo(ev.target.checked);
    };

    return (
        <Container className="h-100 w-100 p-0" fluid>
            {strobo && isRunning && <Strobe flashOptions={{ flashFrames: 2, loopFrames: 5 }} />}
            {isActive && element}
            <MenuContainer
                show={menuOpen}
                backdrop={false}
                placement="end"
                onHide={() => setMenuOpen(false)}>
                <Stack gap={3}>
                    <Stack gap={0}>
                        <Accordion className="mb-3">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Script</Accordion.Header>
                                <Accordion.Body className="p-0">
                                    <Form.Control
                                        as="textarea"
                                        readOnly
                                        style={{ height: 300 }}
                                        value={script}
                                    />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <Button onClick={() => setEditorOpen(true)}>Edit Script</Button>
                        <hr />
                    </Stack>
                    <Stack gap={0}>
                        <h6>Script settings</h6>
                        <ListGroup>
                            <ListGroup.Item>
                                <Form.Label>WPM (Words Per Second)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={wpm}
                                    onChange={handleWPMChange}
                                    max={1000}
                                />
                                <Form.Text>The value has to be between 100 and 700.</Form.Text>
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
                                    min={-1}
                                />
                                <Form.Text>
                                    0 loops means no words, 1-n means n loops, -1 means infinite
                                    loops.
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
                    </Stack>
                    <Stack gap={0}>
                        <h6>Strobe settings</h6>
                        <ListGroup>
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
                    </Stack>
                </Stack>
            </MenuContainer>
            <ScriptEditor
                show={editorOpen}
                script={script}
                onScriptChange={handleScriptChange}
                onHide={() => setEditorOpen(false)}></ScriptEditor>
        </Container>
    );
};

export default App;

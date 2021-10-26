import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Accordion, Button, Container, Form, ListGroup, Stack } from "react-bootstrap";

import { useScript } from "./ScriptDisplay";
import ScriptEditor from "./ScriptEditor";
import { loremIpsum } from "./Scripts";
import MenuContainer from "./SettingsContainer";

const App = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [editorOpen, setEditorOpen] = useState(false);
    const [fontSize, setFontSize] = useState("10");
    const [script, setScript] = useState(loremIpsum);
    const [splittedScript, setSplittetScript] = useState(loremIpsum.split(" "));
    const [words, setWords] = useState(splittedScript.filter((w) => !w.startsWith("<")));
    const [loops, setLoops] = useState(1);

    const {
        isRunning,
        isActive,
        index,
        wpm,
        handleWPMChange: onWpmChange,
        handleStart,
        handleResume,
        handlePause,
        handleReset,
    } = useScript();

    const renderTime = useRef(0);

    useEffect(() => {
        console.log("interval ", performance.now() - renderTime.current);

        renderTime.current = performance.now();
    });

    useEffect(() => {
        if (/<wpm=\d+>/i.test(splittedScript[index])) {
            const wpm = splittedScript[index].match(/\d+/g);
            if (wpm) onWpmChange(Number(wpm[0]));
            setSplittetScript(splittedScript.filter((w, i) => i !== index));
            console.log(wpm);
        }
    }, [index, splittedScript, onWpmChange, setSplittetScript]);

    useEffect(() => {
        if (index > 0 && index >= words.length) {
            handleReset();
            setLoops((l) => l - 1);
            setSplittetScript(script.split(" "))
        }
    }, [index, words, script, handleReset, setLoops, setSplittetScript]);

    useEffect(() => {
        if (menuOpen) {
            if (isRunning) handlePause();
        } else {
            if (isActive && !isRunning) handleResume();
            if (!isActive && loops !== 0) handleStart();
        }
    }, [menuOpen, loops, isRunning, isActive, handleStart, handleResume, handlePause]);

    useEffect(() => {
        const handleSDown = (ev: KeyboardEvent) => {
            if (ev.key === "s") setMenuOpen(true);
        };
        document.addEventListener("keydown", handleSDown);

        return () => document.removeEventListener("keydown", handleSDown);
    }, [setMenuOpen]);

    const handleScriptChange = (value: string) => {
        setScript(value);
        setSplittetScript(value.split(/\s+/gi));
        setWords(value.split(/\s+/gi).filter((w) => !w.startsWith("<")));
        handleReset();
    };

    const handleWPMChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) {
            onWpmChange(Number(ev.target.value));
        }
    };

    const handleFontSizeChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) setFontSize(ev.target.value);
    };

    const handleLoopsChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) setLoops(Number(ev.target.value));
    };

    return (
        <Container className="h-100 w-100 p-0" fluid>
            <div className="text-wrapper">
                <div className="text" style={{ fontSize: fontSize + "vw" }}>
                    {words[index]}
                </div>
            </div>
            <MenuContainer
                show={menuOpen}
                backdrop={false}
                placement="end"
                onHide={() => setMenuOpen(false)}>
                <Stack gap={3}>
                    <ListGroup variant="flush">
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
                                max={10}
                                value={loops}
                                min={-1}
                                onChange={handleLoopsChange}
                            />
                            <Form.Text>
                                0 loops means no words, 1-x means 1-x loops, -1 means infinite
                                loops.
                            </Form.Text>
                        </ListGroup.Item>
                    </ListGroup>
                    <hr />
                    <Accordion>
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

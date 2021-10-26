import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Accordion, Button, Container, Form, ListGroup, Stack } from "react-bootstrap";

import { useScript } from "./ScriptDisplay";
import ScriptEditor from "./ScriptEditor";
import { loremIpsum } from "./Scripts";
import MenuContainer from "./SettingsContainer";

const processScript = (s: string): string[] => {
    // removes whitespaces in options, then splits on whitespaces
    return splitString(s.replace(/<[^>]*>/gi, (match) => match.replace(/\s+/g, "")));
};

const splitString = (s: string): string[] => {
    return s.split(/\s+/g);
};

interface OptionManagerType {
    [key: string]: { changeFunction: (value: string | number) => void };
}

const App = () => {
    const [menuOpen, setMenuOpen] = useState(true);
    const [editorOpen, setEditorOpen] = useState(false);

    const [script, setScript] = useState(loremIpsum);
    const [splittedScript, setSplittetScript] = useState(processScript(script));
    const [words, setWords] = useState(splittedScript.filter((w) => !w.startsWith("<")));

    const [fontSize, setFontSize] = useState("10");
    const [loops, setLoops] = useState("1");

    // hook to run over index
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

    const [startOptions, setStartOptions] = useState({
        wpm,
        loops,
        fontSize,
    });

    // Performance checker
    const renderTime = useRef(0);

    const optionsManager: OptionManagerType = useMemo(() => {
        return {
            wpm: { changeFunction: onWpmChange },
            fontSize: { changeFunction: setFontSize },
        } as OptionManagerType;
    }, [onWpmChange]);

    useEffect(() => {
        // console.log("interval ", performance.now() - renderTime.current);

        renderTime.current = performance.now();
    });

    useEffect(() => {
        if (menuOpen) {
            setStartOptions({ wpm, loops, fontSize });
        }
    }, [menuOpen, wpm, loops, fontSize]);

    // effect to get options from tags
    useEffect(() => {
        if (splittedScript[index] && splittedScript[index].startsWith("<")) {
            for (const key in optionsManager) {
                const option = splittedScript[index].match(new RegExp(key + "=\\d+"));
                if (option) {
                    const newValue = option[0].match(/\d+/);
                    if (newValue) optionsManager[key].changeFunction(newValue[0]);
                }
            }

            setSplittetScript(splittedScript.filter((w, i) => i !== index));
        }
    }, [index, splittedScript, optionsManager, onWpmChange]);

    // Effect to loop script
    useEffect(() => {
        if (index > 0 && index >= words.length) {
            handleReset();
            setLoops((l) => Number(l) - 1 + "");
            setSplittetScript(processScript(script));
        }
    }, [index, words, script, handleReset]);

    // Effect to start and pause the script on menu toggle
    useEffect(() => {
        if (menuOpen) {
            if (isRunning) handlePause();
        } else {
            if (isActive && !isRunning) handleResume();
            if (!isActive && loops !== "0") handleStart();
        }
    }, [menuOpen, loops, isRunning, isActive, handleStart, handleResume, handlePause]);

    // Effect to open menu when pressing s
    useEffect(() => {
        const handleSDown = (ev: KeyboardEvent) => {
            if (ev.key === "s") {
                setFontSize(startOptions.fontSize);
                setMenuOpen(true);
            }
        };
        document.addEventListener("keydown", handleSDown);

        return () => document.removeEventListener("keydown", handleSDown);
    }, [startOptions]);

    // Option change handlers
    const handleScriptChange = (value: string) => {
        setScript(value);
        const splitted = processScript(value);
        setSplittetScript(splitted);
        setWords(splitted.filter((w) => !w.startsWith("<")));
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
        if (ev.target.validity.valid) setLoops(ev.target.value);
    };

    return (
        <Container className="h-100 w-100 p-0" fluid>
            <div className="text-wrapper">
                <div className="text" style={{ fontSize: fontSize + "vw" }}>
                    {isRunning && words[index]}
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
                                value={loops}
                                onChange={handleLoopsChange}
                                max={10}
                                min={-1}
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

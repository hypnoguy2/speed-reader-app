import { ChangeEvent, useState } from "react";
import {
    Form,
    OffcanvasProps,
    Offcanvas,
    Stack,
    Accordion,
    Button,
    ListGroup,
    Dropdown,
    InputGroup,
    ButtonGroup,
} from "react-bootstrap";
import ScriptEditor from "./ScriptEditor";

export interface Settings {
    fps: number;
    wpm: number;
    script: string;
    fontSize: string;

    onFpsChange: (value: number) => void;
    onWpmChange: (value: number) => void;
    onScriptChange: (value: string) => void;
    onFontSizeChange: (value: string) => void;
}

type fontSizeUnits = "vw" | "%" | "px";

const checkFontSize = (size: string): fontSizeUnits => {
    const end = size.slice(-2);
    console.log(end);
    return "vw";
};

const MenuContainer = (props: Settings & OffcanvasProps) => {
    const {
        fps,
        script,
        wpm,
        fontSize,
        onFpsChange,
        onWpmChange,
        onScriptChange,
        onFontSizeChange,
        ...other
    } = props;

    const [modalOpen, setModalOpen] = useState(false);

    const [fontSizeUnit, setFontSizeUnit] = useState<fontSizeUnits>(checkFontSize(fontSize));

    const handleWPMChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) {
            onWpmChange(Number(ev.target.value));
        }
    };

    return (
        <>
            <Offcanvas {...other}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
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
                                <InputGroup>
                                    <Form.Control
                                        aria-label="Text input with dropdown button"
                                        id="font-size-input"
                                        type="number"
                                    />
                                    <Dropdown
                                        as={ButtonGroup}
                                        onSelect={(v) => v && setFontSizeUnit(v as fontSizeUnits)}>
                                        <Dropdown.Toggle
                                            id="dropdown-custom-1"
                                            variant="outline-secondary">
                                            {fontSizeUnit}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            <Dropdown.Item eventKey="vw">vw</Dropdown.Item>
                                            <Dropdown.Item eventKey="%">%</Dropdown.Item>
                                            <Dropdown.Item eventKey="px">px</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </InputGroup>
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
                        <Button onClick={() => setModalOpen(true)}>Edit Script</Button>
                    </Stack>
                </Offcanvas.Body>
            </Offcanvas>
            <ScriptEditor
                show={modalOpen}
                script={script}
                onScriptChange={(newScript) => onScriptChange(newScript)}
                onHide={() => setModalOpen(false)}></ScriptEditor>
        </>
    );
};

export default MenuContainer;

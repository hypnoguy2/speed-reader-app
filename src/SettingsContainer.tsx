import { ChangeEvent } from "react";
import { Form, OffcanvasProps, Offcanvas, Stack, Accordion } from "react-bootstrap";

export interface Settings {
    fps: number;
    wpm: number;
    script: string;
    strobo: boolean;

    onStroboChange?: (value: boolean) => void;
    onFpsChange: (value: number) => void;
    onWpmChange: (value: number) => void;
    onScriptChange: (value: string) => void;
}

const MenuContainer = (props: Settings & OffcanvasProps) => {
    const {
        fps,
        script,
        wpm,
        strobo,
        onStroboChange,
        onFpsChange,
        onWpmChange,
        onScriptChange,
        ...other
    } = props;

    const handleFPSChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) {
            onFpsChange(Number(ev.target.value));
        }
    };
    const handleWPMChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) {
            onWpmChange(Number(ev.target.value));
        }
    };

    const handleScriptChange = (ev: ChangeEvent<HTMLInputElement>) => {
        onScriptChange(ev.target.value);
    };

    const handleStroboChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (onStroboChange) onStroboChange(ev.target.checked);
    };

    return (
        <Offcanvas {...other}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={0}>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Settings</Accordion.Header>
                            <Accordion.Body>
                                <Stack>
                                    <Form.Group>
                                        <Form.Check
                                            type="checkbox"
                                            label="Activate Strobo"
                                            onChange={handleStroboChange}
                                        />
                                        <Form.Label>FPS (Flashes Per Second)</Form.Label>
                                        <Form.Control
                                            disabled={!strobo}
                                            type="number"
                                            step=".1"
                                            value={fps}
                                            onChange={handleFPSChange}
                                            max={20}
                                            min={0}
                                        />
                                        <Form.Text>
                                            Insert a framefrate between 0.0 and 20.0, when set to
                                            zero no flashing will occur.
                                        </Form.Text>
                                    </Form.Group>
                                    <hr />
                                </Stack>
                                <Form.Group>
                                    <Form.Label>WPM (Words Per Second)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={wpm}
                                        onChange={handleWPMChange}
                                        max={600}
                                    />
                                    <Form.Text>How many words per minute will be shown.</Form.Text>
                                    <hr />
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <hr />
                    <Form.Group>
                        <h5>Script</h5>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            onChange={handleScriptChange}
                            value={script}
                        />
                        <Form.Text>Write your script here.</Form.Text>
                    </Form.Group>
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default MenuContainer;

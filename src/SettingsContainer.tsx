import { ChangeEvent } from "react";
import { Form, Button, OffcanvasProps, Offcanvas, Stack } from "react-bootstrap";

export interface Settings {
    fps: number;
    wpm: number;
    script: string;

    onStopStrobo?: () => void;
    onStartStrobo?: () => void;
    onFpsChange: (value: number) => void;
    onWpmChange: (value: number) => void;
    onScriptChange: (value: string) => void;
}

const SettingsContainer = (props: Settings & OffcanvasProps) => {
    const {
        fps,
        script,
        wpm,
        onStartStrobo,
        onStopStrobo,
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

    return (
        <Offcanvas {...other}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    <Stack gap={2}>
                        <Form.Group>
                            <Form.Label>FPS (Flashes Per Second)</Form.Label>
                            <Form.Control
                                type="number"
                                step=".1"
                                value={fps}
                                onChange={handleFPSChange}
                                max={20}
                                min={0}
                            />
                            <Form.Text>
                                Insert a framefrate between 0.0 and 20.0, when set to zero no
                                flashing will occur.
                            </Form.Text>
                        </Form.Group>
                        <Stack direction="horizontal">
                            <Button variant="danger" onClick={onStopStrobo}>
                                Stop Strobo
                            </Button>
                            <Button className="ms-auto" variant="primary" onClick={onStartStrobo}>
                                Start Strobo
                            </Button>
                        </Stack>
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
                    <Form.Group>
                        <Form.Label>Script</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
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

export default SettingsContainer;

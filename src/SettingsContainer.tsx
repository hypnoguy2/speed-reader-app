import { ChangeEvent } from "react";
import { Form, Button, OffcanvasProps, Offcanvas, Stack } from "react-bootstrap";

export interface SettingsProps extends OffcanvasProps {
    fps: number;
    // colors: string[];

    onStopStrobo?: () => void;
    onStartStrobo?: () => void;
    onFpsChange: (value: number) => void;
    // onColorChange: (value: string[]) => void;
}

const SettingsContainer = (props: SettingsProps) => {
    const { fps, colors, onStartStrobo, onStopStrobo, onFpsChange, onColorChange, ...other } =
        props;

    const handleFPSChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) props.onFpsChange(Number(ev.target.value));
    };

    return (
        <Offcanvas {...other}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
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
                            Insert a framefrate between 0.0 and 20.0, when set to zero no flashing
                            will occur.
                        </Form.Text>
                    </Form.Group>
                    {/* <ToggleButtonGroup
                        className="d-flex"
                        type="checkbox"
                        value={colors}
                        onChange={onColorChange}>
                        {["black", "white", "red", "green", "blue"].map((color) => (
                            <ToggleButton
                                key={color}
                                id={`toggle-${color}`}
                                className="text-uppercase"
                                value={color}
                                variant={"outline-dark"}
                                checked={colors.indexOf(color) >= 0}>
                                {color}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup> */}
                    <Stack direction="horizontal">
                        <Button variant="danger" onClick={onStopStrobo}>
                            Stop Strobo
                        </Button>
                        <Button className="ms-auto" variant="primary" onClick={onStartStrobo}>
                            Start Strobo
                        </Button>
                    </Stack>
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SettingsContainer;

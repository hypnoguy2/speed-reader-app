import { ChangeEvent, useEffect, useState } from "react";
import {
    Form,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    OffcanvasProps,
    Offcanvas,
    Col,
    Row,
    Container,
} from "react-bootstrap";

export interface SettingsProps extends OffcanvasProps {
    fps: string;
    colors: string[];

    onStopStrobo?: () => void;
    onStartStrobo?: () => void;
    onFpsChange: (value: string) => void;
    onColorChange: (value: string[]) => void;
}

const SettingsContainer = (props: SettingsProps) => {
    const { fps, colors, onStartStrobo, onStopStrobo, onFpsChange, onColorChange, ...other } =
        props;

    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    const handleFPSChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) props.onFpsChange(ev.target.value);
    };

    useEffect(() => {
        const handleSDown = (ev: KeyboardEvent) => {
            if (ev.key === "s") setShow(true);
        };
        document.addEventListener("keydown", handleSDown);

        return () => document.removeEventListener("keydown", handleSDown);
    });

    return (
        <Offcanvas show={show} onHide={handleClose} {...other}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form as={Container} className="p-0">
                    <Form.Group className="mb-3">
                        <Form.Label>FPS</Form.Label>
                        <Form.Control
                            type="number"
                            value={fps}
                            onChange={handleFPSChange}
                            max={120}
                            min={1}
                        />
                    </Form.Group>
                    <ToggleButtonGroup
                        className="mb-3 d-flex"
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
                    </ToggleButtonGroup>
                </Form>
                <Row>
                    <Col>
                        <Button variant="danger" onClick={onStopStrobo}>
                            Stop Strobo
                        </Button>
                    </Col>
                    <Col>
                        <Button className="float-end" variant="primary" onClick={onStartStrobo}>
                            Start Strobo
                        </Button>
                    </Col>
                </Row>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SettingsContainer;

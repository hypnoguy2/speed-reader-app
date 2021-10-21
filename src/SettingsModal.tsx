import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Form, Modal, ModalProps, Button, ButtonGroup } from "react-bootstrap";

export interface SettingsProps extends ModalProps {
    fps: string;
    colors: string[];

    onStopStrobo?: () => void;
    onStartStrobo?: () => void;
    onFpsChange: (value: string) => void;
}

const SettingsModal = (props: SettingsProps) => {
    const { fps, colors, onStartStrobo, onStopStrobo, onFpsChange, ...other } = props;

    const inputColors = useRef<HTMLInputElement>(null);
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
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            centered
            animation={false}
            {...other}>
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form as="div">
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
                    <ButtonGroup>
                        {["black", "white", "red", "green", "blue"].map((color) => {
                            let variant = "primary";
                            switch (color) {
                                case "black":
                                    variant = "dark";
                                    break;
                                case "white":
                                    variant = "outline-dark";
                                    break;
                                case "red":
                                    variant = "danger";
                                    break;
                                case "green":
                                    variant = "success";
                                    break;
                            }
                            return <Button variant={variant}>{color}</Button>;
                        })}
                    </ButtonGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onStopStrobo}>
                    Stop Strobo
                </Button>
                <Button className="ms-auto" variant="primary" onClick={onStartStrobo}>
                    Start Strobo
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;

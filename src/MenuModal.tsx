import { ChangeEvent, useEffect, useState } from "react";
import {
    Button,
    Card,
    Container,
    Form,
    ListGroup,
    Modal,
    ModalProps,
    Nav,
    Navbar,
    Tab,
} from "react-bootstrap";
import { pivotOne, standardWrapper } from "./Helpers";
import { HowToPage } from "./HowToPage";
import { useContextScript } from "./ScriptContext";
import { example } from "./Scripts";

export interface MenuModalProps extends ModalProps {
    onFileChange?: (file: File | null) => void;
    onCoverChange?: (val: boolean) => void;
}

export const MenuModal = (props: MenuModalProps) => {
    const [activeKey, setActiveKey] = useState("howTo");
    const hook = useContextScript();
    const { setLoops: setScriptLoops } = hook;
    const [script, setScript] = useState(example);
    const [loops, setLoops] = useState(0);
    const [pivot, setPivot] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [coverBG, setCoverBG] = useState(false);

    const handleScriptChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setScript(ev.target.value);
    };

    const handleNavSelect = (eventKey: string | null, e: React.SyntheticEvent<unknown>) => {
        if (eventKey !== null) setActiveKey(eventKey);
    };

    const handleApplyScript = () => {
        hook.setScript(script);
    };

    const handleLoopsChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.validity.valid) setLoops(Number(ev.target.value));
    };

    const handleStartScript = () => {
        props.onHide();

        if (!hook.isActive) {
            if (hook.index !== 0) hook.resetScript();
            hook.handleStart();
        } else hook.handleResume();
    };

    const handlePivotChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setPivot(ev.target.checked);
        hook.setPivotFunction(() => (ev.target.checked ? pivotOne : standardWrapper));
    };

    const handleFileChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files && props.onFileChange) {
            setFile(ev.target.files[0]);
            props.onFileChange(ev.target.files[0]);
        }
    };

    const handleCoverChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setCoverBG(ev.target.checked);
        if (props.onCoverChange) props.onCoverChange(ev.target.checked);
    };

    useEffect(() => {
        setScriptLoops(loops);
    }, [loops, setScriptLoops]);

    return (
        <Modal
            show={props.show}
            backdrop={false}
            fullscreen="lg-down"
            size="lg"
            scrollable
            centered
            dialogClassName="align-items-stretch">
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
                    <button className="btn-close" onClick={() => props.onHide()}></button>
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
                                        checked={pivot}
                                        onChange={handlePivotChange}
                                    />
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <Card className="mb-4 border-0">
                            <ListGroup>
                                <ListGroup.Item>
                                    <Form.Group className="mb-3" controlId="formFile">
                                        <Form.Label>Set background file</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Form.Group>
                                    {file && (
                                        <img
                                            className="previewImg"
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                        />
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Form.Check
                                        type="checkbox"
                                        id="scale-img"
                                        label="Scale image to full background"
                                        checked={coverBG}
                                        disabled={!file}
                                        onChange={handleCoverChange}
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
                    variant={hook.script === script ? "secondary" : "success"}
                    onClick={handleApplyScript}>
                    {hook.script === script ? "Script processed" : "Process Script"}
                </Button>
                <Button variant="primary" onClick={handleStartScript}>
                    {hook.isActive ? "Resume" : "Start"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

import { ChangeEvent, useState } from "react";
import { Button, Form, Modal, ModalProps, Stack } from "react-bootstrap";

export interface ScriptEditorProps extends ModalProps {
    script: string;
    onScriptChange: (value: string) => void;
}

const ScriptEditor = (props: ScriptEditorProps) => {
    const { script, onScriptChange, ...others } = props;

    const [modalScript, setModalScript] = useState(script);

    const handleScriptChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setModalScript(ev.target.value);
    };

    const onSave = () => {
        onScriptChange(modalScript);
        others.onHide();
    };

    return (
        <Modal
            backdrop="static"
            centered
            fullscreen="md-down"
            size="lg"
            animation={true}
            dialogClassName="align-items-stretch"
            {...others}>
            <Modal.Header closeButton>
                <Modal.Title>Script Editor</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Stack gap={3}>
                    <Form.Control
                        as="textarea"
                        value={modalScript}
                        style={{ height: 500 }}
                        autoFocus
                        onChange={handleScriptChange}
                    />
                    <div>Explanation of the options :D</div>
                </Stack>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={others.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => onSave()}>
                    Save changes & Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ScriptEditor;

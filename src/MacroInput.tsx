import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { InputGroup, Form, Row, Col, Button } from "react-bootstrap";

import { useContextScript } from "./ScriptContext";
import { Macro } from "./hooks";

export interface MacroInputProps {
    macro: Macro;
    onChange: (macro: Macro) => void;
    onRemove: (id: string) => void;
}

export const MacroInput = (props: MacroInputProps) => {
    const { options } = useContextScript();

    const {
        macro: { id },
        onChange,
    } = props;

    const [regex, setRegex] = useState(props.macro.regex);
    const [option, setOption] = useState(props.macro.option);
    const [value, setValue] = useState(props.macro.value);

    const handleRegexChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setRegex(ev.target.value);
    };

    const handleOptionChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        setOption(ev.target.value);
    };

    const handleValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
    };

    const changeFunc = useMemo(() => debounce((value: Macro) => onChange(value), 500), [onChange]);

    useEffect(() => {
        changeFunc({ id, regex, option, value } as Macro);
    }, [regex, option, value, changeFunc, id]);

    return (
        <Row className="gx-1 align-items-end">
            <Col xs={12} sm>
                <Form.Group>
                    <Form.Label className="mb-0">Replace</Form.Label>
                    <Form.Control
                        value={regex}
                        aria-label="macro-value"
                        onChange={handleRegexChange}
                    />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group>
                    <Form.Label className="mb-0">with</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>{"<"}</InputGroup.Text>
                        <Form.Select
                            value={option}
                            aria-label="option"
                            onChange={handleOptionChange}>
                            {options.map((key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </Form.Select>
                        <InputGroup.Text>=</InputGroup.Text>
                        <Form.Control
                            value={value}
                            aria-label="value"
                            onChange={handleValueChange}
                        />
                        <InputGroup.Text>{">"}</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
            </Col>
            <Col xs={1} className="w-auto">
                <Button variant="danger" onClick={() => props.onRemove(props.macro.id)}>
                    <i className="bi-trash"></i>
                </Button>
            </Col>
        </Row>
    );
};

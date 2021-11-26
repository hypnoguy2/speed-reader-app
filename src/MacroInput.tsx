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

const validateRegex = (string: string): boolean => {
    if (string === "") return false;
    try {
        new RegExp(string);
        return true;
    } catch (error) {
        return false;
    }
};

export const MacroInput = (props: MacroInputProps) => {
    const { options } = useContextScript();

    const {
        macro: { id, regex },
        onChange,
    } = props;

    const [isValid, setIsValid] = useState(!!regex);
    const [checked, setChecked] = useState(typeof regex !== "string");
    const [regexp, setRegexp] = useState<string>(
        typeof regex !== "string"
            ? regex.toString().substring(1, regex.toString().length - 2)
            : regex
    );
    const [option, setOption] = useState(props.macro.option);
    const [value, setValue] = useState(props.macro.value);

    const handleRegexpChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setRegexp(ev.target.value);
    };

    const handleOptionChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        setOption(ev.target.value);
    };

    const handleValueChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
    };

    const handleCheckboxChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setChecked(ev.target.checked);
    };

    const changeFunc = useMemo(() => debounce((value: Macro) => onChange(value), 500), [onChange]);

    useEffect(() => {
        const val = validateRegex(regexp.toString());
        setIsValid(val);
        changeFunc({
            id,
            regex: checked && val ? new RegExp(regexp, "g") : regexp,
            option,
            value,
        } as Macro);
    }, [regexp, option, value, changeFunc, id, checked]);

    return (
        <Row className="gx-1 align-items-end">
            <Col xs={12} sm>
                <Form.Group>
                    <Form.Label className="mb-0">Replace</Form.Label>
                    <InputGroup>
                        <InputGroup.Checkbox onChange={handleCheckboxChange} checked={checked} />
                        {checked && <InputGroup.Text>/</InputGroup.Text>}
                        <Form.Control
                            isInvalid={!isValid}
                            value={regexp.toString()}
                            aria-label="macro-value"
                            onChange={handleRegexpChange}
                        />
                        {checked && <InputGroup.Text>/g</InputGroup.Text>}
                    </InputGroup>
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

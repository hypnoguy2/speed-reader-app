import { OffcanvasProps, Offcanvas } from "react-bootstrap";

const MenuContainer = (props: OffcanvasProps) => {
    return (
        <Offcanvas {...props}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{props.children}</Offcanvas.Body>
        </Offcanvas>
    );
};

export default MenuContainer;

import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Image, { propTypes } from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";

const Recipes = React.forwardRef(({ recipe }, ref) => {
  return (
    <>
      <Container
        className="box"
        ref={ref}
        style={{
          marginTop: "15px",
          marginBottom: "15px",
          height: "60vh"
        }}
      >
        <Row>
          <Col xs={12}>
            <h1>{recipe.title}</h1>
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Image
              className="image"
              src={`http://localhost:5001/uploads/${recipe.image}`}
            />
          </Col>

        </Row>
      </Container>
    </>
  );
});

export { Recipes };

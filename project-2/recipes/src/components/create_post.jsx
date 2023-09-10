import * as React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";

const CreatePost = () => {
  const [values, setValues] = React.useState({
    title: "",
    ingredients: [],
    instructions: "",
    steps: "",
  });

  const handleTitleChange = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValues((prev) => {
      return {
        ...prev,
        title: event.target.value,
      };
    });
  };
  const handleIngredients = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValues((prev) => {
      return {
        ...prev,
        ingredients: event.target.value,
      };
    });
  };
  return (
    <>
      <Form className="create-form">
        <Row style={{ marginLeft: '10vw', marginRight: '10vw'}}>
        <Col
            xs={12}
            className="mb-3"
            style={{
              paddingLeft: '4vw',
              paddingRight: '4vw',
              paddingTop: '4vh',
              paddingBottom: '4vh',
            }}
          >
          <Form.Group as={Col} md="12" controlId="validationCustomUsername">
            <Form.Label>Title</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Title"
                aria-describedby="inputGroupPrepend"
                value={values.title}
                required
                onChange={handleTitleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please choose a Title.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          </Col>
        </Row>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername">
            <Form.Label>Ingredients</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Ingredients"
                aria-describedby="inputGroupPrepend"
                value={values.ingredients}
                required
                onChange={handleTitleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please choose a Title.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
      </Form>
    </>
  );
};
export { CreatePost };

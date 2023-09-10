import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ImageUploader, {
  FileObjectType as FileUploaderProps,
} from "react-image-upload";
import { axios } from "../providers/AuthProviders";
import "react-image-upload/dist/index.css";

function RecipeForm() {
  const [recipeFormState, setRecipeFormState] = React.useState({
    title: "",
    image: [],
    ingredients: [],
    steps: [],
  });

  const [recipeFormSubmissionErrors, setRecipeFormSubmissionErrors] =
    React.useState({});
  const [validated, setValidated] = React.useState(false);

  const imageUpload = (imageFile) => {
    setRecipeFormState((prevState) => ({
      ...prevState,
      image: imageFile.file,
    }));
  };

  const removeImage = (file) => {
    setRecipeFormState((prevState) => ({
      ...prevState,
      image: null,
    }));
  };

  const handleTitleChange = (event) => {
    setRecipeFormState((prevState) => ({
      ...prevState,
      title: event.target.value,
    }));
  };

  const handleIngredientsChange = (event) => {
    if (event.target.value !== "") {
      const ingredientsSplit = event.target.value.split("\n");
      setRecipeFormState((prevState) => ({
        ...prevState,
        ingredients: ingredientsSplit,
      }));
    } else {
      setRecipeFormState((prevState) => ({
        ...prevState,
        ingredients: [],
      }));
    }
  };

  const handleStepsChange = (event) => {
    if (event.target.value !== "") {
      const stepsSplit = event.target.value.split("\n");
      setRecipeFormState((prevState) => ({
        ...prevState,
        steps: stepsSplit,
      }));
    } else {
      setRecipeFormState((prevState) => ({
        ...prevState,
        steps: [],
      }));
    }
  };

  const createNewRecipeData = async (payload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("image", payload.image);
    formData.append("steps", payload.steps.join("\n"));
    formData.append("ingredients", payload.ingredients.join("\n"));
    console.log(`Sending ${JSON.stringify(formData)}`);

    const { data: response } = await axios.post("/api/v1/recipes", formData);
    return response.data;
  };

  const { mutateAsync } = useMutation(createNewRecipeData, {
    onSucess: () => {
      console.log("Successfully submitted recipe.");
    },
    onError: () => {
      console.log("Failed to submit recipe.");
    },
  });

  const handleClick = (e) => {
    e.preventDefault();
    if (validator(recipeFormState)) {
      setValidated(true);
      mutateAsync(recipeFormState);
    } else {
      // else, setValidated to be false
      setValidated(false);
    }

    // mutation()
  };

  const validator = () => {
    const errors = {};

    if (!recipeFormState.title || recipeFormState.title === "") {
      errors.title = "Title is required";
    }
    if (recipeFormState.image === null) {
      errors.image = "Image is required";
    }

    if (
      !recipeFormState.ingredients ||
      recipeFormState.ingredients.length === 0
    ) {
      errors.ingredients = "ingredients is required";
    }
    if (!recipeFormState.steps || recipeFormState.steps.length === 0) {
      errors.steps = "steps is required";
    }
    setRecipeFormSubmissionErrors(errors);
    if (Object.keys(errors).length === 0) {
      return true;
    }
    return false;
  };

  React.useState(() => {
    console.log(JSON.stringify(recipeFormState));
  }, [recipeFormState]);

  return (
    <>
      <Form
        validated={validated}
        onSubmit={handleClick}
        className="form-container"
      >
        {console.log(JSON.stringify(recipeFormState))}
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
          <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Recipe Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Give it a name for your recipe."
            value={recipeFormState.title}
            onChange={handleTitleChange}
          />
          </Form.Group>
        </Col>
        </Row>
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
        <Form.Group  controlId="exampleForm.ControlTextarea1">
          <Form.Label>Image</Form.Label>

          <ImageUploader
            onFileAdded={(img) => imageUpload(img)}
            onFileRemoved={(img) => removeImage(img)}
          />
        </Form.Group>
        </Col>
        </Row>
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
        <Form.Group  controlId="exampleForm.ControlTextarea1">
          <Form.Label>Ingredients</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="What are the ingredients?"
            value={recipeFormState.ingredients.join("\n")}
            onChange={handleIngredientsChange}
          />
        </Form.Group>
        </Col></Row>
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
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Steps</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="What are the steps?"
            value={recipeFormState.steps.join("\n")}
            onChange={handleStepsChange}
          />
        </Form.Group>
        </Col>
        </Row>
        <div style={{ display: 'flex', gap: '5px' }}>
        <Button style={{ width: '20%' }}  className="submit-button" type="submit">
          Submit recipe
        </Button>
        </div>
      </Form>
      {Object.entries(recipeFormSubmissionErrors).map(([key, value]) => (
        // Pretty straightforward - use key for the key and value for the value.
        // Just to clarify: unlike object destructuring, the parameter names don't matter here.
        <div>
          {key}:{value}
        </div>
      ))}
    </>
  );
}

export { RecipeForm };

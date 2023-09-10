import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { AuthContext, axios } from '../providers/AuthProviders';

const checkJwt = async () => {
  const data = await axios.get('/api/v1/test');
  console.log(JSON.stringify(data));
  return data;
};

function Login() {
  const [validated, setValidated] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { login, isError } = React.useContext(AuthContext);
  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const validator = () => {
    const errors = {};

    if (!values.username || values.username === '') {
      errors.username = 'username is required';
    }

    if (!values.password || values.password === '') {
      errors.password = 'password is required';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      return true;
    }
    return false;
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    // if validator has a value - username, pin, setValulidated to be true
    if (validator(values)) {
      setValidated(true);
    } else {
      // else, setValidated to be false
      setValidated(false);
    }
    // begin to mutate values:
    console.log(`Sending values ${JSON.stringify(values)} to login`);
    login(values);
  };

  const handleUsernameChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      username: event.target.value,
    }));
  };

  const handlePasswordChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      password: event.target.value,
    }));
  };

  const handleClick = () => {
    refetch();
  };

  const {
    data: testJwt,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['testQuery'],
    queryFn: checkJwt,
    refetchOnWindowFocus: false,
    enabled: false,
  });
  React.useEffect(() => {
    console.log(`Got test jwt ${testJwt}`);
  }, [testJwt]);
  return (
    <Form
      className="login-form-row"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <div className="use-pin-row-style">
        <Row style={{ marginLeft: '10vw', marginRight: '10vw'}}>
          {console.log(values)}
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
            <Form.Group
              as={Col}
              md="12"
              controlId="validationCustomUsername"
            >
              <Form.Label>Username</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  value={values.username}
                  required
                  onChange={handleUsernameChange}
                />
              </InputGroup>
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

            <Form.Group controlId="validationCustom03">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Password"
                required
                value={values.password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <Button style={{ width: '20%' }} type="submit">Submit form</Button>
        {isError === '' ? null : (
          <div>
            <h1>{isError}</h1>
          </div>
        )}
        <br />
        {
            /* <Button
          onClick={handleClick}
        >
          check
        </Button> */
          }

      </div>
    </Form>
  );
}

export { Login };

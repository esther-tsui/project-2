import * as React from 'react';
import './App.css';
import Container from 'react-bootstrap/esm/Container';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Recipes } from './components/recipes';

function App() {
  const { ref, inView } = useInView();
  const page = 0;
  const limit = 3;
  const fetchBackend = async ({ pageParam = 0 }) => {
    const response = await fetch(
      `http://localhost:5001/api/v1/recipes?_offset=${pageParam}&_limit=${limit}`,
    );
    return response.json();
  };
  const {
    status,
    data,
    isFetching,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['recipes'],
    queryFn: fetchBackend,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.recipes.length > 0 ? lastPage.offset + limit : undefined;
      return nextPage;
    },
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const [showPopup, setShowPopup] = React.useState(false);
  const [selectedRecipe, setSelectedRecipe] = React.useState({});

  return (
    <div className="App">
      <Container>
        {isSuccess
          && data.pages.map((page) => page.recipes.map((x) => (
            <div
              onClick={() => {
                setShowPopup(true);
                setSelectedRecipe(x);
              }}
            >
              <Recipes ref={ref} recipe={x} />
            </div>
          )))}
      </Container>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>

      {showPopup && selectedRecipe && (
        <Modal show={showPopup} onHide={() => setShowPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {selectedRecipe.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 style={{ textAlign: 'center' }}>Ingredients</h4>

            <ul>
              {selectedRecipe.ingredients.map((x) => (
                <li>{x}</li>
              ))}
            </ul>

            <hr />

            <h4 style={{ textAlign: 'center' }}>Steps</h4>
            <ol>
              {selectedRecipe.steps.map((x) => (
                <li>{x}</li>
              ))}
            </ol>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                console.log('Called onclick');
                setShowPopup(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default App;

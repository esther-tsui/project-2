import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from '@tanstack/react-router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import App from './App';
import { Login } from './components/login';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './providers/AuthProviders';
import { RecipeForm } from './components/RecipeForm';
import { CreatePost } from './components/create_post';


function Root() {
  return (
    <>
      <div>
        <Navbar bg="light" data-bs-theme="light">
          <Container>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/create">Create</Nav.Link>
              <Nav.Link href="/recipeForm">Create recipe form</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>
      <hr />
      <Outlet />
    </>
  );
}

const rootRoute = new RootRoute({
  component: Root,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

const login = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const createPost = new Route({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreatePost,
});

const recipeForm = new Route({
  getParentRoute: () => rootRoute,
  path: '/recipeForm',
  component: RecipeForm,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  login,
  createPost,
  recipeForm,
]);
const router = new Router({ routeTree });

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

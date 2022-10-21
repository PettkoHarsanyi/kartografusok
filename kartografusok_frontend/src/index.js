import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login';
import Registration from './components/Registration';
import Leaderboard from './components/Leaderboard';
import Rules from './components/Rules';
import Admin from './components/Admin/Admin';
import authHeader from './auth/auth-header';
import Profil from './components/Profil';
import ConnectRoom from './components/ConnectRoom/ConnectRoom';
import CreateRoom from './components/CreateRoom/CreateRoom';
import authService from './auth/auth.service';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { LoggedRoute } from './components/Auth/LoggedRoute';
import { Provider } from 'react-redux';
import store from './state/store';
import { BannedRoute } from './components/Auth/BannedRoute';
// import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "bejelentkezes",
    element: <LoggedRoute><Login /></LoggedRoute>,
  },
  {
    path: "letrehozas",
    element: <BannedRoute><CreateRoom /></BannedRoute>,
    loader: async ({ params }) => {
      return Promise.all([
        fetch('api/cards/explore', {
          headers: authHeader()
        }).then(resp => resp.json()),
        fetch('api/cards/raid', {
          headers: authHeader()
        }).then(resp => resp.json()),
      ])
    }
  },
  {
    path: "csatlakozas",
    element: <BannedRoute><ConnectRoom /></BannedRoute>,
  },
  {
    path: "profil",
    element: <Profil />,
    loader: async ({ params }) => {
      let user = authService.getCurrentUser();
      if (user) {
        return fetch(`api/users/${user.id}/games`, {
          headers: authHeader()
        });
      }
      return null;
    }
  },
  {
    path: "regisztracio",
    element: <LoggedRoute><Registration /></LoggedRoute>,
  },
  {
    path: "rangletra",
    element: <Leaderboard />,
    loader: async ({ params }) => {
      return Promise.all([
        fetch(`/api/users/alltime`, {
          headers: authHeader()
        }).then(resp => resp.json()),
        fetch('/api/users/weekly', {
          headers: authHeader()
        }).then(resp => resp.json())
      ]);
    },
  },
  {
    path: "szabalyzat",
    element: <Rules />,
  },
  {
    path: "adminisztracio",
    element:
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>,
    loader: async ({ params }) => {
      return Promise.all([
        fetch('api/users', {
          headers: authHeader()
        }).then(resp => resp.json()),
        fetch('api/divisions',{
          headers: authHeader()
        }).then(resp => resp.json()),
        fetch('api/cards/explore', {
          headers: authHeader()
        }).then(resp => resp.json()),
        fetch('api/cards/raid', {
          headers: authHeader()
        }).then(resp => resp.json()),
        fetch('api/maps', { 
          headers: authHeader()
        }).then(resp => resp.json()),
      ])
    }
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

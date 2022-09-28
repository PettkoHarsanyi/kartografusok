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
import Admin from './components/Admin';
import authHeader from './auth/auth-header';
// import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "bejelentkezes",
    element: <Login />, 
  },
  {
    path: "regisztracio",
    element: <Registration />, 
  },
  {
    path: "rangletra",
    element: <Leaderboard />,
    loader: async ({ params })=>{
      return Promise.all([
        fetch(`/api/users/alltime`,{
          headers: authHeader()
          
        }).then(resp => resp.json()),
        fetch('/api/users/weekly',{
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
    element: <Admin />, 
    loader: async ({ params })=>{
      return fetch('api/users',{
        headers: authHeader()
      });
    }
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

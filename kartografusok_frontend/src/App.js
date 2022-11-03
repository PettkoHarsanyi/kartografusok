import './App.css';
import { Outlet } from "react-router-dom";
import { useEffect } from 'react';

export default function App() {
  return (
    <>
      <Outlet />
    </>
  );
}
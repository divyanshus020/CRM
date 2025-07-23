import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./componet/landingPage/HomePage.jsx";
import UserRegister from "./componet/AuthPage/UserRegister.jsx";
import Login from "./componet/AuthPage/UserLogin.jsx";
// import Login from "./componet/Login";
// import Register from "./componet/Register";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <UserRegister />,
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
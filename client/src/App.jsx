import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./componet/landingPage/HomePage.jsx";
import UserRegister from "./componet/AuthPage/UserRegister.jsx";
import Login from "./componet/AuthPage/UserLogin.jsx";
import Dashboard from "./componet/Dashboard/Dashboard.jsx";
import ViewChallan from "./componet/Dashboard/ViewChallan.jsx";
import NewChallan from "./componet/Dashboard/NewChallan.jsx"
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
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/view/:challanId",
    element: <ViewChallan />
  },
  {
    path: "/new-challan",
    element: <NewChallan />
  }
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
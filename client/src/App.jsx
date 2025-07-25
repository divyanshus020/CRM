import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./componet/landingPage/HomePage.jsx";
import UserRegister from "./componet/AuthPage/UserRegister.jsx";
import Login from "./componet/AuthPage/UserLogin.jsx";
import Dashboard from "./componet/Dashboard/Dashboard.jsx";
import ViewChallan from "./componet/Dashboard/ViewChallan.jsx";
import NewChallan from "./componet/Dashboard/NewChallan.jsx"
import CustomerRegistrationForm from "./componet/Dashboard/CoustmerRegistaion.jsx";
import Layout from "./componet/Layout/Layout.jsx";
import AllCustomers from "./componet/Dashboard/AllCoustmers.jsx";
import AllChallans from "./componet/Dashboard/AllChallans.jsx";

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
    element: <Layout><Dashboard /></Layout>
  },
  {
    path: "/view/:challanId",
    element: <Layout><ViewChallan /></Layout>
  },
  {
    path: "/new-challan",
    element: <Layout><NewChallan /></Layout>
  },
  {
    path: "/new-customer",
    element: <Layout><CustomerRegistrationForm /></Layout>
  },
  {
    path: "/all-customers",
    element: <Layout><AllCustomers /></Layout>
  },
  {
    path: "/all-challan",
    element: <Layout><AllChallans /></Layout>
  }
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
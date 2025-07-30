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
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthRedirect from "./components/AuthRedirect.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <AuthRedirect><Login /></AuthRedirect>,
  },
  {
    path: "/register",
    element: <AuthRedirect><UserRegister /></AuthRedirect>,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
  },
  {
    path: "/view/:challanId",
    element: <ProtectedRoute><Layout><ViewChallan /></Layout></ProtectedRoute>
  },
  {
    path: "/new-challan",
    element: <ProtectedRoute><Layout><NewChallan /></Layout></ProtectedRoute>
  },
  {
    path: "/new-customer",
    element: <ProtectedRoute><Layout><CustomerRegistrationForm /></Layout></ProtectedRoute>
  },
  {
    path: "/all-customers",
    element: <ProtectedRoute><Layout><AllCustomers /></Layout></ProtectedRoute>
  },
  {
    path: "/all-challan",
    element: <ProtectedRoute><Layout><AllChallans /></Layout></ProtectedRoute>
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}

export default App;
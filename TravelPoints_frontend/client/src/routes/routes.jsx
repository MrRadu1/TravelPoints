import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protectedroute";
import Signup from "../views/signup";
import Login from "../views/login";
import { useAuth } from "../context/authcontext";
import Screen6 from "../views/screen6";
import PasswordReset from "../views/resetPassword";
import Contact from "../views/contact";
import WishList from "../views/wishlist";
import PasswordForgot from "../views/forgotPassword";
import Screen4 from "../views/screen4";
import AdminDashboard from "../views/admindashboard";

const Routes = () => {
  const { role } = useAuth();
  const routesForPublic = [
    { path: "/", element: <Screen4 />},
    { path: "/home", element: <Screen4 /> }, // Redundant with "/" path
    { path: "/destinations", element: <Screen6 /> },
    { path: "/contact", element: <Contact/>},
    { path: "/sign-up", element: <Signup /> },
    { path: "/login", element: <Login/>},
    { path: "/wish-list", element: <WishList/>},
    { path: "/resetPassword/:verificationCode", element: <PasswordReset />},
    { path: "/forgot-password", element: <PasswordForgot/> },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        { path: "dashboard", element: role === 'Admin' ? <AdminDashboard/> : <div>Unauthorized</div>},
        { path: "logout", element: <div>Logout</div> },
        // Other nested authenticated routes
      ]
    }
  ];

  const notFoundRoute = {
    path: "*",
    element: <div>Not Found</div>,
  };

  // Combine routes
  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForAuthenticatedOnly,
    notFoundRoute,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;

import React, { useEffect } from "react";
import { styled } from "styled-components";
import Spinner from "../ui/Spinner";
// import { useUser } from "../hooks/useUser";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../hooks/useUser";

function ProtectedRouteContainer({ children }) {

  const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`

const Message= styled.div`
  display: "flex";
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

  const navigate = useNavigate();
  const location= useLocation();

  // Load the authenticated user
  const { isAuthenticated, isLoading, } = useAuth();
  const { user } = useUser();

  // If there is no authenticated user redirect to login
  useEffect(() => {
    if (!isAuthenticated) navigate('/signin');
  }, [isAuthenticated, isLoading, navigate])

  // Show a Spinner while loading
  if (isLoading) return (
    <FullPage>
      <Spinner />
    </FullPage>
  );

  // If there is a user render the app
  // if (isAuthenticated) return children;

  // Check for admin role
  const isAdmin = isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN');
  console.log(isAdmin);

  // If user is not admin, render everything except /admin
   // If not admin and accessing /users route, redirect to dashboard
   if (!isAdmin && location.pathname.startsWith('/admin')) {
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return null;
  }

  // If there is an authenticated user and it's an admin, render the app
  return children;
}

export default ProtectedRouteContainer;
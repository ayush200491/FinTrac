import React from "react";
import styled from "styled-components";
import LoginForm from "../auth/LoginForm";
import { Logo, Heading, Row } from '../ui'

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Login() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Login</Heading>
      </Row>
      <LoginLayout>
        <Logo />
        <Heading as='h-center'>Login to your account</Heading>
        <LoginForm />
      </LoginLayout>
    </>
  )
}

export default Login;

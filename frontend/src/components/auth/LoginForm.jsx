import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../ui";
import { useAuth } from "../context/AuthContext";
import { useCsrfToken} from '../hooks/useCsrfToken';

const FullPageContainer = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background:
    radial-gradient(circle at 15% 15%, rgba(17, 127, 115, 0.22), transparent 28%),
    radial-gradient(circle at 85% 0%, rgba(22, 104, 154, 0.2), transparent 32%),
    linear-gradient(140deg, var(--color-grey-50), var(--color-grey-100));
`;

const FormContainer = styled.div`
  margin: auto;
  padding: 2.4rem;
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 44rem;
  background: linear-gradient(170deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.75));
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.2rem;
`;

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }
`;

const Checkbox = styled.input`
  margin-right: 0;
  width: fit-content;
`;

const CheckboxLabel = styled.label`
  font-weight: 600;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin: 0 0 0.6rem;
  color: var(--color-grey-700);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.1rem;
  font-size: 1.5rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.82);

  &:focus {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 4px rgba(17, 127, 115, 0.14);
    outline: none;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.6rem;
  font-size: 2.5rem;
  font-family: "Space Grotesk", sans-serif;
  color: var(--color-grey-800);
`;

const Message = styled.span`
  margin: 0.6rem 0;
  color: ${(props) => (props.errors ? "var(--color-red-700)" : "var(--color-green-700)")};
  overflow: auto;
  font-weight: 600;
`;

const LinkContainer = styled.div`
  margin-right: 0;
  text-align: center;

  a {
    color: var(--color-brand-700);
    font-weight: 600;
  }
`;

const SignupContainer = styled.div`
  margin-right: 0;
  padding: 0.4rem;
  text-align: center;

  a {
    color: var(--color-brand-700);
    font-weight: 700;
  }
`;

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { setLoggedInUser } = useAuth();

  const csrfToken = useCsrfToken();

  useEffect(() => {
    const rememberMePreference = localStorage.getItem("rememberMe") === "true";
    setRememberMe(rememberMePreference);
    if (rememberMePreference) {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername || "");
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const api = "http://localhost:8080";
      const response = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { username: user } = data;
        setLoggedInUser(user);
        setMsg("Login successful!");
        login();

        navigate("/");

        if (rememberMe) {
          localStorage.setItem("username", username);
          localStorage.setItem("rememberMe", true);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("rememberMe");
        }
      } else {
        const data = await response.text();
        setError(true);
        setMsg(data);
        console.error("Login failed: ", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <FullPageContainer>
      <FormContainer>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <InputContainer>
            <Label htmlFor="username">Username:</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </InputContainer>
          <CheckboxContainer>
            <span>
              <CheckboxLabel htmlFor="rememberMe" style={{ marginBottom: "auto" }}>Remember me</CheckboxLabel>
              <Checkbox
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
            </span>
            <LinkContainer>
              <Link to="/forgot-password">Forgot Password?</Link>
            </LinkContainer>
          </CheckboxContainer>
          {msg && <Message errors={error}>{msg}</Message>}
          <Button size="lg" type="submit">Login</Button>
          <SignupContainer>
            <Link to="/signup">Sign Up</Link>
          </SignupContainer>
        </Form>
      </FormContainer>
    </FullPageContainer>
  );
};

export default LoginForm;

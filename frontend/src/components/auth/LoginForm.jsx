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
    radial-gradient(circle at 16% 14%, rgba(83, 208, 194, 0.2), transparent 26%),
    radial-gradient(circle at 84% 0%, rgba(47, 108, 167, 0.22), transparent 30%),
    linear-gradient(145deg, #0b1524, #101e31 56%, #15263a);
`;

const FormContainer = styled.div`
  margin: auto;
  padding: 2.6rem;
  border-radius: 24px;
  width: 100%;
  max-width: 44rem;
  background: linear-gradient(170deg, rgba(21, 32, 51, 0.96), rgba(15, 23, 38, 0.94));
  border: 1px solid rgba(116, 227, 213, 0.18);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(14px);
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
  color: rgba(237, 243, 248, 0.88);
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin: 0 0 0.6rem;
  color: rgba(237, 243, 248, 0.88);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.1rem;
  font-size: 1.5rem;
  border: 1px solid rgba(191, 248, 239, 0.18);
  border-radius: var(--border-radius-md);
  box-sizing: border-box;
  background-color: rgba(11, 21, 36, 0.86);
  color: #edf3f8;

  &::placeholder {
    color: rgba(219, 229, 239, 0.4);
  }

  &:focus {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 4px rgba(116, 227, 213, 0.18);
    outline: none;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.6rem;
  font-size: 2.5rem;
  font-family: "Space Grotesk", sans-serif;
  color: #edf3f8;
`;

const Message = styled.span`
  margin: 0.6rem 0;
  color: ${(props) => (props.errors ? "#ffc0c6" : "#9af0e4")};
  overflow: auto;
  font-weight: 600;
`;

const LinkContainer = styled.div`
  margin-right: 0;
  text-align: center;

  a {
    color: #9af0e4;
    font-weight: 600;
  }
`;

const SignupContainer = styled.div`
  margin-right: 0;
  padding: 0.4rem;
  text-align: center;

  a {
    color: #bff8ef;
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

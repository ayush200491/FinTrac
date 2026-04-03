import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCsrfToken } from '../hooks/useCsrfToken';
import { Button, FormContainer, ErrorMessage, Form, Input, Heading } from '../ui';

const FullPageContainer = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background:
    radial-gradient(circle at 10% 10%, rgba(17, 127, 115, 0.2), transparent 30%),
    radial-gradient(circle at 85% 0%, rgba(22, 104, 154, 0.18), transparent 34%),
    linear-gradient(140deg, var(--color-grey-50), var(--color-grey-100));
`;

const Suggestions = styled.div`
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.7);
  border: 1px dashed var(--color-grey-300);

  p {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  span {
    display: inline-block;
    margin-bottom: 0.4rem;
    margin-right: 0.4rem;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    background: var(--color-grey-100);
  }
`;

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const navigate = useNavigate();
  const csrfToken = useCsrfToken();

  const submitForm = async (data) => {
    try {
      const formData = new FormData();
      formData.append('user', new Blob([JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password
      })], { type: 'application/json' }));

      const response = await axios.post('http://localhost:8080/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken   // Include CSRF token in headers
        },
      });

      console.log(response);
      navigate('/signin');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          const { message, suggestedUsernames: suggestions } = error.response.data;
          setErrorMessage(message);
          setSuggestedUsernames(suggestions);
        } else if (error.response.status === 400) {
          const { errors: validationErrors } = error.response.data;
          validationErrors.forEach(err => {
            setError(err.field, { type: 'manual', message: err.defaultMessage });
          });

        } else {
          if (error.response.data && error.response.data.message) {
            alert(error.response.data.message);
            setErrorMessage(error.response.data.message);
          }
          setErrorMessage(error.response.data);
          // setErrorMessage('An error occurred while registering.');
        }
      } else {
        setErrorMessage('An unexpected error occurred while registering.');
      }
    }

    console.log('Registered Data:', {
      username: data.username,
      email: data.email,
      password: data.password
    });
  };

  return (
    <FullPageContainer>
      <FormContainer>
        <Form onSubmit={handleSubmit(submitForm)}>
          <Heading as='h2'>Register</Heading>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}

          <Input
            name="email"
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          <Input
            name="password"
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

          <Button style={{ marginTop: '10px' }} variation="primary" size="md" type="submit">Create Account</Button>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

          {suggestedUsernames.length > 0 && (
            <Suggestions>
              <p>Username suggestions:</p>
              {suggestedUsernames.map((name, index) => (
                <span key={index}>{name}&nbsp;</span>
              ))}
            </Suggestions>
          )}
        </Form>
      </FormContainer>
    </FullPageContainer>
  );
};

export default RegisterForm;

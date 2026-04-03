import styled, { css } from "styled-components";


const FormContainer = styled.div`
  margin: 0 auto;
  padding: 2.2rem;
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 46rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.72));
  border: 1px solid var(--color-grey-200);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
`;

const Form = styled.form`
  padding: ${(props) => (props.type === "regular" ? "2rem" : "1rem")};
  background-color: ${(props) =>
    props.type === "regular" ? "rgba(255, 255, 255, 0.64)" : "transparent"};
  display: ${(props) => (props.type === "regular" ? "block" : "inline-block")};
  border: ${(props) =>
    props.type === "regular"
      ? "1px solid var(--color-grey-200)"
      : "none"};
  border-radius: ${(props) =>
    props.type === "regular" ? "var(--border-radius-md)" : "0"};
  width: 100%;
  overflow: hidden;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  box-shadow: ${(props) => (props.type === "regular" ? "var(--shadow-sm)" : "none")};

  & > * {
    display: block;
  }

  & input {
    width: 100%;
    margin-bottom: 1.2rem;
  }

  & Button {
    margin: 1rem 0 1rem 0;
  }
`;

const Label = styled.span`
  color: ${({ color }) => color || `var(--color-grey-700)`};
  font-weight: 600;
  font-size: 1.35rem;
  margin-right: 10px;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: var(--color-red-500);
  margin-bottom: 10px;
`;

Form.defaultProps = {
  type: "regular",
};

export {FormContainer, Form, ErrorMessage, Label};

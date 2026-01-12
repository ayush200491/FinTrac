import styled from "styled-components";

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius-md);
  padding: 1rem 1.2rem;
  margin-top: 1rem;
  box-shadow: var(--shadow-sm);

  &:focus {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 4px rgba(17, 127, 115, 0.14);
  }
`;

export default Input;

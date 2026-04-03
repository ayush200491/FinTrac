import styled from "styled-components";

const Textarea = styled.textarea`
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: var(--shadow-sm);
  width: 100%;
  min-height: 9.6rem;
  resize: vertical;

  &:focus {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 4px rgba(17, 127, 115, 0.14);
  }
`;

export default Textarea;

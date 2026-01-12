import React from 'react'
import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 1rem 1.2rem;
  box-sizing: border-box;
  appearance: none;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-md);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.75));
  font-weight: 600;
  box-shadow: var(--shadow-sm);
  min-width: 16rem;

  &:focus {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 4px rgba(17, 127, 115, 0.14);
  }
`;


function Select({options, value, onChange, ...props}) {
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>
    {options.map((option)=>(
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
    </StyledSelect>
  )
}

export default Select
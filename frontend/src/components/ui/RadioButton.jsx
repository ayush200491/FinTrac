import React from 'react';
import styled from 'styled-components';

// Styled radio input
const RadioInput = styled.input.attrs({ type: 'radio' })`
  /* Hide the default radio button */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px !important;
  height: 16px;
  border: 1px solid #ccc;
  border-radius: 50%;
  outline: none;
  margin: 0 8px 0 0 !important;
  position: relative;
  cursor: pointer;

  /* Checkmark for the selected state */
  &:checked::before {
    content: '';
    width: 10px;
    height: 10px;
    background-color: var(--color-brand-500);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// Styled label for radio button
const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
`;

// Radio button component
const RadioButton = ({ id, name, value, checked, onChange, label }) => {
  return (
    <RadioLabel htmlFor={id}>
      <RadioInput id={id} name={name} value={value} checked={checked} onChange={onChange} />
      {label}
    </RadioLabel>
  );
};

export default RadioButton;

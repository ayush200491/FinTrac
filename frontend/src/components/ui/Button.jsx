import styled, { css } from "styled-components";

const sizes = {
  sm: css`
    font-size: 1.2rem;
    padding: 0.6rem 1rem;
    text-transform: uppercase;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0.06em;
  `,
  md: css`
    font-size: 1.4rem;
    padding: 0.9rem 1.4rem;
    font-weight: 600;
    text-align: center;
  `,
  lg: css`
    font-size: 1.6rem;
    padding: 1.2rem 2rem;
    font-weight: 700;
  `,
};

const variations = {
  primary: css`
    color: var(--color-grey-0);
    background: linear-gradient(135deg, var(--color-brand-600), var(--color-brand-700));

    &:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
    }
  `,

  secondary: css`
    color: var(--color-grey-700);
    background: rgba(255, 255, 255, 0.62);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-0);
    }
  `,

  success: css`
    color: var(--color-grey-0);
    background-color: var(--color-green-500);

    &:hover {
      background-color: var(--color-green-700);
    }
  `,

  danger: css`
    color: var(--color-grey-0);
    background-color: var(--color-red-500);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
  text: css`
    color: ${(props) => props.textColor || `var(--color-brand-700)`};
    background-color: transparent;
    box-shadow: none;
    border: 1px solid transparent;

    &:hover {
      background-color: var(--color-grey-100);
    }
  `,
};

const color = {
  primary: css`
    color: var(--color-red-100);
  `,
  secondary: css`
    color: var(--color-grey-600);
  `,
  success: css`
    color: var(--color-green-500);
  `,
  accent: css`
    color: var(--color-silver-700);
  `,
  danger: css`
    color: var(--color-red-700);
  `,
};



const Button = styled.button`
  border: 1px solid transparent;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease, background-color 0.2s ease;

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.55;
  }

  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
  ${(props) => color[props.color]}
`;

Button.defaultProps = {
  variation: "primary",
  size: "md",
  color: 'var(--color-brand-600)'
};

export default Button;

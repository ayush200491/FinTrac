import styled from "styled-components";

const ButtonIcon = styled.button`
  background: ${({ bg }) => bg || 'transparent'};
  color: ${({ color }) => color || 'var(--color-brand-600)'};
  border: 1px solid transparent;
  padding: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '0.6rem';
      case 'md':
        return '1rem';
      case 'lg':
        return '1.5rem';
      default:
        return '0.9rem';
    }
  }};
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
  outline: none;
  display: flex !important;
  align-items: center;
  justify-content: center;
  font-size: ${({ iconSize }) => iconSize ? `calc(${iconSize} - 0.5rem)` : '1.6rem'};
  text-align: center;
  gap: 0.5rem;

  &:hover, &:focus {
    background: linear-gradient(135deg, rgba(17, 127, 115, 0.18), rgba(22, 104, 154, 0.14));
    border-color: rgba(17, 127, 115, 0.28);
    outline: none;
    transform: translateY(-1px);
  }

  & svg {
    width: ${({ iconSize }) => iconSize || '1.6rem'};
    height: ${({ iconSize }) => iconSize || '1.6rem'};
    color: ${({ color }) => color || 'var(--color-brand-600)'};
  }
`;

export default ButtonIcon;

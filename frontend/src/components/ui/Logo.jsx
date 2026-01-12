import React from "react";
import styled, { keyframes } from "styled-components";
import { GiTakeMyMoney } from "react-icons/gi";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const StyledLogo = styled.div`
  font-size: 2.2rem;
  color: var(--color-grey-800);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Space Grotesk", sans-serif;
  font-weight: 700;
  letter-spacing: 0.02em;
  gap: 0.8rem;
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-lg);
  background: linear-gradient(135deg, rgba(17, 127, 115, 0.18), rgba(22, 104, 154, 0.08));
  animation: ${fadeIn} 1s ease;
`;

function Logo() {
  const LogoIcon = <GiTakeMyMoney size={28} color="var(--color-brand-700)" />;

  return (
    <StyledLogo>
      {LogoIcon} <span>ExpenseWise</span>
    </StyledLogo>
  );
}

export default Logo;

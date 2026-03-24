import React from "react";
import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";

const StyledHeader = styled.header`
  background: linear-gradient(180deg, var(--color-grey-0), var(--color-grey-50));
  padding: 1.6rem 2.8rem;
  border-bottom: 1px solid var(--color-grey-200);

  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: 1000px) {
    padding: 1.2rem 1.4rem;
  }
`;

function Header() {
  return (
    <StyledHeader>
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;

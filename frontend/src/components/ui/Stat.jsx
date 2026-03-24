import styled from "styled-components";
import React from "react";
const StyledStat = styled.div`
  background: linear-gradient(160deg, var(--color-grey-0), var(--color-grey-50));
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  padding: 1.7rem;
  display: grid;
  grid-template-columns: 5.6rem 1fr;
  grid-template-rows: auto auto;
  column-gap: 1.2rem;
  row-gap: 0.4rem;
`;

const Icon = styled.div`
  grid-row: 1 / -1;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--color-${(props) => props.color}-100);

  & svg {
    width: 2.8rem;
    height: auto;
    color: var(--color-${(props) => props.color}-700);
  }
`;

const Title = styled.h5`
  align-self: end;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--color-grey-600);
`;

const Value = styled.p`
  font-size: 2rem;
  line-height: 1;
  font-weight: 700;
  color: var(--color-grey-900);
`;

function Stat({ icon, title, value, color }) {
  return (
    <StyledStat>
      <Icon color={color}>{icon}</Icon>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </StyledStat>
  );
}

export default Stat;

import React from 'react'
import styled from "styled-components";

const ChartBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.7));
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;
  box-shadow: var(--shadow-sm);

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }

  @media (max-width: 1100px) {
    grid-column: auto;
  }
`;

export default ChartBox
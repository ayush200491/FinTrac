import { styled, css } from "styled-components";

const Heading = styled.h1`
    ${(props) => props.as === "h1" && css`
        font-size: clamp(2.8rem, 1.8vw + 1.6rem, 4rem);
        font-weight: 700;
        font-family: "Space Grotesk", sans-serif;
        letter-spacing: -0.02em;
    `}
   
    ${(props) => props.as === "h2" && css`
        font-size: 2.3rem;
        font-weight: 600;
        font-family: "Space Grotesk", sans-serif;
    `}
    ${(props) => props.as === "h3" && css`
        font-size: 1.8rem;
        font-weight: 600;
    `}
    
    ${(props) => props.as === "h-center" && css`
        font-size: 3rem;
        font-weight: 600;
        text-align: center;
        font-family: "Space Grotesk", sans-serif;
    `}
    color: var(--color-grey-800);
    line-height: 1.4;
`;

export default Heading;
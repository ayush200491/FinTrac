import React from 'react'
import { styled } from 'styled-components'
import Logo  from "./Logo"
import MainNav from "./MainNav"
// import { useCabins } from '../features/cabins/useCabins'

const StyledSidebar = styled.aside`
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.52));
        backdrop-filter: blur(14px);
        padding: 2.1rem 1.8rem;
        border-right: 1px solid var(--color-grey-200);
    grid-row: 1/-1;
    display: flex;
    flex-direction: column;
        gap: 2.2rem;
        box-shadow: inset -1px 0 0 rgba(17, 127, 115, 0.12);

        @media (max-width: 1000px) {
            grid-row: auto;
            border-right: none;
            border-bottom: 1px solid var(--color-grey-200);
            padding: 1.2rem 1.4rem;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.8));
        }
`

function Sidebar() {
    return (
        <StyledSidebar>
            <Logo />
            <MainNav />
        </StyledSidebar>
    )
}

export default Sidebar;
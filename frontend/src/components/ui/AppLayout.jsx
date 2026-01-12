import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { styled } from 'styled-components'

const Main = styled.main`
        padding: 3.2rem 3.6rem 4rem;
        overflow-y: auto;

        @media (max-width: 1000px) {
            padding: 2.2rem 1.8rem 3rem;
        }
`

const StyledAppLayout = styled.div`
    display: grid;
        grid-template-columns: 28rem 1fr;
    grid-template-rows: auto 1fr;
        min-height: 100vh;

        @media (max-width: 1000px) {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto 1fr;
        }
`
const StyledContainer = styled.div`
        width: min(112rem, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
        gap: 2.4rem;
`

function AppLayout() {
    return (
        <StyledAppLayout>
            <Header />
            <Sidebar />
            <Main>
                <StyledContainer>
                    <Outlet />
                </StyledContainer>
            </Main>
        </StyledAppLayout>
    )
}

export default AppLayout
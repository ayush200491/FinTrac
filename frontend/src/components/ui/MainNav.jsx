import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from "styled-components";
import { HiHome } from "react-icons/hi2";
import { HiMiniUser } from "react-icons/hi2";
import { useUser } from '../hooks/useUser';
import { FaUserShield } from "react-icons/fa6";
import { AiOutlineCalculator } from "react-icons/ai";
import { AiOutlineHistory } from 'react-icons/ai';

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (max-width: 1000px) {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.2rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    padding: 1.15rem 1.35rem;
    border-radius: var(--border-radius-md);
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-900);
    background: linear-gradient(135deg, rgba(17, 127, 115, 0.2), rgba(22, 104, 154, 0.12));
    border-color: rgba(17, 127, 115, 0.25);
    transform: translateY(-1px);
  }

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-500);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }

  @media (max-width: 1000px) {
    white-space: nowrap;
  }
`;


function MainNav() {
  const { user } = useUser();

  return (
    <nav>
      <NavList>
        <li><StyledNavLink to='/dashboard'>
          <HiHome /> <span>Home</span>
        </StyledNavLink></li>
        <li><StyledNavLink to='/account'>
          <HiMiniUser /> <span>Account</span>
        </StyledNavLink>
        </li>
        <li><StyledNavLink to='/budgets'>
          <AiOutlineCalculator /> <span>Budgets</span>
        </StyledNavLink>
        </li>
        <li><StyledNavLink to='/transactions'>
          <AiOutlineHistory /> <span>Transactions</span>
        </StyledNavLink>
        </li>
        {(user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN') &&
          (<li><StyledNavLink to='/admin'>
            <FaUserShield /> <span>Admin Panel</span>
          </StyledNavLink></li>)}
      </NavList>
    </nav>
  )
}

export default MainNav;
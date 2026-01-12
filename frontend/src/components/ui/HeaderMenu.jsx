import React from "react";
import styled from "styled-components";
import ButtonIcon from "./ButtonIcon";
import { HiOutlineUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import DarkModeToggle from "./DarkModeToggle";
import UserAvatar from "./UserAvatar";
import { useUser } from "../hooks/useUser";

const StyledHeaderMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

function HeaderMenu() {
  const { user, profileImage } = useUser();
  const navigate = useNavigate();
  const hasAvatar = user && profileImage;

  return (
    <StyledHeaderMenu>
      <li>
        {hasAvatar ? (
          <UserAvatar />
        ) : (
          <ButtonIcon iconSize='2.4rem' onClick={() => navigate("/account")}>
            <HiOutlineUser />
          </ButtonIcon>
        )}
      </li>
      <li>
        <DarkModeToggle />
      </li>
      <li>
        <ButtonIcon iconSize='2.4rem' onClick={() => navigate("/signout")}>
          <MdLogout />
        </ButtonIcon>
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;

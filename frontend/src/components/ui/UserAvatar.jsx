import React from 'react'
import styled from "styled-components";
import {useUser} from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 0.9rem;
  align-items: center;
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--color-grey-200);
  border-radius: 999px;
  padding: 0.4rem 1rem 0.4rem 0.4rem;
`;

const Avatar = styled.img`
  display: block;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid rgba(17, 127, 115, 0.2);
  cursor: pointer;
`;

const UserAvatar = () => {
  const navigate= useNavigate();
  const { user, profileImage } = useUser();

  if (!user) {
    // Handle case where user data is null
    return <div>No user data available</div>;
  }

  const { username } = user;

  return (
    <StyledUserAvatar>
      <Avatar src={profileImage || 'default-user.jpg'} alt={username} onClick={() => navigate("/account")} />
      <span>{username}</span>
    </StyledUserAvatar>
  );
};

export default UserAvatar;

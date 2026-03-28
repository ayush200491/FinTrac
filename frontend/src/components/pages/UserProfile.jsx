import React, { useState } from 'react';
import styled from 'styled-components';
import { useUser } from '../hooks/useUser';
import {Heading, Input, Button, ErrorMessage} from '../ui'
import { formatCurrency } from '../utils/helpers';
import UserService from '../service/UserService';

const UserProfile = () => {
  const { isLoading, user, profileImage, reloadUser } = useUser();
  const [addAmount, setAddAmount] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleAddMoney = async () => {
    const amount = Number(addAmount);

    if (!amount || amount <= 0) {
      setStatusMessage('Enter an amount greater than 0');
      return;
    }

    try {
      await UserService.addBalance(user.username, amount);

      setStatusMessage('Money added successfully');
      setAddAmount('');
      reloadUser();
      window.dispatchEvent(new Event('expensewise:user-refresh'));
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || 'Failed to add money');
    }
  };

  const handleSetMonthlySalary = async () => {
    const amount = Number(salaryAmount);

    if (!amount || amount <= 0) {
      setStatusMessage('Enter a valid monthly salary amount');
      return;
    }

    try {
      await UserService.setMonthlySalary(user.username, amount);
      await UserService.applyMonthlySalary(user.username);
      setStatusMessage('Monthly salary saved and recorded successfully');
      reloadUser();
      window.dispatchEvent(new Event('expensewise:user-refresh'));
      setSalaryAmount('');
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || 'Failed to save monthly salary');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  // Todo: need to update account ui and to add update profile image option

  const profileImageUrl = profileImage ? profileImage : null;

  return (
    <>
      <Heading as="h1">User Profile</Heading>
      <ProfileContainer>
      {profileImageUrl && <ProfileImage src={profileImageUrl} alt={`${user.username}'s profile`} />}
        <InfoContainer>
          <InfoItem>
            <strong>Username:</strong> {user.username}
          </InfoItem>
          <InfoItem>
            <strong>Email:</strong> {user.email}
          </InfoItem>
          <InfoItem>
            <strong>Balance:</strong>{formatCurrency(user.balance)}
          </InfoItem>
          <InfoItem>
            <strong>Monthly Salary:</strong> {formatCurrency(user.monthlySalary || 0)}
          </InfoItem>
          <MoneyControls>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="Enter amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
            />
            <Button type="button" onClick={handleAddMoney}>Add Money</Button>
          </MoneyControls>
          <MoneyControls>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="Set monthly salary"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
            />
            <Button type="button" onClick={handleSetMonthlySalary}>Save Salary</Button>
          </MoneyControls>
          {statusMessage && <ErrorMessage>{statusMessage}</ErrorMessage>}
          {/* <InfoItem>
          <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </InfoItem>
        <InfoItem>
          <strong>Role:</strong> {user.role === 'ROLE_USER'? 'user' : 'admin'}
        </InfoItem> */}
        </InfoContainer>
      </ProfileContainer>
    </>
  );
};

export default UserProfile;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  width: 400px;
  padding: 41px;
  /* border: 1px solid var(--color-grey-300); */
  /* border-radius: 8px; */
  box-shadow: var(--shadow-sm);
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const InfoItem = styled.p`
  /* font-size: 18px; */
  margin: 5px 0;
  strong {
    margin-right: 10px;
  }
`;

const MoneyControls = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1.2rem;
`;

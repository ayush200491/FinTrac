import React, { useState, useEffect } from 'react';
import { FaPlus, FaSave } from 'react-icons/fa';
import { RiEditBoxLine } from "react-icons/ri";
import { IoMdTrash } from "react-icons/io";
import UserService from '../service/UserService';
import styled from 'styled-components';
import { Button, Heading, Form, Input, ButtonIcon, Modal, FileInput, ErrorMessage } from '../ui';
import Table from '../ui/Table';
import RadioButton from '../ui/RadioButton';
import { useForm, Controller } from 'react-hook-form';
import { Errors } from '../ui/Errors';

const Container = styled.div`
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

const defaultValues = {
  username: '',
  password: '',
  email: '',
  role: '',
  profileImage: null,
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue, reset, control } = useForm({
    defaultValues,
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setServerError('');
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profileImage", file);
    }
  };

  const resetForm = () => {
    reset(defaultValues);
    setServerError('');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await UserService.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async (data) => {
    try {
      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   if (key === 'profileImage' && data[key] instanceof FileList && data[key].length > 0) {
      //     formData.append(key, data[key][0]);
      //   } else {
      //     formData.append(key, data[key]);
      //   }
      // });

      const response = await UserService.createUser(data);
      console.log('User data saved', response, response.status, response.error);

      // Check for validation errors returned from the backend
       if (response.status === 400 && response.data) {
        const errorMessages = Object.values(response.data).join(', ');
        setServerError(`Validation failed: ${errorMessages}`);
        console.log('Validation errors:', response.data);
      } else if (response.status === 403) {
        setServerError('You are not authorized to perform this action.', response);
      } else if (response[0].error) {
        // setServerError(response.error.message);
        setServerError(`Error creating user: ${response[0].error.message}`);
        console.log('Error creating user:', response.error);
      } else {
        fetchUsers();
        setShowForm(false);
        closeModal();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setServerError(`Error details: ${error.message}`);
    }
  };



  const updateUser = async (data) => {
    try {
      // const formData = new FormData();
      // Object.keys(data).forEach(key => {
      //   if (key === 'profileImage' && data[key] instanceof FileList && data[key].length > 0) {
      //     formData.append(key, data[key][0]);
      //   } else {
      //     formData.append(key, data[key]);
      //   }
      // });

      // Log formData contents
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      const response = await UserService.updateUser(editingUser.id, data);
      console.log('User data updated', response.error, response[0]);
      
      // Check for validation errors returned from the backend
      if (response.status === 400 && response.data) {
        console.log('User err', response);
        const errorMessages = Object.values(response.data).join(', ');
        setServerError(`Validation failed: ${errorMessages}`);
        console.log('Validation errors:', response.data);
      } else if (response.status === 403) {
        setServerError('You are not authorized to perform this action.', response);
      } else if (response.error) {
        // setServerError(response.error.message);
        setServerError(`Error creating user: ${response.error.message}`);
        console.log('Error creating user:', response.error);
      } else {
        fetchUsers();
        resetForm();
        setEditingUser(null);
        setShowForm(false);
        closeModal();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (user) => {
    try {
      await UserService.deleteUser(user.id);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const editUser = (user) => {
    setValue('username', user.username);
    setValue('password', user.password);
    setValue('email', user.email);
    setValue('role', user.role);
    // Here we only set the profileImage filename for reference, actual file needs to be handled separately
    setValue('profileImage', null);
    setEditingUser(user);
    setShowForm(true);
    openModal();
  };

  return (
    <>
      <Heading as='h1'>Users</Heading>
      <Container>
        <ButtonIcon onClick={() => { setEditingUser(null); setShowForm(true); openModal(); }}><FaPlus /> Add User</ButtonIcon>
        {showForm && (
          <>
            <Modal isOpen={isModalOpen} onClose={closeModal} onClick={() => setShowForm(false)}>
              <Form onSubmit={handleSubmit(editingUser ? updateUser : createUser)}>
                <Input
                  type="text"
                  id="username"
                  placeholder="Username"
                  {...register('username', { required: 'Username is required' })}
                />
                {errors.username && <Errors className="error">{errors.username.message}</Errors>}
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && <Errors className="error">{errors.password.message}</Errors>}
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <Errors className="error">{errors.email.message}</Errors>}

                <FileInput
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  {...register('profileImage', { required: true })}
                />
                {errors.profileImage && <ErrorMessage>{errors.profileImage.message}</ErrorMessage>}

                <Flex>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <>
                        <RadioButton
                          id="userRole"
                          name="role"
                          value="USER"
                          label="User"
                          checked={field.value === 'USER'}
                          onChange={() => field.onChange('USER')}
                        />
                        <RadioButton
                          id="adminRole"
                          name="role"
                          value="ADMIN"
                          label="Admin"
                          checked={field.value === 'ADMIN'}
                          onChange={() => field.onChange('ADMIN')}
                        />
                      </>
                    )}
                  />
                </Flex>
                {serverError && <Errors className="error">{serverError}</Errors>}
                <ButtonIcon bg='var(--color-grey-50)' type="submit">
                  {editingUser ? <><FaSave /> Update</> : <><FaPlus /> Create</>}
                </ButtonIcon>
              </Form>
            </Modal>
          </>
        )}
        <Table
          headers={['id', 'username', 'profileImageFileName', 'email', 'role', 'balance', 'expenses']}
          data={users}
          actions={[
            { icon: <RiEditBoxLine />, label: ` Edit`, color: 'var(--color-green-700)', onClick: editUser },
            { icon: <IoMdTrash />, label: ` Delete`, color: 'red', onClick: deleteUser },
          ]}
        />
      </Container>
    </>
  );
};

export default Users;

import axios from 'axios';

const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:8080/users/admin', {
      method: 'GET',
      headers: {
        // No need to set Content-Type for GET requests
        // 'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// const createUser = async (userData) => {
//   console.log('createUser')
//   try {
//     const formData = new FormData();
//     formData.append('userDetails', JSON.stringify(userData));
//     formData.append('profileImage', userData.profileImage);
//     console.log('formData: ',formData);
//     const response = await fetch('http://localhost:8080/users/admin', {
//       method: 'POST',
//       headers: {
//         // No need to set Content-Type header, it will be automatically set by FormData
//         'Content-Type': 'multipart/form-data',
//         // 'Authorization': `Bearer ${localStorage.getItem('token')}`, 
//       },
//       credentials: 'include',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error creating user:', error);
//     throw error;
//   }
// };

const createUser = async (userData) => {
  console.log('createUser-userData', userData)
  try {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'USER',
    })], { type: 'application/json' }));

    // Append profile image file to form data
    const profileImageFile = userData.profileImage !== null ? userData.profileImage[0] : null;
    formData.append('profileImage', profileImageFile);

    const response = await axios.post('http://localhost:8080/users/admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check if the response status is within the range 200-299 for success
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Assuming the response contains JSON data
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    if (error.response) {
      return [{ error: error.response.data }]; // Capture server error message
    } else {
      throw error;
    }
  }
};

// const updateUser = async (userId, userData) => {
//   console.log('updateUser');
//   try {
//     const formData = new FormData();
//     formData.append('user', new Blob([JSON.stringify({
//       username: userData.username,
//       email: userData.email,
//       password: userData.password,
//       role: userData.role || 'USER',
//     })], { type: 'application/json' }));
//     formData.append('profileImage', userData.profileImage[0]);

//     const response = await fetch(`http://localhost:8080/users/admin/${userId}`, {
//       method: 'PUT',
//       headers: {
//         // No need to set Content-Type header, it will be automatically set by FormData
//         // 'Content-Type': 'multipart/form-data',
//         // 'Authorization': `Bearer ${localStorage.getItem('token')}`, 
//       },
//       credentials: 'include',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     console.log('response', response);
//     return await response.json();
//   } catch (error) {
//     console.error('Error updating user:', error);
//     throw error;
//   }
// };


const updateUser = async (userId, userData) => {
  console.log('updateUser');
  try {
    const formData = new FormData();
    formData.append('userDetails', new Blob([JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    })], { type: 'application/json' }));
    formData.append('profileImage', userData.profileImage[0]);

    const response = await axios.put(`http://localhost:8080/users/admin/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Include credentials in CORS requests
    });

    console.log('response', response);
    return response.data;
  } catch (error) {
    if (error.response) {
      return { error: error.response.data }; // Capture server error message
    } else {
      throw error;
    }
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8080/users/admin/${userId}`, {
      method: 'DELETE',
      headers: {
        // No need to set Content-Type for DELETE requests
        // 'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // console.log(response)
    // return await response;
  } catch (error) {
    if (error.response) {
      return { error: error.response.data }; // Capture server error message
    } else {
      throw error;
    }
  }
};

const addBalance = async (username, amount) => {
  const response = await axios.post(
    `http://localhost:8080/users/user/${username}/balance/add`,
    null,
    {
      params: { amount },
    }
  );

  return response.data;
};

const setMonthlySalary = async (username, amount) => {
  const response = await axios.post(
    `http://localhost:8080/users/user/${username}/salary`,
    null,
    {
      params: { amount },
    }
  );

  return response.data;
};

const applyMonthlySalary = async (username) => {
  const response = await axios.post(`http://localhost:8080/users/user/${username}/salary/apply`);
  return response.data;
};

export default {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  addBalance,
  setMonthlySalary,
  applyMonthlySalary,
};

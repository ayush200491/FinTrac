import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { loggedInUser } = useAuth();

  const reloadUser = () => {
    setRefreshCounter((count) => count + 1);
  };

  useEffect(() => {
    const handleUserRefresh = () => {
      reloadUser();
    };

    window.addEventListener('expensewise:user-refresh', handleUserRefresh);

    return () => {
      window.removeEventListener('expensewise:user-refresh', handleUserRefresh);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (loggedInUser) {
        setIsLoading(true);

        try {
          const response = await fetch(`http://localhost:8080/users/user/${loggedInUser}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);

            if (userData.profileImageFileName) {
              fetchProfileImage(userData.profileImageFileName);
            }
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setUser(null);
      }
    };

    const fetchProfileImage = async (fileName) => {
      try {
        const response = await fetch(`http://localhost:8080/users/user/profileImage/${fileName}`);
        if (response.ok) {
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfileImage(imageUrl);
        } else {
          console.error('Failed to fetch profile image');
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchUser();
  }, [loggedInUser, refreshCounter]);

  return { isLoading, user, profileImage, reloadUser };
};

export { useUser };

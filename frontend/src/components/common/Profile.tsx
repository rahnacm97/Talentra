import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/index';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p>User ID: {user.userId}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default Profile;
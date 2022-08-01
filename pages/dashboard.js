import { deleteCookie, getCookie } from 'cookies-next';
import connect from '../lib/database';
import React from 'react';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { useRouter } from 'next/router';

const Dashboard = ({ displayName, userId }) => {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('token');
    router.replace('/');
  };

  return (
    <div>
      <div>Welcome {displayName}</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    await connect();
    const token = getCookie('token', { req, res });

    if (!token) {
      console.log(`Missing Token`);
      return { redirect: { destination: '/' } };
    }

    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: verified.id });
    if (!user) {
      return { redirect: { destination: '/' } };
    }

    return {
      props: {
        displayName: user.displayName,
        userId: user.userId,
      },
    };
  } catch (err) {
    console.log(`Delete Cookie: ${err}`);
    deleteCookie('token', { req, res });
    return { redirect: { destination: '/' } };
  }
};

export default Dashboard;

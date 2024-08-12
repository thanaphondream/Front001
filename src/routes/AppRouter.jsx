import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginForm from '../layout/LoginForm';
import RegisterForm from '../layout/RegisterForm';
import useAuth from '../hooks/useAuth';
import Header from '../layout/Header';
import UserHome from '../layout/UserHome';
import ProductPage from '../components/ProductPage '; 
import TableReservations from '../components/TableReservations';
import Confirm from '../components/Confrim'; 
import Test001 from '../components/test001';
import AdminHome from '../layout/AdminPage';
import AddProductForm from '../components/Adproduct';
import UserProfileForm from '../components/UserProfile';
import EditUserProfile from '../components/EditUserProfile';
import AdminOrder from '../components/AdminOrder';
import Profile from '../layout/profile';
import EditProfile  from '../layout/EditProfile';

const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <LoginForm /> },
      
      { path: '/register', element: <RegisterForm /> }
    ]
  }
]);

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <UserHome /> },
      { path: '/new', element: <p>New Todo Form</p> },
      { path: '/products', element: <ProductPage /> },
      { path: '/table-reservations', element: <TableReservations /> },
      { path: '/confirm', element: <Confirm /> },
      { path: '/test001', element: <Test001 /> },
      { path: '/profile', element: <Profile /> },
      { path: '/EditProfile', element: <EditProfile  /> },

    ]
  }
]);
const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <ProductPage /> },
      { path: '/table-reservations', element: <TableReservations /> },
      { path: '/confirm', element: <Confirm /> },
      { path: '/products', element: <ProductPage /> },
      { path: '/Adproduct', element: <AddProductForm /> },
      { path: '/UserProfile', element: <UserProfileForm /> },
      { path: '/EditUserProfile/:userId', element: <EditUserProfile /> },
      { path: '/AdminOrder/', element: <AdminOrder /> },
      { path: '/profile', element: <Profile /> },
      { path: '/EditProfile', element: <EditProfile  /> },




     

    ]
  }
]);

export default function AppRouter() {
  const { user } = useAuth();
  const finalRouter = user?.id ? (user.role === 'ADMIN' ? adminRouter : userRouter) : guestRouter;
  return (
    <RouterProvider router={finalRouter} />
  );
}

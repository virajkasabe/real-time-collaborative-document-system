// components/layout/PublicLayout.js
import React from 'react';
import NavbarPage from '../pages/NavbarPage';
import FooterPage from '../pages/FooterPage';
import { Outlet } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  return (
    <>
      <NavbarPage />
      <main><Outlet/></main>
      <FooterPage />
    </>
  );
};

export default PublicLayout;
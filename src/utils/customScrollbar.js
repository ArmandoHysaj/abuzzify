
'use client';
import React from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const CustomScrollbar = ({ children }) => (
  <SimpleBar style={{ maxHeight: '100vh' }}>
    {children}
  </SimpleBar>
);

export default CustomScrollbar;

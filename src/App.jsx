import React from 'react';
import HomePage from './pages/HomePage'; // Exact casing from your directory
import { AuthProvider } from './context/AuthContext'; // Enforces global identity boundary

function App() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}

export default App;
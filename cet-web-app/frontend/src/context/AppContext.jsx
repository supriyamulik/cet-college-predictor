// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [optionForm, setOptionForm] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  return (
    <AppContext.Provider value={{
      optionForm,
      setOptionForm,
      userProfile,
      setUserProfile
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

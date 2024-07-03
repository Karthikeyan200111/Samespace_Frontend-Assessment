import React, { createContext, useState } from 'react';

export const AccentColorContext = createContext();

export const AccentColorProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState('black'); // Default accent color

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};

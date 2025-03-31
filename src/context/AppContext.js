import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  profile: null,
  tokens: [],
  menu: [],
  complaints: [],
  feedback: [],
  votes: [],
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };
    case 'SET_MENU':
      return { ...state, menu: action.payload };
    case 'ADD_COMPLAINT':
      return { 
        ...state, 
        complaints: [...state.complaints, action.payload] 
      };
    case 'SET_VOTES':
      return { ...state, votes: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
} 
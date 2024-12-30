import { createContext, ReactNode } from 'react';
import AgentService from '../services/API/AgentService';

// Define the context type first
export interface GlobalContextType {
  authService: AgentService;
}

// Create the context with the correct type
export const GlobalContext = createContext<GlobalContextType | null>(null);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const authService = new AgentService();
  
  const values: GlobalContextType = {
    authService
  };
  
  return (
    <GlobalContext.Provider value={values}>
      {children}
    </GlobalContext.Provider>
  );
}
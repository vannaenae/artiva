import React, { createContext, useContext, useState } from 'react';

export type Role = 'customer' | 'provider';

type RoleContextValue = {
  role: Role | null;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

/** The role chosen on RoleSelectionScreen, used to route post-verification. */
export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within a RoleProvider');
  return ctx;
}

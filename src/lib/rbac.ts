import type { Role } from './types/roles';

export const RBAC: Record<Role, any> = {
  ADMIN: {
    canManageBranches: true,
    canManageManagers: true,
    dashboard: 'ADMIN',
  },
  MANAGER: {
    canManageBranches: false,
    canManageManagers: false,
    dashboard: 'MANAGER',
  },
  CASHIER: {
    dashboard: 'COMMON'
  },
  STAFF: {
    dashboard: 'COMMON'
  }
};

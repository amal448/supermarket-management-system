import type { Roles } from './types/roles';

export const RBAC: Record<Roles, any> = {
  admin: {
    canManageBranches: true,
    canManageManagers: true,
    dashboard: 'ADMIN',
  },
  manager: {
    canManageBranches: false,
    canManageManagers: false,
    dashboard: 'MANAGER',
  },
  cashier: {
    dashboard: 'COMMON'
  },
  staff: {
    dashboard: 'COMMON'
  }
};

import type { Roles } from './roles';
export type User = {
  _id?: string;
  username: string;
  email: string;
  role: Roles;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  branchId?: string | null;
};

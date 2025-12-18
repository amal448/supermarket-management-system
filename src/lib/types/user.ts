import type { Roles } from './roles';
export type User = {
  _id?:string;
  id?: string;
  username: string;
  email: string;
  role: Roles;
  name?:string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  branchId?: string | null;
};
export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
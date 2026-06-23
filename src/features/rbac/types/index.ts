export type Role = string;

export type Status = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joinedDate: string;
}

export interface PermissionClaim {
  [permission: string]: boolean;
}

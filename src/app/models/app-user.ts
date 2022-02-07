import { Role } from '@app/models/role.enum';

export interface AppUser {
  uid?: string;
  role: Role;
  admin: boolean;
  submitted: boolean;
  email: string;
  name: string;
}

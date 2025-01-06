
import { GenericData, GenericListResult } from "./generic-data"

export interface User {
  id: number,
  first_name: string,
  last_name: string,
  username: string,
  email?: string,
  document: string,
  telephone: string,
  gender: string,
  profile_image?: string,
  active: number,
  points?: number,
  last_login?: string
  roles: Roles[]
}
export interface Roles {
  name: string,
  pivot: { user_id: number, role_id: number }
}
export interface UserData extends GenericData {
  data: Data
}

export interface Data extends GenericListResult {
  users: User[]
}

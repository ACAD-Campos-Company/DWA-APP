import { GenericData } from "./authenticate"

export interface Roles {
  name: string,
  pivot: { user_id: number, role_id: number }
}

export interface UserData extends GenericData {
  data: Data
}

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

export interface Data {
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  per_page: 50,
  prev_page_url: null,
  total: 14,
  users: User[]
}

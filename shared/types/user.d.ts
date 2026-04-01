interface BaseUser {
  email: string
  username: string
}

export interface User extends BaseUser {
  id: number
  isAdmin: boolean
}

export interface NewUser extends BaseUser {
  password: string
}

export interface UserAuthentication {
  username: string
  password: string
}

export interface UserWithoutPassword extends BaseUser {
  id: number
  dateCreation: string | null
}

export interface ChangePasswordPayload {
  id: User['id']
  password: NewUser['password']
  oldPassword: NewUser['password']
}

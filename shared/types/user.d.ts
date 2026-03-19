export interface User {
  id: number
  email: string
  username: string
  isAdmin: boolean
}

export interface NewUser {
  email: string
  username: string
  password: string
}

export interface UserAuthentication {
  username: string
  password: string
}

export interface UserWithoutPassword {
  id: number
  email: string
  username: string
  dateCreation: string | null
}

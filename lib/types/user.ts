export interface User {
  id: string
  name: string
  email: string
  password: string
}

export type UserWithoutPassword = Omit<User, 'password'>

export interface CreateUserInput {
  name: string
  email: string
  password: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
}

export interface UserLoginInput {
  email: string
  password: string
}

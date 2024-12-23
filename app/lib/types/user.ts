export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
}

export interface UserWithToken extends UserWithoutPassword {
  token?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
}

export interface UserLoginInput {
  email: string
  password: string
}

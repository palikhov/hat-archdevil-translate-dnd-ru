// This file is autogenerated, do not edit directly.

import {mande} from 'mande'

import {getApiBase} from '../defaults'

import {User} from '../schemas/User'
import {UserToCreate} from '../schemas/UserToCreate'
import {StatusMessage} from '../schemas/StatusMessage'
import {UserFields} from '../schemas/UserFields'

export const getUsers = async (): Promise<User[]> => {
  const api = mande(getApiBase() + `/users/`)
  return await api.get<User[]>('')
}
export const createUser = async (content: UserToCreate): Promise<User> => {
  const api = mande(getApiBase() + `/users/`)
  return await api.post<User>(content)
}
export const updateUser = async (user_id: number, content: UserFields): Promise<StatusMessage> => {
  const api = mande(getApiBase() + `/users/${user_id}`)
  return await api.post<StatusMessage>(content)
}
export const getCurrentUser = async (): Promise<User> => {
  const api = mande(getApiBase() + `/users/current`)
  return await api.get<User>('')
}

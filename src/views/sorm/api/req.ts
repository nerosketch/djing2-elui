import { getObjectListDecorator } from '@/api/baseRequests'
import { ICustomer } from '@/api/customers/types'

export const getCustomersWithoutPassports = getObjectListDecorator<ICustomer>('/sorm/passports/')
export const getCustomersWithoutContracts = getObjectListDecorator<ICustomer>('/sorm/contracts/')
export const getCustomersBirthDay = getObjectListDecorator<ICustomer>('/sorm/birth_day/')

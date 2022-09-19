import request from '@/utils/request'
import { AxiosPromise } from 'axios';
import { CustomerField } from "./types";

export const getCustomerFields = (): AxiosPromise<CustomerField[]> =>
  request.get<CustomerField[]>('/customers/filters/fields/')

import { ISite } from './types'
import { addObjectDecorator, getObjectDecorator, getObjectListDecorator, patchObjectDecorator } from '@/api/baseRequests'

const siteUrl = '/sites/'
export const getSites = getObjectListDecorator<ISite>(siteUrl)
export const getSite = getObjectDecorator<ISite>(siteUrl)
export const addSite = addObjectDecorator<ISite>(siteUrl)
export const changeSite = patchObjectDecorator<ISite>(siteUrl)

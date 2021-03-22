'use strict'

export const regexpVal = (expr: RegExp) => (rule: any, value: string, callback: Function) => {
  if (!value) {
    callback()
    return
  }
  if (!expr.test(value)) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

export const latinValidator = regexpVal(/^\w{1,127}$/i)

export const telephoneValidator = regexpVal(/^(\+[7893]\d{10,11})?$/i)

export const ipAddrValidator = regexpVal(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i)
export const ipAddrMaskValidator = regexpVal(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\/\d{1,2})$/i)

export const macAddrValidator = regexpVal(/^([0-9A-Fa-f]{1,2}[:-]){5}([0-9A-Fa-f]{1,2})$/i)

export const emailValidator = regexpVal(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i)

export const positiveValidator = (rule: any, value: number, callback: Function) => {
  if (value >= 0) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}

export const positiveNumberValueAvailable = (rule: any, value: number, callback: Function) => {
  if (!isNaN(value) && Number(value) > 0) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}

// Old, expired
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

'use strict'

const _regexpVal = (expr: RegExp) => (rule: any, value: string, callback: Function) => {
  if (!expr.test(value)) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

export const latinValidator = _regexpVal(/^\w{1,127}$/i)

export const telephoneValidator = _regexpVal(/^(\+[7893]\d{10,11})?$/i)

export const ipAddrValidator = _regexpVal(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i)
export const ipAddrMaskValidator = _regexpVal(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\/\d{1,2})$/i)

export const macAddrValidator = _regexpVal(/^([0-9A-Fa-f]{1,2}[:-]){5}([0-9A-Fa-f]{1,2})$/i)

export const emailValidator = _regexpVal(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i)

export const positiveValidator = (rule: any, value: number, callback: Function) => {
  if (value >= 0) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}

// Old, expired
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

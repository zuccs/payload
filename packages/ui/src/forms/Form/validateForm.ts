'use server'
import isDeepEqual from 'deep-equal'
import { ValidateForm } from './types'
import getDataByPath from './getDataByPath'
import getSiblingData from './getSiblingData'

export const validateForm: ValidateForm = async ({
  fields,
  data,
  t,
  config,
  user,
  id,
  operation,
}) => {
  const validatedFieldState = {}
  let isValid = true

  const validationPromises = Object.entries(fields).map(async ([path, field]) => {
    const validatedField = {
      ...field,
      valid: true,
    }

    if (field.passesCondition !== false) {
      let validationResult: boolean | string = true

      if (typeof field.validate === 'function') {
        let valueToValidate = field.value

        if (field?.rows && Array.isArray(field.rows)) {
          valueToValidate = getDataByPath(fields, path)
        }

        validationResult = await field.validate(valueToValidate, {
          id,
          config,
          data,
          operation,
          siblingData: getSiblingData(fields, path),
          t,
          user,
        })
      }

      if (typeof validationResult === 'string') {
        validatedField.errorMessage = validationResult
        validatedField.valid = false
        isValid = false
      }
    }

    validatedFieldState[path] = validatedField
  })

  await Promise.all(validationPromises)

  if (!isDeepEqual(fields, validatedFieldState)) {
    // dispatchFields({ state: validatedFieldState, type: 'REPLACE_STATE' })
  }

  return isValid
}

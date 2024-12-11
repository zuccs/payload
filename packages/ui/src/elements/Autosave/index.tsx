'use client'
// TODO: abstract the `next/navigation` dependency out from this component
import type { ClientCollectionConfig, ClientGlobalConfig } from 'payload'

import { versionDefaults } from 'payload/shared'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  useAllFormFields,
  useForm,
  useFormModified,
  useFormSubmitted,
} from '../../forms/Form/context.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import { useIgnoredEffect } from '../../hooks/useIgnoredEffect.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentEvents } from '../../providers/DocumentEvents/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { formatTimeToNow } from '../../utilities/formatDate.js'
import { reduceFieldsToValuesWithValidation } from '../../utilities/reduceFieldsToValuesWithValidation.js'
import './index.scss'

const baseClass = 'autosave'
// The minimum time the saving state should be shown
const minimumAnimationTime = 1000

export type Props = {
  collection?: ClientCollectionConfig
  global?: ClientGlobalConfig
  id?: number | string
  publishedDocUpdatedAt: string
}

export const Autosave: React.FC<Props> = ({ id, collection, global: globalDoc }) => {
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()
  const {
    docConfig,
    incrementVersionCount,
    lastUpdateTime,
    mostRecentVersionIsAutosaved,
    setLastUpdateTime,
    setMostRecentVersionIsAutosaved,
  } = useDocumentInfo()
  const { reportUpdate } = useDocumentEvents()
  const { dispatchFields, setSubmitted } = useForm()
  const submitted = useFormSubmitted()
  const versionsConfig = docConfig?.versions

  const [fields] = useAllFormFields()
  const formModified = useFormModified()
  const { code: locale } = useLocale()
  const { i18n, t } = useTranslation()

  let interval = versionDefaults.autosaveInterval
  if (versionsConfig.drafts && versionsConfig.drafts.autosave) {
    interval = versionsConfig.drafts.autosave.interval
  }

  const [saving, setSaving] = useState(false)
  const debouncedFields = useDebounce(fields, interval)
  const modified = useDebounce(formModified, interval)
  const fieldRef = useRef(fields)
  const modifiedRef = useRef(modified)
  const localeRef = useRef(locale)
  const debouncedRef = useRef(debouncedFields)

  debouncedRef.current = debouncedFields

  // Store fields in ref so the autosave func
  // can always retrieve the most to date copies
  // after the timeout has executed
  fieldRef.current = fields

  // Store modified in ref so the autosave func
  // can bail out if modified becomes false while
  // timing out during autosave
  modifiedRef.current = modified

  // Store locale in ref so the autosave func
  // can always retrieve the most to date locale
  localeRef.current = locale

  const autosaveQueue = useRef<(() => Promise<void>)[]>([])
  const isProcessingQueue = useRef(false)

  const processQueue = async () => {
    if (isProcessingQueue.current) {
      return
    }
    isProcessingQueue.current = true

    while (autosaveQueue.current.length > 0) {
      const autosaveFunc = autosaveQueue.current.shift()
      if (autosaveFunc) {
        await autosaveFunc()
      }
    }

    isProcessingQueue.current = false
  }

  const enqueueAutosave = (autosaveFunc: () => Promise<void>) => {
    autosaveQueue.current.push(autosaveFunc)
    void processQueue()
  }

  // When debounced fields change, autosave
  useIgnoredEffect(
    () => {
      const autosave = async () => {
        if (modified) {
          const startTimestamp = new Date().getTime()
          setSaving(true)

          let url: string
          let method: string
          let entitySlug: string

          if (collection && id) {
            entitySlug = collection.slug
            url = `${serverURL}${api}/${entitySlug}/${id}?draft=true&autosave=true&locale=${localeRef.current}`
            method = 'PATCH'
          }

          if (globalDoc) {
            entitySlug = globalDoc.slug
            url = `${serverURL}${api}/globals/${entitySlug}?draft=true&autosave=true&locale=${localeRef.current}`
            method = 'POST'
          }

          if (url) {
            if (modifiedRef.current) {
              const { data, valid } = {
                ...reduceFieldsToValuesWithValidation(fieldRef.current, true),
              }
              data._status = 'draft'
              const skipSubmission =
                submitted && !valid && versionsConfig?.drafts && versionsConfig?.drafts?.validate

              if (!skipSubmission) {
                try {
                  const res = await fetch(url, {
                    body: JSON.stringify(data),
                    credentials: 'include',
                    headers: {
                      'Accept-Language': i18n.language,
                      'Content-Type': 'application/json',
                    },
                    method,
                  })

                  const newDate = new Date()
                  const endTimestamp = newDate.getTime()

                  if (res.status === 200) {
                    setLastUpdateTime(newDate.getTime())

                    reportUpdate({
                      id,
                      entitySlug,
                      updatedAt: newDate.toISOString(),
                    })

                    if (!mostRecentVersionIsAutosaved) {
                      incrementVersionCount()
                      setMostRecentVersionIsAutosaved(true)
                    }
                  } else {
                    const json = await res.json()
                    if (
                      versionsConfig?.drafts &&
                      versionsConfig?.drafts?.validate &&
                      json?.errors
                    ) {
                      if (Array.isArray(json.errors)) {
                        const [fieldErrors, nonFieldErrors] = json.errors.reduce(
                          ([fieldErrs, nonFieldErrs], err) => {
                            const newFieldErrs = []
                            const newNonFieldErrs = []

                            if (err?.message) {
                              newNonFieldErrs.push(err)
                            }

                            if (Array.isArray(err?.data)) {
                              err.data.forEach((dataError) => {
                                if (dataError?.field) {
                                  newFieldErrs.push(dataError)
                                } else {
                                  newNonFieldErrs.push(dataError)
                                }
                              })
                            }

                            return [
                              [...fieldErrs, ...newFieldErrs],
                              [...nonFieldErrs, ...newNonFieldErrs],
                            ]
                          },
                          [[], []],
                        )

                        dispatchFields({
                          type: 'ADD_SERVER_ERRORS',
                          errors: fieldErrors,
                        })

                        nonFieldErrors.forEach((err) => {
                          toast.error(err.message || i18n.t('error:unknown'))
                        })

                        setSubmitted(true)
                        setSaving(false)
                        return
                      }
                    }
                  }

                  if (endTimestamp - startTimestamp < minimumAnimationTime) {
                    await new Promise((resolve) =>
                      setTimeout(resolve, minimumAnimationTime - (endTimestamp - startTimestamp)),
                    )
                  }
                } catch (error) {
                  // Handle error
                } finally {
                  setSaving(false)
                }
              }
            }
          }
        }
      }

      enqueueAutosave(autosave)

      return () => {
        setSaving(false)
      }
    },
    [debouncedFields],
    [
      api,
      collection,
      dispatchFields,
      globalDoc,
      i18n,
      id,
      interval,
      modified,
      reportUpdate,
      serverURL,
      setSubmitted,
      versionsConfig?.drafts,
      submitted,
      setLastUpdateTime,
      mostRecentVersionIsAutosaved,
      incrementVersionCount,
      setMostRecentVersionIsAutosaved,
    ],
  )

  return (
    <div className={baseClass}>
      {saving && t('general:saving')}
      {!saving && Boolean(lastUpdateTime) && (
        <React.Fragment>
          {t('version:lastSavedAgo', {
            distance: formatTimeToNow({ date: lastUpdateTime, i18n }),
          })}
        </React.Fragment>
      )}
    </div>
  )
}

/**
 * This module defines and exports a service that is used to retrieve the list of language models from the backend.
 * A service is a singleton object that provides a simple interface for performing backend-related tasks such as
 * sending or receiving data.
 */
import { toJSON } from '@utils/commons'
import { config, authFetch } from '@/config'
import type { JSONSettings, JSONResponse } from '@models/JSONSchema'
import type { LLMConfigDescriptor } from '@models/LLMConfig'
import LogService from '@services/LogService'

/*
 * Service used to get/set the language models providers settings.
 */
const LanguageModels = Object.freeze({
  getProviders: async () => {
    const endpoint = config.endpoints.allLLM

    return await authFetch(endpoint).then<LLMConfigDescriptor>(toJSON)
  },
  setProviderSettings: async (languageModelName: string, settings?: JSONSettings) => {
    const endpoint = config.endpoints.allLLM.concat(`${languageModelName}`)
    try {
      await authFetch(endpoint, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings ?? {})
      })

      LogService.print('Sending the language model settings to the cat')

      return {
        status: 'success',
        message: "Language model provider updated successfully"
      } as JSONResponse
    } catch (error) {
      return {
        status: 'error',
        message: "Language model provider couldn't be updated"
      } as JSONResponse
    }
  }
})

export default LanguageModels

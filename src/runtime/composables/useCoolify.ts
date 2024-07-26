// composables/useCoolify
import { ref } from 'vue'
import { ofetch } from 'ofetch'

export function useCoolify() {
  if (!process.env.COOLIFY_BASE_API_URL) {
    console.warn('COOLIFY_BASE_API_URL is not defined. Please define COOLIFY_BASE_API_URL in your environment variables.')
  }
  if (!process.env.COOLIFY_API_TOKEN) {
    console.warn('COOLIFY_API_TOKEN is not defined. Please define BASE_API_TOKEN in your environment variables.')
  }

  const api = ofetch.create({
    baseURL: '/api/_v1/_coolify',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  const useApi = (url: string, options = {}) => {
    const data = ref(null)
    const pending = ref(false)
    const error = ref('')

    const fetchData = async () => {
      pending.value = true
      try {
        const response = await api(url, {
          ...options, // Merge with any provided headers
          headers: {
            'Content-Type': 'application/json', // Set default content type header
            'Accept': 'application/json', // Ensure the response is expected to be JSON
            // We do not send any authorization headers here, as we are using the API token securely from within Nitro.
          },
        })
        data.value = response
      }
      catch (err: unknown) {
        if (err instanceof Error) {
          return error.value = err.message
        }
      }
      finally {
        pending.value = false
      }
    }

    fetchData()

    return { data, pending, error, refresh: fetchData }
  }

  const getHealthcheck = () => useApi('/authorisation/healthcheck')
  const enableAPI = (data: string) => useApi('/authorisation/enable', { method: 'GET', body: data })
  const disableAPI = () => useApi('/authorisation/disable', { method: 'GET' })
  const getVersion = () => useApi('/authorisation/version')
  const createResource = (data: string) => useApi('/resources/create', { method: 'POST', body: data })
  const listResources = () => useApi('/resources/list')
  const deleteResource = (resourceId: string) => useApi(`/resources/delete/${resourceId}`, { method: 'DELETE' })
  const disableResource = (resourceId: string) => useApi(`/resources/disable/${resourceId}`, { method: 'POST' })
  const listServers = () => useApi('/servers/list')
  const getServer = (uuid: string) => useApi(`/servers/${uuid}`, { method: 'GET' })
  const createServer = (data: string) => useApi('/servers/create', { method: 'POST', body: data })
  const updateServer = (uuid: string, data: string) => useApi(`/servers/${uuid}`, { method: 'POST', body: data })
  const deleteServer = (uuid: string) => useApi(`/servers/${uuid}`, { method: 'DELETE' })
  const getServerResources = (uuid: string) => useApi(`/servers/${uuid}/resources`, { method: 'GET' })
  const getServerDomains = (uuid: string) => useApi(`/servers/${uuid}/domains`, { method: 'GET' })
  const validateServer = (uuid: string) => useApi(`/servers/${uuid}/validate`, { method: 'GET' })

  return {
    getHealthcheck,
    enableAPI,
    disableAPI,
    getVersion,
    createResource,
    listResources,
    deleteResource,
    disableResource,
    getServer,
    listServers,
    createServer,
    updateServer,
    deleteServer,
    getServerResources,
    getServerDomains,
    validateServer,
  }
}

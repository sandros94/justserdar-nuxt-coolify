import { defineEventHandler, send, getRouterParams } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const params = await getRouterParams(event)
  // Default value for params.environment_name = 'production'
  const response = await $fetch(`${useRuntimeConfig().coolify.instances[`default`].baseUrl}/api/v1/projects/${params.uuid}/${params.environment_name}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${useRuntimeConfig().coolify.instances[`default`].apiToken}`,
    },
  })

  return send(event, JSON.stringify(response))
})

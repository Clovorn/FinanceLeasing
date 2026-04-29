export const handler = async (event) => {
  const { user } = JSON.parse(event.body || '{}')
  const existingRoles = user?.app_metadata?.roles || []

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        ...user?.app_metadata,
        roles: existingRoles.length ? existingRoles : ['viewer'],
      },
    }),
  }
}

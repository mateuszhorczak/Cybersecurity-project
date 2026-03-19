import { isAdmin } from '#server/jwtModule'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    if (query.token) {
      const result = isAdmin(query.token as string)
      return { data: result }
    }
  } catch (error) {
    console.error('Error processing request:', error)
  }
})

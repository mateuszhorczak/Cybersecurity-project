import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jwt-decode'
import { jwtDecode } from 'jwt-decode'

const SECOND = 1000

export function generateJwtToken(event: H3Event, payload: UserWithoutPassword) {
  const config = useRuntimeConfig(event)
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' })
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token)

    if (!decoded.exp) return true

    const currentTime = Math.floor(Date.now() / SECOND)
    return decoded.exp < currentTime
  } catch (e) {
    console.error('Invalid token', e)
    return true
  }
}

export function isAdmin(token: string): boolean {
  try {
    const payload = jwt.decode(token) as { isAdmin: boolean }
    if (!payload) return false
    return payload.isAdmin
  } catch (e) {
    console.error('Invalid token', e)
    return false
  }
}

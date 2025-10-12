import jwt from 'jsonwebtoken'
import type { VerifyOptions, Secret, PublicKey } from 'jsonwebtoken'

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            verifyToken: (token: string, secret: Secret | PublicKey, options: Partial<VerifyOptions>) => {
                return jwt.verify(token, secret, options)
            }
        }
    }
})
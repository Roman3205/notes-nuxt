import prisma from "~~/server/utils/db"
import userSchema from '~~/schemas/userSchema';

export default defineEventHandler(async (event) => {
    try {
        const body = await readValidatedBody(event, userSchema.parse)
        const hashedPassword = await genPassword(body.password)
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword
            }
        })

        const token = signToken(user.id)

        setCookie(event, 'app', token, {maxAge: 24 * 60 * 60 * 1000})

        return 'The user was created'
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw createError({
                statusCode: 409,
                message: 'Email with this address already used'
            })
        }
        throw error
    }
})
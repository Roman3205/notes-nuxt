import prisma from "~~/server/utils/db"
import userSchema from '~~/schemas/userSchema';
export default defineEventHandler(async (event) => {
    try {
        const body = await readValidatedBody(event, userSchema.parse)
        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!user) {
            throw createError({
                statusCode: 404,
                message: 'User with your email is not found'
            })
        }

        const passwordComparison = await comparePasswords(body.password, user.password)

        if (!passwordComparison) {
            throw createError({
                statusCode: 400,
                message: 'Password is not correct'
            })
        }

        const token = signToken(user.id)

        setCookie(event, 'app', token, {maxAge: 24 * 60 * 60 * 1000})

        return 'The login was successfull'
    } catch (error: any) {
        throw error
    }
})
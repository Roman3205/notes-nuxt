import prisma from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context
        const notesCount = await prisma.note.count({where: {userId: userId}})
        if (notesCount == 200) {
            throw createError({
                statusCode: 409,
                message: 'You are unable to create more than 200 notes.'
            })
        } 

        const note = await prisma.note.create({
            data: {
                text: '',
                userId: userId
            }
        })

        return note
    } catch (error) {
        throw error
    }
})
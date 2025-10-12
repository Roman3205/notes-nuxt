import prisma from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context
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
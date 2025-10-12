import prisma from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context
        const notes = await prisma.note.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'asc'
            },
            take: 200
        })

        return notes
    } catch (error) {
        throw error
    }
})
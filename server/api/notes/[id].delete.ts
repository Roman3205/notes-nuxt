import prisma from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context

        const id = getRouterParam(event, 'id')

        await prisma.note.delete({
            where: {id: Number(id), userId: userId}
        })

        return 'Deleted'
    } catch (error) {
        throw error
    }
})
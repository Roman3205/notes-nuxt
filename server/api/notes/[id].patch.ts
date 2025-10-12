import prisma from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context

        const body = await readBody(event)
        const id = getRouterParam(event, 'id')

        await prisma.note.update({
            where: {id: Number(id), userId: userId}, data: {
                text: body.updatedNote
            }
        })

        return 'Updated'
    } catch (error) {
        throw error
    }
})
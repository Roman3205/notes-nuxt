export default defineNuxtRouteMiddleware((to, from) => {
    try {
        if (import.meta.client) return
        const {$verifyToken} = useNuxtApp()
        const token = useCookie('app')

        if (!token.value) {
            return
        }

        const decoded = $verifyToken(token.value, process.env.JWT_SECRET as string, {})
        return navigateTo('/')
    } catch (error) {
        return
    }
})
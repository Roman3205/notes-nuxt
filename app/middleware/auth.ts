export default defineNuxtRouteMiddleware((to, from) => {
    try {
        if (import.meta.client) return
        const {$verifyToken} = useNuxtApp()
        const token = useCookie('app')

        if (!token.value) {
            return navigateTo('/login')
        }

        const decoded = $verifyToken(token.value, process.env.JWT_SECRET as string, {})
    } catch (error) {
        return navigateTo('/login')
    }
})
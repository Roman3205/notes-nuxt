import * as z from 'zod';

export default z.object({
    email: z.email(),
    password: z.string().min(8).max(64)
})
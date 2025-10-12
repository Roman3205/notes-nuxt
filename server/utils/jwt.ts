import jwt from 'jsonwebtoken';

export const signToken = (id: number) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET as string, {
        expiresIn: '1d'
    })
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string)
}
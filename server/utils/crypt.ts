import bcrypt from 'bcrypt';

export const genPassword = async (password: string) => {
    return bcrypt.hash(password, 10)
}

export const comparePasswords = async (password: string, storedPassword:string) => {
    return bcrypt.compare(password, storedPassword)
}
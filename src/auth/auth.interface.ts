export interface TokenPayload {
    sub: string,
    exp: number,
    iat: number,
    iss: string,
    username: string
}
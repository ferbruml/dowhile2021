import axios from "axios"
import prismaClient from "../prisma"
import { sign } from "jsonwebtoken"

interface IAccesTokenResponse {
    access_token: string
}

interface IUserReponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string,
}

class AuthenticateUserService {
    async execute(code: string) {
        const url = 'https://github.com/login/oauth/access_token'

        const { data: accessTokenResponse } = await axios.post<IAccesTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json" // estamos explicitando que esperamos o corpo da resposta em formato json
            }
        })

        const response = await axios.get<IUserReponse>('https://api.github.com/user', {
            headers: {
            authorization: `Bearer ${accessTokenResponse.access_token}`
        }
        })

        const { login, id, avatar_url, name } = response.data

        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        })

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login: login,
                    avatar_url: avatar_url,
                    name: name
                }
            })
        }

        const token = sign(
            {
                user: user.name,
                avatar_url: avatar_url,
                id: user.id
            },
            process.env.JWT_TOKEN,
            {
                subject: user.id,
                expiresIn: '1d'
            }
        )

        //return response.data // quando usamos o axios, toda info é retornada dentro do data da Response

        return { token, user }
    }
}

export { AuthenticateUserService }
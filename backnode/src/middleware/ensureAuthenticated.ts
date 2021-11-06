import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
    sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization

    if (!authToken) {
        return response.status(401).json({ // aqui estamos retornando um json para avisar do token inválido, por isso o erro 401; assim o user consegue tomar alguma ação
            errorCode: "token.invalid"
        })
    }

    // formato do token: Bearer 895984794385029830189, então estamos pegando somente o token em si e ignorando a 1a posição
    const [ ,token] = authToken.split(" ")

    try {
        // sub é o id do user
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayload // vamos verificar o se token é válido
        request.user_id = sub

        return next() // tudo ok, então vamos repassar este middleware para a frente
    }
    catch(err){
        return response.status(401).json({ errorCode: "token.expired" })
    }
}


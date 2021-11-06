import { Request, Response } from 'express'
import { ProfileUserService } from '../serivces/ProfileUserService'

class ProfileUserController {
    async handle(request: Request, response: Response){
        const { user_id } = request

        const service = new ProfileUserService()

        const result = service.execute(user_id)

        return response.json(result)
    }
}

export { ProfileUserController }
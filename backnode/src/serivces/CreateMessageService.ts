import { io } from '../app'
import prismaClient from '../prisma'

class CreateMessageService {
    async execute(text: string, user_id: string) {
        const message = await prismaClient.message.create({
            data: {
                text,
                user_id,
            },
            include: { // colocamos o include quando queremos retornar não apenar o que está em data, mas sim outras infos da base de dados tb
                user: true
            }
        })

        const infoWS = {
            text: message.text,
            user_id: message.user_id,
            created_at: message.created_at,
            user: {
                name: message.user.name,
                avatar: message.user.avatar_url,
            }
        }

        io.emit('new_message', infoWS)

        return message
    }
}

export { CreateMessageService }
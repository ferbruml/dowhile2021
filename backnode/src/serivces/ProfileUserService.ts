import prismaClient from "../prisma"

class ProfileUserService {
    async execute(user_id: string){ // como o user já estará autenticado, então teremos o id
        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id,
            }
        })

        return user
    }
}

export { ProfileUserService }
import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router()

router.post("/authenticate", new AuthenticateUserController().handle) // aqui estamos instanciando e já chamando o método handle; não precisamos passar os params request e response pq, como estamos dentro da própria rota, então ela funciona como um middleware e o express já consegue passar automaticamente eles para o método

router.post(
    '/messages', 
    ensureAuthenticated, 
    new CreateMessageController().handle)

router.get('/messages/last3', new CreateMessageController().handle)

router.get('/profile', ensureAuthenticated, new ProfileUserController().handle)

export { router }
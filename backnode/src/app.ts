import 'dotenv/config'
import express, { response } from 'express';
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

import { router } from './routes'

const app = express();
app.use(cors()) // permite as conexões via http de qualquer fonte externa

const serverHttp = http.createServer(app) // quando o http server subir, a aplicação sobe junto

const io = new Server(serverHttp, {
    cors: {
        origin: '*' // permite qualquer fonte externa se conectar via websocket ( front, mobile, ... )
    }
})

// emitir e/ou escutar eventos
io.on('connection', socket => {
    console.log(`User conectado no socket ${socket.id}`)
})

app.use(router)
app.use(express.json()) // precisamos dizer para o express que aceitamos o body em formato json

app.get('/github', (request, response) => {
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})

app.get('/signin/callback', (request, response) => {
    const { code } = request.query

    return response.json(code)
})

export { serverHttp, io }
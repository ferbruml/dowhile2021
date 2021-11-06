declare namespace Express { // Express é o nome da biblioteca que queremos adicionar os tipos
    export interface Request { // dentro dessa biblioteca, qual é a interface que eu quero inserir os tipos ( no caso, user_id )
        user_id: string 
    }
}

// a ideia, então, é o Express pegar tudo o que já existe no Request e adicionar a nossa var tb
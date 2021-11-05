import { useContext, useState, FormEvent } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../contexts/auth'
import { api } from '../../services/api'
import styles from './styles.module.scss'

export function SendMessageForm() {
    const { user, signOut } = useContext(AuthContext)
    const [message, setMessage] = useState('')

    async function handleSendMessage(event: FormEvent) { // como esta função está sendo chamada no onSubmit, ela recebe todos os params que o onSubmit receberia
        event.preventDefault() // impede o comportamento default do onSubmit, q é redirecionar para algum lugar ( com action ) ou fazer o reload da página ( sem o atributo action )

        if (!message.trim()) {
            return
        }

        await api.post('messages', { message })

        setMessage('')
    }
    
    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size='32' />
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Mensagem</label>
                <textarea 
                    name="message" 
                    id="message" 
                    placeholder="Qual sua expectativa para o evento?"
                    onChange={event => setMessage(event.target.value)}
                    value={message} // caso message seja alterado sem ser pelo onChange ( user digitando ), pegamos essa alteração tb aqui
                />

                <button type="submit">Enviar mensagem</button>
            </form>
        </div>
    )
}
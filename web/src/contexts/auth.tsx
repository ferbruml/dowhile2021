import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string,
    name: string,
    login: string,
    avatar_url: string,
}

type AuthContextData = {
    user: User | null,
    signInURL: string,
    signOut: () => void,
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
    children: ReactNode // ReactNode: é qualquer coisa aceitável pelo react ( um outro componente, um html, um número, etc )
}

type AuthReponse = {
    token: string,
    user: {
        id: string,
        avatar_url: string,
        name: string,
        login: string,
    }
}

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null)

    const signInURL = `https://github.com/login/oauth/authorize?scope=user&client=_id={}`

    async function signIn(githubCode: string) {
        const response = await api.post<AuthReponse>('authenticate', {
            code: githubCode,
        })

        const { token, user } = response.data

        localStorage.setItem('@dowhile:token', token)

        api.defaults.headers.common.authorization = `Bearer ${token}` // seta o token para todas as requests

        setUser(user)
    }

    function signOut() {
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}` // seta o token para todas as requests

            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }
    }, [])

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const [ urlWithoutCode, githubCode ] = url.split('?code=')
            
            //console.log({ urlWithoutCode, githubCode })

            window.history.pushState({}, '', urlWithoutCode) // forçar o redirect do user para ele não ver o githubcode na url
        }
    }, [])

    return (
        <AuthContext.Provider value={{ signInURL, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}
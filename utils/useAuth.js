import useSwr from 'swr'
import http from '../config/axios'
import { message } from 'antd'
import { useRouter } from 'next/router'


const useAuth = () => {
    const router = useRouter();
    const { API } = http()


    const { data: user, mutate } = useSwr('/api/me', () => API.get('/api/me').then(res => res.data.user))
    const login = async (credentials, setError) => {
        const run = message.loading({ content: 'Logging in...', key: 'login' })
        const { email, password } = credentials
        API.post('/api/login', { email, password })
            .then(res => {
                run()
                if (res.data) {
                    message.success({ content: 'Login successful', key: 'login', duration: 2 })
                    mutate('/api/me')
                    router.push('/chat')
                }

            })
            .catch(err => {
                if (err) {
                    setError(err.response.data.error)
                    message.error({ content: err.response.data.error, key: 'login', duration: 5 })
                }
            })
    }

    const register = (credentials, setError, setSuccess, setLoading) => {
        setLoading(true)
        const { email, password, name, avatar, confirmPassword, gender } = credentials
        const run = message.loading({ content: 'Registering...', key: 'register' }, 0)

        API.post('/api/register', { email, password, name, avatar, confirmPassword, gender })
            .then(res => {
                run()
                if (res.data.success) {
                    setLoading(false)
                    setSuccess(res.data.success)
                    message.success({ content: 'Registration Successful', key: 'register', duration: 2 })

                }

            })
            .catch(err => {
                if (err) {
                    setError(err.response.data.error)
                    setLoading(false)
                }
                run()
                message.error({ content: 'Registration Failed', key: 'register', duration: 5 })
            })
    }



    const logout = async () => {
        await API.post('/api/logout')
        router.reload()
        mutate(null)

    }

    const setStatus = async (status) => {
        await API.post('/api/status', { status })
        mutate()
    }

    return {
        user,
        login,
        logout,
        register,
        setStatus

    }
}

export default useAuth;
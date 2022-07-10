import http from '../../config/axios'
import { useEffect } from 'react'
import Chat from '../../components/Chat/index'

export default function ChatPage() {
    return (
        <div>
            <Chat />
        </div>
    )
}


export async function getServerSideProps({ req }) {
    const token = req.cookies.token
    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    return {
        props: {}
    }


}
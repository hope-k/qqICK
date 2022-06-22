import http from '../../config/axios'
import { useEffect } from 'react'


export default function Chat() {
    const { API } = http();
    useEffect(() => {
        API.get('/api/chats').then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    });
    return (
        <div className='text-red-700'>
            CHAT
        </div>
    )
}
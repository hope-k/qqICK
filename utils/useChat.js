import React from 'react'
import http from '../config/axios'
import useSWR from 'swr';

const useChat = (setChatLoading) => {

    const { API } = http();
    const { data: chats, mutate, } = useSWR(`/api/chat/index`, () => API.get('/api/chat/index').then(res => { setChatLoading(false); return res.data.chats }))

    const accessChat = async (receiverId, setSelectedChat) => {
        API.post('/api/chat/create', { receiverId }).then(res => { setSelectedChat(res.data.chat); mutate() }).catch(err => { console.log(err.response.data.error) })
    }

    return {
        accessChat,
        chats

    }

}

export default useChat;
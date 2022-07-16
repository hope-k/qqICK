import { message } from 'antd'
import useSWR, { useSWRConfig } from 'swr'
import http from '../config/axios'
import { useEffect, useState } from 'react'
import Notification from '../hooks/notification'
import useAuth from '../hooks/useAuth'


export default function useMessage(chatId, setLoadingMessages, socket, selectedChat, setUpdatedMessages, isNotification) {
    const { mutate } = useSWRConfig()
    const [recipientData, setRecipientData] = useState([])
    const { API } = http();
    const { user: currentUser } = useAuth()
    useEffect(() => {
        socket?.emit('join chat', chatId)
    }, [chatId])

    const { data: messages } = useSWR('/api/message/chatId', () => API.get(`/api/message/${selectedChat?._id}`).then(res => {
        setUpdatedMessages(res.data.messages);
        setLoadingMessages(false);
        return res.data.messages
    }), { revalidate: true, revalidateIfStaleData: true, revalidateOnFocus: true })

    const sendMessage = async (message, socket) => {
        try {
            const { text, chatId } = message
            const { data } = await API.post('/api/message/send', { text, chatId })
            const newMessageData = { message: data?.message, currentUser: currentUser }
            socket?.emit('stop typing', selectedChat?._id)
            socket?.emit('send message', newMessageData)
            mutate('/api/message/chatId')


        } catch (err) {
            Notification(err.response.data.error, 'error')

        }

    }

    if (isNotification) {
        const { user: currentUser } = useAuth()
        const user = selectedChat?.users?.filter(user => user !== currentUser?._id)[0]
        API.get(`/api/user/${user}`).then(res => { setRecipientData(res.data.user) }).catch(err => console.log(err.response?.data?.error))
        console.log(recipientData, 'recipientData')


    }




    return {
        recipientData,
        messages,
        sendMessage
    }

};

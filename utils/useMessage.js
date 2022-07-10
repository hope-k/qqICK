import useSWR, { useSWRConfig } from 'swr'
import http from '../config/axios'
import { useEffect, useState } from 'react'

export default function useMessage(chatId, setLoadingMessages, socket, selectedChat, setUpdatedMessages) {
    const { mutate } = useSWRConfig()
    const { API } = http();
    useEffect(() => {
        socket?.emit('join chat', chatId)
    }, [chatId])

    const { data: messages } = useSWR('/api/message/chatId', () => API.get(`/api/message/${selectedChat?._id}`).then(res => {
        setUpdatedMessages(res.data.messages);
        setLoadingMessages(false);
        return res.data.messages
    }))

    const sendMessage = async (message, setSendMessageError, socket) => {
        try {
            const { text, chatId } = message
            const { data } = await API.post('/api/message/send', { text, chatId })
            const newMessage = data?.message
            socket?.emit('stop typing', selectedChat?._id)
            socket?.emit('send message', newMessage)

            mutate('/api/message/chatId')


        } catch (err) {
            if (err) {
                setSendMessageError(err?.response?.data?.error)
            }
        }

    }
    return {
        messages,
        sendMessage
    }

};

import { useNotifications } from '../context/notifications'
import { useSWRConfig } from 'swr'
import http from '../config/axios'
import useAuth from './useAuth'
import React, { useEffect, useState } from 'react'
import { useSocket } from '../context/socket'


export default function chatLogic() {
    const { mutate } = useSWRConfig()
    const { notifications } = useNotifications()
    const { API } = http()


    const unreadMessagesForChat = (chat) => {
        // getting all unread messages for a chat
        const unreadMessages = notifications?.filter(notification => {
            return notification?.message?.chat?._id === chat?._id
        })
        return unreadMessages?.length
    }
    const clearUnreadMessages = (selectedChat) => {
        // clearing all unread messages for a chat
        const unreadMessages = notifications?.filter(notification => {
            return notification?.message?.chat?._id === selectedChat?._id
        })
        unreadMessages?.forEach(notification => {
            API.delete(`/api/notifications/${notification?._id}`)
        })
        mutate('/api/notifications/index')
    }



    return {
        unreadMessagesForChat,
        clearUnreadMessages,
    }

};

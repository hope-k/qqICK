import React, { useState, useContext, createContext, useEffect } from 'react'
import useSWR from 'swr'
import http from '../config/axios'
const NotificationsContext = createContext()
import useAuth from '../hooks/useAuth'

export default function NotificationsProvider({ children }) {
    const { user: currentUser } = useAuth()
    const { API } = http()
    const { data: notifications, mutate } = useSWR('/api/notifications/index', () => API.get('/api/notifications/index').then(res => res.data.notifications).catch(err => console.log(err)))

    const setNotifications = async (message) => {
        //recipients of the notification
        console.log('BEFORE', message?.chat?.users)
        const users = message?.chat?.users?.filter(u => u._id === currentUser?._id)
            console.log('AFTER FILTER', users)
        API.post('/api/notifications/create', { message, users })
        mutate()
    }

    return (
        <NotificationsContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationsContext.Provider>
    )
}


export function useNotifications() {
    return useContext(NotificationsContext)
}
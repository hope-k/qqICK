import React, { useState, useContext, createContext, useEffect } from 'react'
import useSWR from 'swr'
import http from '../config/axios'
const NotificationsContext = createContext()

export default function NotificationsProvider({ children }) {
    const { API } = http()
    const { data: notifications, mutate } = useSWR('/api/notifications/index', () => API.get('/api/notifications/index').then(res => res.data.notifications).catch(err => console.log(err)))

    const setNotifications = async (message) => {
        API.post('/api/notifications/create', { message })
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
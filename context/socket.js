import io from 'socket.io-client'
import { createContext, useEffect, useState, useContext } from 'react'


export const SocketContext = createContext()


export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState()
    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL)
        setSocket(newSocket)
        return () => newSocket.close() 
    },[])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    return useContext(SocketContext)
}
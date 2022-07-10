import React, { useEffect, useState, useRef, useContext } from 'react'
import {
    ChatContainer,
    ConversationHeader,
    MessageList,
    MessageSeparator,
    Message,
    MessageGroup,
    Avatar,
    AvatarGroup,
    TypingIndicator,
    Loader,
    MessageInput,


} from '@chatscope/chat-ui-kit-react'
import { AiOutlineEdit } from 'react-icons/ai'
import useAuth from '../../utils/useAuth'
import useMessage from '../../utils/useMessage'
import { message, notification } from 'antd'
import chatLogic from '../../utils/chatLogic'
import { useSWRConfig } from 'swr'
import { useSocket } from '../../context/socket'
import moment from 'moment'
import { useNotifications } from '../../context/notifications'


const Messages = ({
    selectedChat,
    showGroupUpdateModal,
    setSelectedChat,

}) => {
    const socket = useSocket()
    const [socketConnected, setSocketConnected] = useState(false)
    const [userTypingName, setUserTypingName] = useState('')
    const [chatId, setChatId] = useState('')
    const { notifications, setNotifications, setLiveNotification, liveNotification } = useNotifications()
    const { user: currentUser } = useAuth()
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [updatedMessages, setUpdatedMessages] = useState([])
    const [sendMessageError, setSendMessageError] = useState(null)
    const { messages, sendMessage } = useMessage(chatId, setLoadingMessages, socket, selectedChat, setUpdatedMessages, setSendMessageError);
    const [messageInputValue, setMessageInputValue] = useState('')
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const { isSameSender } = chatLogic()
    const { mutate } = useSWRConfig()
    const [liveMessage, setLiveMessage] = useState(null)
    const [roomDetails, setRoomDetails] = useState('')

    const { clearUnreadMessages } = chatLogic()
    useEffect(() => {
        mutate('/api/message/chatId')
    }, [chatId])
    useEffect(() => {
        if (selectedChat) {
            setChatId(selectedChat?._id)
        }
    }, [selectedChat?._id])

    useEffect(() => {
        clearUnreadMessages(selectedChat)
    }, [selectedChat])




    useEffect(() => {
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', (room) => {
            setRoomDetails(room)
        })
        socket.on('stop typing', () => setIsTyping(false))
        socket.on('message received', (newMessage) => {
            setLiveMessage(newMessage)
        })

    }, [])
    useEffect(() => {
        if (currentUser) {
            socket.emit('setup', currentUser)
        }
        return () => socket.off('setup')
    }, [currentUser])

    //check if user is typing in the selected chat
    useEffect(() => {
        if (roomDetails && roomDetails.id === chatId) {
            setIsTyping(true);
            setUserTypingName(roomDetails.senderName)
        }
    }, [roomDetails])











    const message = {
        chatId,
        text: messageInputValue
    }


    useEffect(() => {
        if (sendMessageError) {
            message?.error(sendMessageError)
        }
    }, [sendMessageError])










    useEffect(() => {
        notifications && console.log('notifications', notifications)
    }, [notifications])


    useEffect(() => {
        if (liveMessage?.chat?._id === selectedChat?._id) {
            updatedMessages.push(liveMessage)
            setLiveMessage(null)
            mutate('/api/message/chatId')
        } else {
            return
        }
    }, [selectedChat?._id, liveMessage])


    const sendYourMessage = (event) => {
        if (event.key === 'Enter') {
            if (!messageInputValue) { return }
            setIsTyping(false)
            sendMessage(message, setSendMessageError, socket)
            setMessageInputValue('')
        }
    }


    const typingHandler = (val) => {
        //typing state for every single key stroke
        setMessageInputValue(val)
        //check if socket connected meaning if the user has a messaged open in chat since that triggers a socket connection
        if (!socketConnected) { return }
        if (!typing) {
            const room = { id: chatId, senderName: currentUser?.name }
            socket.emit('typing', room)
            setTyping(true)
        }
        const lastTypingTime = new Date().getTime()
        const timerLength = 5000;
        setTimeout(() => {
            const timeNow = new Date().getTime()
            const timeDifference = timeNow - lastTypingTime
            if (timeDifference >= timerLength && !typing) {
                socket.emit('stop typing', chatId)
                setTyping(false)
            }
        }, timerLength)
    }
    const recipient = selectedChat?.users?.filter(u => u?.email !== currentUser?.email)[0]













    return (
        <ChatContainer className=' ' >

            <ConversationHeader >
                <ConversationHeader.Back onClick={() => setSelectedChat(null)} />
                {
                    selectedChat?.isGroupChat ? (
                        <AvatarGroup size="xs">
                            {
                                selectedChat?.users?.slice(0, 9)?.map((user) => (
                                    <Avatar
                                        src={user?.avatar || (user?.gender === 'male' ? '/defaultmaleavatar.png' : '/defaultfemaleavatar.png')}
                                    />
                                ))
                            }
                        </AvatarGroup>
                    ) : (

                        <Avatar
                            status={recipient?.status}
                            src={recipient?.avatar || (recipient?.gender === 'male' ? '/defaultmaleavatar.png' : (recipient?.gender === 'female' && '/defaultfemaleavatar.png'))}
                            name={selectedChat?.users?.filter(u => u.email !== currentUser?.email)[0]?.name}

                        />
                    )
                }

                <ConversationHeader.Content className='capitalize text-purple-400' userName={recipient?.name} info={selectedChat?.isGroupChat ? 'Group' : (recipient?.status === 'available' ? 'Active' : `Active ${moment(recipient?.updatedAt).fromNow()}`)} />
                <ConversationHeader.Actions><div className='bg-purple-200 p-1 rounded-lg'><AiOutlineEdit onClick={() => showGroupUpdateModal()} className='text-purple-600 text-2xl cursor-pointer' /></div></ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList autoScrollToBottomOnMount={true} typingIndicator={isTyping ? <TypingIndicator className='capitalize' content={`${userTypingName} is typing`} /> : <></>}>
                <MessageSeparator content="Saturday, 30 November 2019" />
                {
                    loadingMessages || !messages ? (
                        <div className='flex justify-center items-center h-full'>
                            <Loader />
                        </div>
                    ) :
                        (
                            updatedMessages?.map((message, index) => (
                                <div>
                                    <Message className='mb-10' model={{
                                        message: message?.text,
                                        sentTime: "just now",
                                        sender: message?.sender?.name,
                                        direction: message?.sender?._id === currentUser?._id ? 'outgoing' : 'incoming',
                                        position: 'single',


                                    }} avatarPosition="cl">
                                        {
                                            message?.sender?._id !== currentUser?._id && (
                                                <Avatar

                                                    src={message?.sender?.avatar || (message?.sender?.gender === 'male' ? '/defaultmaleavatar.png' : '/defaultfemaleavatar.png')} name={message?.sender?.name} />

                                            )
                                        }
                                        <Message.Footer sender={message?.sender?.name} sentTime={moment(message?.createdAt).fromNow()} />

                                    </Message>

                                </div>
                            )
                            )

                        )
                }
            </MessageList>
            <MessageInput placeholder="Type message here" value={messageInputValue} onChange={typingHandler} onKeyDown={sendYourMessage} />
        </ChatContainer>
    )
}

export default Messages
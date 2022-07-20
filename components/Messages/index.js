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
import { AiOutlineEdit, AiFillEye } from 'react-icons/ai'
import useAuth from '../../hooks/useAuth'
import useMessage from '../../hooks/useMessage'
import { message, notification } from 'antd'
import chatLogic from '../../hooks/chatLogic'
import { useSWRConfig } from 'swr'
import { useSocket } from '../../context/socket'
import moment from 'moment'
import { useNotifications } from '../../context/notifications'


const Messages = ({
    selectedChat,
    showGroupUpdateModal,
    setSelectedChat,
    isNotification,


}) => {
    const socket = useSocket()
    const [socketConnected, setSocketConnected] = useState(false)
    const [userTypingName, setUserTypingName] = useState('')
    const [chatId, setChatId] = useState('')
    const { notifications, setNotifications } = useNotifications()
    const { user: currentUser } = useAuth()
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [updatedMessages, setUpdatedMessages] = useState([])
    const { messages, sendMessage, recipientData } = useMessage(chatId, setLoadingMessages, socket, selectedChat, setUpdatedMessages, isNotification);
    const [messageInputValue, setMessageInputValue] = useState('')
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const { mutate } = useSWRConfig()
    const [liveMessage, setLiveMessage] = useState(null)
    const [roomDetails, setRoomDetails] = useState('')

    const { clearUnreadMessages } = chatLogic()
    useEffect(() => {
        mutate('/api/message/chatId')
        mutate('/api/me')
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

        if (liveMessage?.chat?._id === selectedChat?._id) {
            updatedMessages.push(liveMessage)
            mutate('/api/message/chatId')
        }

    }, [selectedChat?._id, liveMessage])




    const sendYourMessage = (event) => {
        if (event.key === 'Enter') {
            if (!messageInputValue) { return }
            setIsTyping(false)
            sendMessage(message, socket)
            setMessageInputValue('')
        }
    }

    const sendMessageIconHandler = () => {
        setIsTyping(false)
        sendMessage(message, socket)
        setMessageInputValue('')
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
    const latestMessage = selectedChat?.latestMessage
    // check if latest message date is less than 24 hours ago
    const isRecent = moment(latestMessage?.createdAt).isAfter(moment().subtract(24, 'hours'))














    return (
        <div className='w-full '>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Back className='p-1' onClick={() => setSelectedChat(null)} />
                    {
                        selectedChat?.isGroupChat ?
                            (
                                <Avatar
                                    src={selectedChat?.groupImage || '/groupavatar.jpg'}
                                />

                            ) :
                            (

                                <Avatar
                                    status={recipient?.status || recipientData?.status}
                                    src={recipient?.avatar || recipientData?.avatar || ((recipient?.gender === 'male' || recipientData?.gender === 'male') ? '/defaultmaleavatar.png' : ((recipient?.gender === 'female' || recipientData?.gender === 'female') && '/defaultfemaleavatar.png'))}
                                    name={selectedChat?.users?.filter(u => u.email !== currentUser?.email)[0]?.name || recipientData?.name}

                                />
                            )
                    }
                    <ConversationHeader.Content className='capitalize text-purple-400' userName={selectedChat?.isGroupChat ? selectedChat?.chatName : !selectedChat?.isGroupChat && (recipient?.name || recipientData?.name)} info={selectedChat?.isGroupChat ? 'Group' : (recipient?.status === 'available' || recipientData?.status === 'available' ? 'Active' : `Active ${moment(recipient?.updatedAt).fromNow()}` || `Active ${moment(recipientData?.updatedAt).fromNow()}`)} />
                    <ConversationHeader.Actions><div className='bg-purple-200 p-1 rounded-lg'>{selectedChat?.isGroupChat ? <AiOutlineEdit onClick={() => showGroupUpdateModal()} className='text-purple-600 text-2xl cursor-pointer' /> : <AiFillEye onClick={() => showGroupUpdateModal()} className='text-purple-600 text-2xl cursor-pointer' />}</div></ConversationHeader.Actions>
                </ConversationHeader>

           


                
                <MessageList scrollBehavior="smooth" autoScrollToBottomOnMount={true} typingIndicator={isTyping ? <TypingIndicator className='capitalize' content={`${userTypingName} is typing`} /> : <></>}>



                    {

                        loadingMessages || !messages ? (
                            <div className='flex justify-center items-center h-full'>
                                <Loader />
                            </div>
                        ) :
                            (
                                updatedMessages?.map((message, index) => {
                                    
                                    return (
                                        <div>
                                            {
                                                (latestMessage?._id === message?._id) && (!isRecent && <MessageSeparator content={moment(latestMessage?.createdAt).format('LLL')} />)

                                            }
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
                                })

                            )
                    }
                </MessageList>
                <MessageInput className='' autoFocus attachButton={false} onSend={sendMessageIconHandler} placeholder="Type message here" value={messageInputValue} onChange={typingHandler} onKeyDown={sendYourMessage} />
            </ChatContainer>
        </div>
    )
}

export default Messages
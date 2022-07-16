import React, { useEffect, useState } from 'react'
import {
    Conversation,
    ConversationList,
    Avatar,
    AvatarGroup,
    ChatContainer,
    MessageList

} from '@chatscope/chat-ui-kit-react'
import useAuth from '../../hooks/useAuth'
import moment from 'moment'
import { useSWRConfig } from 'swr'
import { useNotifications } from '../../context/notifications'
import { useSocket } from '../../context/socket'
import chatLogic from '../../hooks/chatLogic'
import { RiInvisionLine } from 'react-icons/ri'


const Conversations = ({
    onlyUserChats,
    onlyGroupChats,
    selectedChat,
    setSelectedChat,
}) => {
    const socket = useSocket();
    const { notifications, setNotifications } = useNotifications();
    const { user: currentUser } = useAuth();
    const [liveMessage, setLiveMessage] = useState();
    const { unreadMessagesForChat } = chatLogic()

    const { mutate } = useSWRConfig()
    useEffect(() => {
        mutate('/api/chat/index')
    }, [selectedChat])

    useEffect(() => {
        if (currentUser) {
            socket?.emit('setup', currentUser)
        }
        return () => {
            socket?.off('setup')

        }
    }, [currentUser])







    useEffect(() => {
        socket?.on('message received', (newMessage) => {
            setLiveMessage(newMessage)
        })
    }, [])



    useEffect(() => {
        if (!selectedChat || selectedChat?._id !== liveMessage?.chat?._id) {
            if (!liveMessage) {
                return
            }
            setNotifications(liveMessage)
            mutate('/api/notifications/index')

        } else {
            setLiveMessage(null)
        }

    }, [selectedChat, liveMessage])

    useEffect(() => {
        mutate('/api/notifications/index')
    }, [notifications])







    return (
        <div>
            <ConversationList className='hover:bg-slate-200 duration-700 rounded-3xl '>
                {
                    (!onlyGroupChats?.length && !onlyUserChats?.length) && (
                        <div className='w-full h-screen md:hidden  flex items-center justify-center '>
                            <ChatContainer className='overflow-hidden  h-screen w-full bg-red-500'>
                                <MessageList>
                                    <MessageList.Content className='flex flex-col justify-center items-center h-full w-full text-base bg-slate-100 rounded-3xl'>
                                        Start Conversations
                                    </MessageList.Content>
                                </MessageList>
                            </ChatContainer>
                        </div>
                    )
                }
                {
                    onlyGroupChats?.map(chat => (
                        <Conversation unreadCnt={unreadMessagesForChat(chat)} className={' m-2 duration-150  rounded-xl flex justify-center items-center ' + ((selectedChat === chat) && 'bg-slate-200 ')} onClick={() => { setSelectedChat(chat); mutate('/api/message/chatId') }} name={chat?.chatName} lastSenderName={chat?.latestMessage?.sender?.name} info={chat?.latestMessage?.text} lastActivityTime={<span className='text-xs font-thin'>{moment(chat?.latestMessage?.createdAt).fromNow()}</span>}>
                            <Avatar src={chat?.groupImage || '/groupavatar.jpg'} className='flex justify-center items-center' />
                        </Conversation>

                    ))
                }
                {

                    onlyUserChats?.map(chat => {
                        const recipient = chat?.users?.filter(u => u?.email !== currentUser?.email)[0]
                        return (
                            <Conversation unreadCnt={unreadMessagesForChat(chat)} className={' m-2 duration-150  rounded-xl flex justify-center items-center ' + ((selectedChat === chat) && 'bg-slate-200 ')} onClick={() => setSelectedChat(chat)} name={recipient?.name} lastSenderName={chat?.latestMessage?.sender?.name} info={chat?.latestMessage?.text} lastActivityTime={<span className='text-xs font-thin'>{moment(chat?.latestMessage?.createdAt).fromNow()}</span>}>
                                <Avatar
                                    className='duration-200'
                                    status={recipient?.status}
                                    src={recipient?.avatar || (recipient?.gender === 'male' ? '/defaultmaleavatar.png' : '/defaultfemaleavatar.png')} name={recipient?.name} />
                            </Conversation>

                        )
                    })

                }
            </ConversationList>
        </div>
    )
}

export default Conversations
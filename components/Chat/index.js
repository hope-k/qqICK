import http from '../../config/axios'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Modal } from 'antd';
import { useSWRConfig } from 'swr'
import {useRouter} from 'next/router'
import {
    MainContainer,
    Search,
    ConversationList,
    ConversationHeader,
    Conversation,
    Avatar,
    MessageSeparator,
    MessageList,
    ChatContainer,
    Sidebar,
    Message,
    ExpansionPanel,
    TypingIndicator,
    MessageInput,
    Button,
    AddUserButton,
    AvatarGroup
} from '@chatscope/chat-ui-kit-react'
import gsap from 'gsap'
import { BsBell } from 'react-icons/bs'
import { RiArrowDownSLine } from 'react-icons/ri'
import Skeleton from 'react-loading-skeleton'
import useChat from '../../utils/useChat'
import useAuth from '../../utils/useAuth'
import { MdGroupAdd } from 'react-icons/md'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { message } from 'antd'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import CreateGroupModal from '../Modals/CreateGroupModal';
import UpdateGroupModal from '../Modals/UpdateGroupModal';
import Header from '../Header';
import SearchList from '../SearchList';
import Conversations from '../Conversations';
import Messages from '../Messages';
import Notification from '../../utils/notification';


export default function Chat() {
    const router = useRouter()
    const { mutate } = useSWRConfig()
    const [chatLoading, setChatLoading] = useState(true)
    const { chats, accessChat } = useChat(setChatLoading);
    const { user: currentUser } = useAuth();
    const [selectedChat, setSelectedChat] = useState();
    const [searchLoading, setSearchLoading] = useState(false)
    const { API } = http();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [groupName, setGroupName] = useState('');
    const [createGroupSuccess, setCreateGroupSuccess] = useState(false);
    const [isNotification, setIsNotification] = useState(false);
    const [groupImage, setGroupImage] = useState('')
    const [updateGroupImage, setUpdateGroupImage] = useState('')
    const [createGroupError, setCreateGroupError] = useState(null)
    const [groupUpdateSuccess, setGroupUpdateSuccess] = useState(false)
    const [groupUpdateError, setGroupUpdateError] = useState(null);



    const searchAllUsers = (search) => {
        setSearchLoading(true)
        API.get(`/api/users?search=${search}`).then(res => { setUsers(res.data.users); setSearchLoading(false) }).catch((err) => setError(err.response?.data?.error))
    }

    const [groupSearch, setGroupSearch] = useState('');
    const [groupSearchLoading, setGroupSearchLoading] = useState('');

    const searchAllUsersForGroup = () => {
        setGroupSearchLoading(true)
        API.get(`/api/users?search=${groupSearch}`).then(res => { setUsers(res.data.users); setGroupSearchLoading(false) }).catch((err) => setError(err.response?.data?.error))
    }
    useEffect(() => {
        searchAllUsers(search)
    }, [search])

    useEffect(() => {
        searchAllUsersForGroup(groupSearch)
    }, [groupSearch])

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [usersToAdd, setUsersToAdd] = useState([]);

    const addUserToGroup = (user) => {
        if (!usersToAdd.includes(user)) {
            setUsersToAdd([...usersToAdd, user])
        }
    }

    const removeUser = (user) => {
        setUsersToAdd(usersToAdd.filter(u => u !== user))
    }

    const createGroup = () => {
        message.loading({ content: 'Creating group...', key: 'create-group' })
        API.post('/api/group-chat/create', { users: usersToAdd, groupName, groupImage: groupImage }).then(res => { setIsModalVisible(false); setUsersToAdd([]); setGroupName(''); setGroupImage(''); setCreateGroupSuccess(true); mutate('/api/chat/index') }).catch(err => { console.log(err.response.data.error); setCreateGroupError(err.response.data.error) })


    }

    useEffect(() => {
        if (createGroupSuccess) {
            message.success({ content: 'Group created successfully', key: 'create-group' })
            setCreateGroupSuccess(false)
        }
    }, [createGroupSuccess])

    useEffect(() => {
        if (createGroupError) {
            message.error({ content: createGroupError, key: 'create-group' })
            setCreateGroupError(null)
        }
    }, [createGroupError])

    const onlyGroupChats = chats && chats?.filter(c => c.isGroupChat === true)
    const onlyUserChats = chats && chats?.filter(c => c.isGroupChat === false)

    const [updateGroupUsers, setUpdateGroupUsers] = useState([]);
    const [updateGroupName, setUpdateGroupName] = useState('');
    const [isUpdateGroupModalVisible, setIsUpdateGroupModalVisible] = useState(false);
    const showGroupUpdateModal = () => {
        setUpdateGroupUsers(selectedChat?.users)
        setIsUpdateGroupModalVisible(true);
    };

    const handleGroupUpdateCancel = () => {
        setUpdateGroupUsers([]);
        setIsUpdateGroupModalVisible(false);
    };

    useEffect(() => {
        if (selectedChat?.isGroupChat) {
            setUpdateGroupUsers(selectedChat?.users)
            setUpdateGroupName(selectedChat?.chatName)
        }
    }, [selectedChat])

    const removeUserFromUpdateGroup = (user) => {
        if (user?._id === currentUser?._id) {
            setUpdateGroupUsers(updateGroupUsers.filter(u => u !== user))
        } else {
            message.error({ content: 'You can not remove other users from group', key: 'remove-user-from-group' })
        }
    }
    const addUserToUpdateGroup = (user) => {
        if (selectedChat?.isGroupChat) {
            if (selectedChat?.groupAdmin._id === currentUser?._id) {
                if (!updateGroupUsers.includes(user)) {
                    setUpdateGroupUsers([...updateGroupUsers, user])
                }
            } else {
                console.log(selectedChat)
                message.error({ content: 'You are not the admin of this group', key: 'add-users-to-group' })
            }

        }
    }



    useEffect(() => {
        if (groupUpdateSuccess) {
            message.success({ content: 'Group updated successfully', key: 'group-update' })
            setIsUpdateGroupModalVisible(false);
            mutate('/api/chat/index');
            mutate('')
            setGroupUpdateSuccess(false)

        }
    }, [groupUpdateSuccess])

    useEffect(() => {
        if (groupUpdateError) {
            message.error({ content: groupUpdateError, key: 'group-update' })
            setGroupUpdateError(null)
        }
    }, [groupUpdateError])

    const updateGroupConfirm = () => {
        message.loading({ content: 'Updating group...', key: 'group-update' })
        API.put(`/api/group-chat/update?groupId=${selectedChat?._id}`, { groupName: updateGroupName, users: updateGroupUsers, groupImage: updateGroupImage }).then(res => { setGroupUpdateSuccess(true); setIsUpdateGroupModalVisible(false); setSelectedChat(null); setSelectedChat(res.data.chat) }).catch(err => { console.log(err?.response?.data?.error); setGroupUpdateError(err.response?.data?.error) })
    }

    const [leftGroupSuccess, setLeftGroupSuccess] = useState(false);
    useEffect(() => {
        if (leftGroupSuccess) {
            const message = selectedChat?.isGroupChat ? 'Group left successfully' : 'Conversation deleted successfully'
            Notification(message, 'success')
            setLeftGroupSuccess(false)
        }
    }, [leftGroupSuccess])

    const leaveGroup = () => {
        message.loading({ content: 'Leaving group...', key: 'leave-group' })
        if (selectedChat?.groupAdmin?._id === currentUser?._id) {
            //delete group
            API.delete(`/api/group-chat/delete?groupId=${selectedChat?._id}`).then(res => { setSelectedChat(null); setLeftGroupSuccess(true); setIsUpdateGroupModalVisible(false); mutate('/api/chat/index') }).catch(err => { setGroupUpdateError(err.response?.data?.error) })
        } else {
            //remove current user from group
            API.put(`/api/group-chat/update?groupId=${selectedChat?._id}`, { users: updateGroupUsers.filter(u => u._id !== currentUser?._id) }).then(res => { setSelectedChat(null); setLeftGroupSuccess(true); setIsUpdateGroupModalVisible(false); mutate('/api/chat/index') }).catch(err => { setGroupUpdateError(err.response?.data?.error) })
        }
    }




    return (
        <>
            <Header setSelectedChat={setSelectedChat} isNotification={isNotification} setIsNotification={setIsNotification} />
            <div className='relative w-full h-[90vh] '>
                <MainContainer>
                    <div style={{ scrollbarWidth: '1px' }} className={'h-full w-full md:w-[25vw] px-2 md:flex ' + (selectedChat ? 'hidden' : 'flex')}>
                        <Sidebar className='h-full w-full md:w-[25vw]' position="left" loading={chatLoading}>
                            {
                                !chatLoading && (
                                    <div className='border-purple-500 flex  rounded-lg p-1 m-3 bg-purple-100 appearance-none border  '>
                                        <input className='placeholder-purple-600 font-light h-full w-full bg-purple-100 outline-none' placeholder="Search..." onChange={e => setSearch(e.target.value)} value={search} />
                                        <div onClick={() => { setSearch('') }} className='cursor-pointer mr-2 flex justify-center items-center'><AiOutlineCloseCircle className='text-purple-500' /></div>
                                    </div>
                                )

                            }
                            <div className='rounded-3xl overflow-y-scroll'>
                                <CreateGroupModal
                                    isModalVisible={isModalVisible}
                                    setIsModalVisible={setIsModalVisible}
                                    groupName={groupName}
                                    setGroupName={setGroupName}
                                    usersToAdd={usersToAdd}
                                    setUsersToAdd={setUsersToAdd}
                                    createGroup={createGroup}
                                    removeUser={removeUser}
                                    handleCancel={handleCancel}
                                    setGroupSearch={setGroupSearch}
                                    groupSearch={groupSearch}
                                    users={users}
                                    addUserToGroup={addUserToGroup}
                                    groupSearchLoading={groupSearchLoading}
                                    setGroupImage={setGroupImage}
                                    groupImage={groupImage}

                                />

                                <UpdateGroupModal
                                    isUpdateGroupModalVisible={isUpdateGroupModalVisible}
                                    setIsUpdateGroupModalVisible={setIsUpdateGroupModalVisible}
                                    updateGroupName={updateGroupName}
                                    setUpdateGroupName={setUpdateGroupName}
                                    updateGroupUsers={updateGroupUsers}
                                    setUpdateGroupUsers={setUpdateGroupUsers}
                                    updateGroupConfirm={updateGroupConfirm}
                                    handleGroupUpdateCancel={handleGroupUpdateCancel}
                                    removeUserFromUpdateGroup={removeUserFromUpdateGroup}
                                    addUserToUpdateGroup={addUserToUpdateGroup}
                                    setGroupSearch={setGroupSearch}
                                    groupSearch={groupSearch}
                                    users={users}
                                    groupSearchLoading={groupSearchLoading}
                                    setUpdateGroupImage={setUpdateGroupImage}
                                    updateGroupImage={updateGroupImage}
                                    leaveGroup={leaveGroup}
                                    selectedChat={selectedChat}
                                    groupUpdateSuccess={groupUpdateSuccess}

                                />
                            </div>
                            <SearchList
                                search={search}
                                searchLoading={searchLoading}
                                users={users}
                                setChatLoading={setChatLoading}
                                setSelectedChat={setSelectedChat}
                            />
                            <button className=' border text-purple-700 cursor-pointer sm:px-1 border-purple-600  flex  my-2 items-center justify-center w-fit mx-auto px-3 py-1 rounded-md' onClick={() => showModal()}><MdGroupAdd className='text-xl mr-1 flex justify-center items-center' /> Group</button>
                            <Conversations
                                onlyGroupChats={onlyGroupChats}
                                onlyUserChats={onlyUserChats}
                                selectedChat={selectedChat}
                                currentUser={currentUser}
                                setSelectedChat={setSelectedChat}
                            />
                        </Sidebar>
                    </div>

                    {
                        selectedChat ?
                            (
                                <Messages
                                    selectedChat={selectedChat}
                                    showGroupUpdateModal={showGroupUpdateModal}
                                    setSelectedChat={setSelectedChat}
                                    isNotification={isNotification}
                                    setIsNotification={setIsNotification}

                                />

                            ) :
                            (
                                <div className='w-full h-full hidden md:flex '>
                                    <ChatContainer className='overflow-hidden '>
                                        <MessageList>
                                            <MessageList.Content className='flex flex-col justify-center items-center h-full text-base bg-slate-50 rounded-3xl'>
                                                Start Conversation
                                            </MessageList.Content>
                                        </MessageList>
                                    </ChatContainer>
                                </div>
                            )
                    }

                </MainContainer>

            </div>
        </>
    )
}
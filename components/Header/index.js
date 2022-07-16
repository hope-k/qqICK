import React, { useState } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri'
import { BsBell } from 'react-icons/bs'
import { Avatar } from '@chatscope/chat-ui-kit-react'
import useAuth from '../../hooks/useAuth'
import ProfileModal from '../Modals/ProfileModal'
import { useNotifications } from '../../context/notifications'
import { Dropdown, Menu, Space, Badge } from 'antd';
import moment from 'moment'


const Header = ({ setSelectedChat, setIsNotification }) => {
    const { user: currentUser } = useAuth()
    const [isProfileVisible, setProfileVisible] = useState(false)
    const { notifications } = useNotifications();



    const menu = (
        <Menu className={'rounded-xl  overflow-y-scroll hover:bg-white ' + (!notifications?.length ? 'h-fit' : 'h-[50vh]')}
            items={

                !notifications?.length ? [{
                    label: (
                        <div className='rounded-xl hover:bg-purple-100 p-3 mx-[-.4rem]'>
                            No New Messages
                        </div>
                    )
                }] : (
                    notifications?.map((notification, index) => ({
                        key: index,
                        label: (
                            <div onClick={() => {setIsNotification(true); setSelectedChat(notification?.message?.chat)}} key={index} className='duration-300 rounded-xl hover:bg-purple-200 hover:border hover:border-purple-500  p-5 capitalize bg-purple-50 mx-[-.4rem]'>
                                {
                                    notification?.message?.chat?.isGroupChat ? (
                                        <span className='block text-[.7rem] font-semibold border w-fit rounded-md border-purple-500 bg-purple-50 p-[.03rem] px-1'>Group</span>) : (<span className='block text-[.7rem] font-semibold border w-fit rounded-md border-purple-500 bg-purple-50 p-[.03rem] px-1'>Message</span>)
                                }
                                New message from {notification?.message?.sender?.name}
                                <div className='flex justify-between'>
                                    <span className='text-xs font-light border-b border-purple-500 max-w-[5rem] md:max-w-[15rem] mr-1'>{notification?.message?.text}</span>
                                    <span className='text-xs font-light'>{moment(notification?.message?.createdAt).fromNow()}</span>
                                </div>
                            </div>
                        )
                    })
                    )

                )

            }
        />
    );
    return (
        <>
            <div className='border-b-2 shadow-2xl bg-white-100 w-full flex px-6 md:px-10 items-center h-[10vh]'>
                <div className='w-[8rem] md:w-20 md:h-full'>
                    <img src='/qheader.png' className='object-contain' />
                </div>
                <div className='justify-end w-full flex items-center '>
                    <div className='cursor-pointer'>
                        <Dropdown arrow={true} overlayClassName='cursor-pointer' overlay={menu} trigger={['click']}>
                            <Badge count={notifications?.length} overflowCount={5}>
                                <BsBell className='h-full text-[1.3rem] cursor-pointer' />
                            </Badge>
                        </Dropdown>
                    </div>

                </div>
                <div onClick={() => setProfileVisible(true)} className=' ml-8 m-1 p-2 h-12 bg-slate-200 rounded-lg flex items-center cursor-pointer'>
                    <Avatar src={currentUser?.avatar || (currentUser?.gender === 'male' ? '/defaultmaleavatar.png' : (currentUser?.gender === 'female' && '/defaultfemaleavatar.png'))} style={{ width: '3px', height: '3px' }} />
                    <RiArrowDownSLine className='ml-2' />
                </div>
            </div>
            <ProfileModal
                isProfileVisible={isProfileVisible}
                setProfileVisible={setProfileVisible}

            />
        </>
    )
}

export default Header
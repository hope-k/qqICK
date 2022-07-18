import React from 'react'
import { Modal } from 'antd'
import useAuth from '../../hooks/useAuth'
import { Avatar, Status, StatusList } from '@chatscope/chat-ui-kit-react'
import { BiLogOutCircle } from 'react-icons/bi'


const ProfileModal = ({ setProfileVisible, isProfileVisible }) => {
    const { user: currentUser, logout } = useAuth()
    return (
        <Modal centered className='overflow-hidden' maskStyle={{ backgroundColor: 'rgba(0,0,0,0.7)' }} title={<div onClick={() => logout()} className='cursor-pointer text-red-500 flex items-center justify-center flex-col'><BiLogOutCircle className='rotate-90 text-lg ' /><span>Logout</span></div>} visible={isProfileVisible} onCancel={() => setProfileVisible(false)} closable cancelButtonProps={{ className: 'hidden' }} okButtonProps={{ className: 'hidden' }}>
            <div className='flex justify-center items-center flex-col'>
                <Avatar
                    status={currentUser?.status}
                    src={currentUser?.avatar || (currentUser?.gender === 'male' ? '/defaultmaleavatar.png' : (currentUser?.gender === 'female' && '/defaultfemaleavatar.png'))}
                    size='lg'
                />
                <div className='font-semibold capitalize'>
                    Name: {currentUser?.name}
                </div>
                <div className='font-extralight'>
                    Email: {currentUser?.email}
                </div>
            </div>

            <StatusList size="md">
                <Status size="lg" status="available" name="Available" />
                <Status size="lg" status="eager" name="Eager" />
                <Status size="lg" status="away" name="Away" />
                <Status size="lg" status="dnd" name="Dnd" />
                <Status size="lg" status="invisible" name="Invisible" />
                <Status size="lg" status="unavailable" name="Unavailable" />
            </StatusList>

        </Modal>
    )
}

export default ProfileModal
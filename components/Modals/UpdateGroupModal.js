import React, { useState, useEffect } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { ExpansionPanel, Avatar, AvatarGroup } from '@chatscope/chat-ui-kit-react'
import Skeleton from 'react-loading-skeleton'
import { Modal, Upload, Button } from 'antd'
import { useSWRConfig } from 'swr'
import useAuth from '../../hooks/useAuth'

const UpdateGroupModal = ({
    isUpdateGroupModalVisible,
    handleGroupUpdateCancel,
    groupSearch,
    setGroupSearch,
    updateGroupConfirm,
    updateGroupName,
    setUpdateGroupName,
    removeUserFromUpdateGroup,
    addUserToUpdateGroup,
    updateGroupUsers,
    groupSearchLoading,
    users,
    leaveGroup,
    selectedChat,
    updateGroupImage,
    setUpdateGroupImage,
    groupUpdateSuccess

}) => {
    const { user: currentUser } = useAuth();
    const { mutate } = useSWRConfig()
    const [preview, setPreview] = useState('')
    useEffect(() => {
        if (selectedChat?.groupImage) {
            setPreview(selectedChat?.groupImage)
            setUpdateGroupImage(selectedChat?.groupImage)
        }
    }, [selectedChat?.groupImage])
    const groupAdmin = selectedChat?.groupAdmin



    const getBase64 = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        console.log('file', file)
        reader.onload = async () => {
            setUpdateGroupImage(await reader.result)
            setPreview(await reader.result)
        };
        reader.onerror = (error) => Promise.reject(error);

    }

    const handleChange = async ({ file }) => {
        await getBase64(file?.originFileObj);

    };
    const recipient = selectedChat?.users?.filter(u => u?.email !== currentUser?.email)[0]

    const uploadButton = (
        <Button>Upload +</Button>

    );

    return (
        <Modal
            footer={[
                <div className='flex  '>
                    <button className={' border-none bg-red-500 rounded-lg text-white hover:bg-red-700 hover:text-white p-2 duration-200 ' + (selectedChat?.isGroupChat ? 'flex' : 'hidden')} onClick={leaveGroup}>
                        {selectedChat?.isGroupChat ? 'Leave Group' : 'Delete Conversation'}
                    </button>
                    <button className={' ml-2 border-none bg-purple-500 rounded-lg text-white hover:bg-purple-700 hover:text-white p-2 duration-200 ' + (selectedChat?.isGroupChat ? 'flex' : 'hidden')} onClick={() => updateGroupConfirm()}>
                        Save Update
                    </button>
                </div>,
            ]}
            wrapClassName=''
            maskStyle={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            cancelButtonProps={{ className: 'border-none bg-red-500 rounded-lg text-white hover:bg-red-700 hover:text-white ' }}
            okButtonProps={{ className: 'border-none bg-purple-500 rounded-lg text-white hover:bg-purple-700 hover:text-white ' }}
            closable={true}
            okText='Update Group' title={selectedChat?.isGroupChat ? 'Update Group Chat' : recipient?.name}
            onCancel={handleGroupUpdateCancel}
            onOk={updateGroupConfirm}
            visible={isUpdateGroupModalVisible}
            className='rounded-3xl'
        >
            {
                (groupSearch) && (
                    <ExpansionPanel title="Search Results" open={true} className='overflow-y-scroll rounded-2xl'>

                        {

                            groupSearchLoading ? <Skeleton count={10} height={50} /> : (

                                !users?.length ? <div className='text-center text-gray-500 bg-slate-200 p-10 rounded-lg'>No results found</div> : (
                                    users?.map(user => (
                                        <div onClick={() => addUserToUpdateGroup(user)} id='chatPop' key={user?._id} className={'cursor-pointer hover:bg-purple-700 hover:text-white flex bg-[#605f5f1a] m-2 rounded-lg p-1 duration-500 opacity-100'}>
                                            <Avatar src={user?.avatar || '/defaultmaleavatar.png'} />
                                            <span className='ml-3 capitalize text-sm font-mono'>{user?.name}</span>
                                            <span className='items-end flex  text-xs font-mono '>Email: {user?.email}</span>
                                        </div>
                                    ))
                                )


                            )

                        }
                    </ExpansionPanel>)

            }
            <div>
                <div>
                    <Avatar
                        size='lg'
                        status={!selectedChat?.isGroupChat && recipient?.status}
                        src={selectedChat?.isGroupChat ? (preview || '/groupavatar.jpg') : recipient?.avatar || (recipient?.gender === 'male' ? '/defaultmaleavatar.png' : (recipient?.gender === 'female' && '/defaultmaleavatar.png'))}
                        className='rounded-full w-32 h-32 mx-auto mb-2'
                    />
                    {
                        !selectedChat?.isGroupChat && (<div className='flex justify-center items-center font-thin'>{recipient?.email}</div>)
                    }
                </div>
                {
                    selectedChat?.isGroupChat && (
                        <div className='mb-2 rounded-xl'>
                            <Upload
                                listType="text"
                                multiple={false}
                                onChange={handleChange}
                                maxCount={1}
                            >
                                {uploadButton}

                            </Upload>
                        </div>
                    )
                }
            </div>
            <div>
                {
                    selectedChat?.isGroupChat && (
                        <>

                            <div>
                                <input
                                    type='text'
                                    placeholder='Group name'
                                    className='duration-200 outline-none appearance-none w-full p-2 border border-purple-300 rounded-lg focus:border-purple-500 focus:border-2'
                                    onChange={(e) => setUpdateGroupName(e.target.value)}
                                    value={updateGroupName}

                                />
                            </div>
                            <div>
                                <input
                                    type='text'
                                    placeholder='Add Users, eg: @user1 @user2'
                                    className=' duration-200 outline-none appearance-none w-full p-2 border mt-2 border-purple-300 rounded-lg focus:border-purple-500 focus:border-2'
                                    onChange={(e) => setGroupSearch(e.target.value)}

                                />
                            </div>
                        </>
                    )
                }
            </div>
            <div className='flex flex-wrap'>
                {
                    selectedChat?.isGroupChat && updateGroupUsers?.map(user => (
                        <div className={' p-2 w-fit rounded-lg ml-2 my-2 duration-200 ' + (user?._id === groupAdmin?._id ? 'bg-red-500' : 'bg-purple-800 ')}>
                            <div key={user?._id} className='flex items-center text-white capitalize relative'>
                                {
                                    (user?._id === groupAdmin?._id) && (
                                        <div className='text-[.5rem] font-bold'>
                                            ADMIN
                                        </div>
                                    )
                                }
                                <Avatar className='mr-1 capitalize' src={user?.avatar || '/defaultmaleavatar.png'} />
                                {user?.name} {(user?._id !== groupAdmin?._id) && <IoIosCloseCircleOutline onClick={() => removeUserFromUpdateGroup(user)} className='cursor-pointer text-[1.2rem] ml-1' />}
                            </div>
                        </div>
                    ))
                }
            </div>



        </Modal>
    )
}

export default UpdateGroupModal
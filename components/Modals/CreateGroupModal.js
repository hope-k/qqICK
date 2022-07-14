import React, { useState } from 'react'
import { ExpansionPanel, Avatar } from '@chatscope/chat-ui-kit-react'
import { Modal, Upload } from 'antd'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import Skeleton from 'react-loading-skeleton'

const CreateGroupModal = ({
    isModalVisible,
    createGroup,
    handleCancel,
    addUserToGroup,
    groupName,
    setGroupName,
    groupSearch,
    setGroupSearch,
    usersToAdd,
    removeUser,
    groupSearchLoading,
    users,
    setGroupImage,
    groupImage


}) => {
    const getBase64 = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        console.log('file', file)
        reader.onload = async () => {setGroupImage(await reader.result)};
        reader.onerror = (error) => Promise.reject(error);

    }

    const handleChange = async ({ file }) => {
        await getBase64(file?.originFileObj);

    };
    const uploadButton = (
        <div>
            +
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload Group Image
            </div>
        </div>
    );
    return (

        <Modal maskStyle={{ backgroundColor: 'rgba(0,0,0,0.7)' }} cancelButtonProps={{ className: 'border-none bg-red-500 rounded-lg text-white hover:bg-red-700 hover:text-white ' }} okButtonProps={{ className: 'border-none bg-purple-500 rounded-lg text-white hover:bg-purple-700 hover:text-white ' }} closable okText='Create Group' title='Create a group chat' onCancel={handleCancel} onOk={createGroup} visible={isModalVisible} className='rounded-3xl'>
            <div>
                <Upload
                    listType="picture-card"
                    multiple={false}
                    onChange={handleChange}
                    maxCount={1}
                    onCancel={() => setGroupImage('')}
                >
                    {uploadButton}

                </Upload>
            </div>
            <div>
                <input
                    type='text'
                    placeholder='Group name'
                    className=' duration-200 outline-none appearance-none w-full p-2 border  border-purple-300 rounded-lg focus:border-purple-500 focus:border-2'
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}

                />
            </div>
            <div>
                <input
                    type='text'
                    placeholder='Add Users, eg: user1 user2'
                    className=' duration-200 outline-none appearance-none w-full p-2 border mt-2 border-purple-300 rounded-lg focus:border-purple-500 focus:border-2'
                    onChange={(e) => setGroupSearch(e.target.value)}
                    value={groupSearch}

                />
            </div>
            <div className='flex flex-wrap duration-500'>
                {
                    usersToAdd?.map(user => (
                        <div className=' bg-purple-500 p-2 w-fit rounded-lg ml-2 my-2 duration-500'>
                            <div key={user?._id} className='flex duration-500 items-center text-white capitalize'><Avatar className='mr-1' src={user?.avatar || '/defaultmaleavatar.png'} /> {user?.name} <IoIosCloseCircleOutline onClick={() => removeUser(user)} className='cursor-pointer text-[1.2rem] ml-1' /></div>
                        </div>
                    ))
                }

            </div>
            {
                (groupSearch) && (
                    <ExpansionPanel title="Search Results" open={true} className='overflow-y-scroll rounded-2xl'>

                        {

                            groupSearchLoading ? <Skeleton count={10} height={50} /> : (

                                !users.length ? <div className='text-center text-gray-500 bg-slate-200 p-10 rounded-lg'>No results found</div> : (
                                    users?.map(user => (
                                        <div onClick={() => addUserToGroup(user)} id='chatPop' key={user?._id} className={'cursor-pointer hover:bg-purple-700 hover:text-white flex bg-[#605f5f1a] m-2 rounded-lg p-1 duration-500 opacity-100'}>
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


        </Modal>
    )
}

export default CreateGroupModal
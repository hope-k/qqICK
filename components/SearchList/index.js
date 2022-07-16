import React from 'react'
import useChat from '../../utils/useChat'
import { ExpansionPanel, Avatar } from '@chatscope/chat-ui-kit-react'
import Skeleton from 'react-loading-skeleton'

const SearchList = ({ search, searchLoading, users, setChatLoading, setSelectedChat  }) => {
    const { accessChat } = useChat(setChatLoading)
    return (
        <div>
            {
                (search) && (
                    <ExpansionPanel title="Search Results" open={true} className='overflow-y-scroll p-2 rounded-3xl'>

                        {

                            searchLoading ? <Skeleton count={10} height={50} /> : (

                                !users?.length ? <div className='text-center text-gray-500 bg-slate-200 p-10 rounded-lg'>No results found</div> : (
                                    users?.map(user => {
                                        const receiverId = user?._id
                                        return (
                                            <div onClick={() => accessChat(receiverId, setSelectedChat)} id='chatPop' key={user?._id} className={'cursor-pointer hover:bg-purple-700 hover:text-white flex bg-[#605f5f1a] m-2 rounded-lg p-1 duration-500 opacity-100'}>
                                                <Avatar src={user?.avatar || '/defaultmaleavatar.png'} />
                                                <span className='ml-3 capitalize text-sm font-mono'>{user?.name}</span>
                                                <span className='items-end flex  text-xs font-mono '>Email: {user?.email}</span>
                                            </div>
                                        )


                                    }
                                    )
                                )


                            )

                        }
                    </ExpansionPanel>)

            }
        </div>
    )
}

export default SearchList
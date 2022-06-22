import React, { useState, useEffect, useRef } from 'react'
import Login from '../AuthForm/Login'
import Register from '../AuthForm/Register'
import gsap from 'gsap'



const AuthForm = () => {
    const [switchForm, setSwitchForm] = useState(false);
    const t1 = useRef();
    useEffect(() => {
        t1.current = gsap.timeline({ paused: true, defaults: {} })
            .to('#slider', {
                translateX: '7rem',
                duration: .5,
                ease: 'power1.inOut'
            })
        return () => t1.current.kill()
    }, [])

    useEffect(() => {
        if (switchForm) {
            t1.current.play()
        }
        if (!switchForm) {
            t1.current.reverse()
        }
    }, [switchForm, t1])


    return (
        <section className="h-full gradient-form bg-red-100 md:h-full m-4 rounded-3xl">
            <div className="container py-12 px-6 h-full">
                <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
                    <div className="xl:w-10/12">
                        <div className="block bg-white shadow-lg rounded-lg">
                            <div className="lg:flex lg:flex-wrap g-0">
                                <div className="lg:w-6/12 px-4 md:px-0 relative">
                                    <div className='flex w-full justify-center'>
                                        <div className='bg-black rounded-2xl w-[14.7rem] flex text-white justify-evenly items-center  relative first-letter:'>
                                            <div id='slider' style={{
                                                height: 'calc(100% - .3rem)', background: ' linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'
                                            }} className={'absolute bg-red-400  w-[50.6%]  rounded-2xl  left-[.14rem] border-b border-black'}>

                                            </div>

                                            <div onClick={() => setSwitchForm(false)} className='z-10 p-3 cursor-pointer'>
                                                Login
                                            </div>
                                            <div onClick={() => setSwitchForm(true)} className='z-10 p-3 cursor-pointer'>
                                                Register
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        switchForm ?
                                            <Register />
                                            :
                                            <Login />

                                    }
                                </div>
                                <div
                                    className="lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none"
                                    style={{
                                        background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'
                                    }
                                    }

                                >
                                    <div className="text-white px-4 py-6 md:p-12 md:mx-6">
                                        <h4 className="text-xl font-semibold mb-6">Your messages are always encrypted</h4>
                                        <p className="text-sm">
                                            Login and start a conversation with your friends and family
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AuthForm
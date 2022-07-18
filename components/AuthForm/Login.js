import React, { useState, useEffect, useRef } from 'react'
import gsap from "gsap";
import useAuth from '../../hooks/useAuth';
import Notification from '../../hooks/notification';

const Login = () => {
    const { login } = useAuth();
    const [error, setError] = useState([])
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPassword, setGuestPassword] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        gsap.to('#loginForm', {
            opacity: "1",
            duration: 1.5,
        })

    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        const credentials = { email, password }
        login(credentials, setError)

    }
    useEffect(() => {
        if (error) {
            error.forEach(err => {
                Notification(err, 'error')
                setError('')
            })
        }
    }, [error])
    const toggleShow = () => {
        setShow(!show);
    }

    return (
        <div id='loginForm' className="md:p-12 md:mx-6 opacity-[0]">
            <div className="text-center">
                <img
                    className="mx-auto w-48"
                    src="/q.png"
                    alt="logo"
                />
                <h4 className="text-xl font-semibold mt-1 mb-12 pb-1">qqICK in securing and delivering your messages</h4>
            </div>
            <form onSubmit={handleSubmit} className=''>
                <p className="mb-4">Please login to your account</p>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="mb-4 relative">
                    <input
                        type={show ? "text" : "password"}
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <h1 onClick={() => toggleShow()} className={'absolute bottom-2 right-2 cursor-pointer ' + (show && 'text-red-500 font-semibold')}>show</h1>
                </div>
                <div className="text-center pt-1 mb-12 pb-1">
                    <button
                        className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                        type="submit"
                        style={{
                            background: ' linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'

                        }}

                    >
                        Log in
                    </button>
                    <a className="text-gray-500" href="#!">Forgot password?</a>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between pb-6">
                    <button
                        onClick={() => {
                            setEmail('guestone@welcome.com')
                            setPassword('Safepassforguest123@')
                        }}
                        type="button"
                        className="inline-block px-6 py-2 border-2 border-red-600 text-red-600 font-medium text-xs leading-tight uppercase rounded-xl hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"

                    >
                        Log in with guest one credentials
                    </button>
                </div>               
                 <div className="flex flex-col md:flex-row items-center justify-between pb-6">
                    <button
                        onClick={() => {
                            setEmail('guesttwo@welcome.com')
                            setPassword('Safepassforguest123@')
                        }}
                        type="button"
                        className="inline-block px-6 py-2 border-2 mb-2 border-purple-500 text-fuchsia-500 font-medium text-xs leading-tight uppercase rounded-xl hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"

                    >
                        Log in with guest two credentials
                    </button>
                    <p className="mb-3 mr-2 ">Don't have an account?</p>

                </div>
            </form>
        </div>
    )
}

export default Login
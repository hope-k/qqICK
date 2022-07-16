import React, { useState, useEffect, useRef } from 'react'
import { Modal, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import gsap from 'gsap'
import useAuth from '../../hooks/useAuth';
import Notification from '../../hooks/notification';
import { useRouter } from 'next/router';



const Register = ({ setSwitchForm }) => {
    const { register } = useAuth();
    const [error, setError] = useState([])
    const [success, setSuccess] = useState('')
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const credentials = { email, name, password, avatar, confirmPassword, gender }
        register(credentials, setError, setSuccess, setLoading)
    }
    
    useEffect(() => {
        if (success) {
            //to switch to login form
            setSwitchForm(false)
        }
    }, [success])


    useEffect(() => {
        if (error) {
            error.forEach(err => {
                Notification(err, 'error')
                setError('')
            })
        }
    }, [error])




    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        let src = file.url || file.preview;


        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);


        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => { resolve(reader.result) };

            reader.onerror = (error) => reject(error);
        });
    const handleCancel = () => setPreviewVisible(false);

    const handleChange = async ({ file }) => {
        const result = await getBase64(file?.originFileObj);
        setAvatar(result)
    };

    const isChecked = (value) => {
        return value === gender
    }
    useEffect(() => {
        console.log('Gender', gender)
    }, [gender])








    useEffect(() => {
        gsap.to('#registerForm', {
            opacity: "1",
            duration: 1.5,
        })

    }, [])
    const uploadButton = (
        <div>
            +
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    return (

        <div id='registerForm' className="md:p-12 md:mx-6 opacity-[0]">
            <div className="text-center">
                <img
                    className="mx-auto w-48"
                    src="/q.png"
                    alt="logo"
                />
                <h4 id='loginForm' className="text-xl font-semibold mt-1 mb-12 pb-1">qqICK in securing and delivering your messages</h4>
            </div>
            <form className='' onSubmit={handleSubmit}>
                <p className="mb-4">Create a new account</p>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Username"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
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
                <div className="mb-4">
                    <input
                        type="password"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                </div>
                <div className='flex flex-col  '>
                    {
                        ['male', 'female'].map((g, i) => (
                            <div id={i}  className='items-center flex my-1' >
                                <input
                                    type='radio'
                                    name={g}
                                    checked={isChecked(g)}
                                    value={g}
                                    onChange={e => setGender(e.target.value)}
                                    className='border-2 p-2 appearance-none border-purple-500 checked:ring-2 rounded-full w-4 h-4 mr-2 checked:bg-purple-500'
                                />
                                <label className='capitalize'>
                                    {g}
                                </label>
                            </div>


                        ))
                    }
                </div>
                <h1 className='mt-2'>Upload your avatar</h1>
                {
                    <ImgCrop  rotate modalOk='Save'>

                        <Upload
                            listType="picture-card"
                            multiple={false}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            maxCount={1}


                        >
                            {uploadButton}


                        </Upload>
                    </ImgCrop>
                }
                <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
                <div className="text-center pt-1 mb-12 pb-1">
                    <button
                        className="rounded-xl inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                        style={{

                            background: ' linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'

                        }}
                        type='submit'
                        disabled={loading ? true : false}

                    >
                        Sign Up
                    </button>
                    <a className="text-gray-500" href="#!">Forgot password?</a>
                </div>
                <div className="flex items-center justify-between pb-6">
                    <p className="mb-0 mr-2">Don't have an account?</p>

                </div>
            </form>
        </div>

    )
}

export default Register


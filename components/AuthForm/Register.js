import React, { useState, useEffect, useRef } from 'react'
import { Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

import gsap from 'gsap'
const Register = () => {
    const [avatar, setAvatar] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');



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

    const handleChange = ({ file }) => { setAvatar(file) };




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
            <form  className=''>
                <p className="mb-4">Create a new account</p>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Username"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Email"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Password"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="exampleFormControlInput1"
                        placeholder="Confirm Password"
                    />
                </div>
                <h1>Upload your avatar</h1>
                {
                    <ImgCrop rotate>


                        <Upload
                            listType="picture-card"
                            multiple={false}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {!avatar ? (uploadButton) : null}
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
                        className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                        type="button"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        style={{

                            background: ' linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)'

                        }}

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
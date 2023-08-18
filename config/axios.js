import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

axios.defaults.withCredentials = true;
export default function http() {
    const router = useRouter()

    const API = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    })

    //add token to request interceptor
    API.interceptors.request.use(config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })

    API.interceptors.response.use(res => res, err => {
        if (err.response.status === 401) {
            Cookies.remove('token')
            localStorage.removeItem('token')
            router.push('/')
            return axios(err.config)
        }

        return Promise.reject(err)
    })

    return {
        API
    }
}


import axios from 'axios'
import React, { useState } from 'react'


export default function http() {
    
    const API = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    })


    return {
        API
    }
}


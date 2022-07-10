import { notification } from 'antd'

export default function Notification(message, type) {
    if (type === 'error') {
        const error = () => {
            notification.error({
                message: message,
                duration: 5,
                style: {
                    borderRadius: '8px',
                    borderRight: '4px solid red',
                    background: 'white',
                },
                
                
            })
        }
        error()
    }   
     if (type === 'success') {
        const success = () => {
            notification.success({
                message: message,
                duration: 5,
                style: {
                    borderRadius: '8px',
                    borderRight: '4px solid green',
                    background: 'white',
                },
            })
        }
        success()
    }   
     if (type === 'warn') {
        const warn = () => {
            notification.warn({
                message: message,
                duration: 5,
                style: {
                    borderRadius: '8px',
                    borderRight: '4px solid yellow',
                    background: 'white',
                },
            })
        }
        warn()
    }

 
}
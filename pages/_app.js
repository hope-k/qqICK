import { SWRConfig } from 'swr'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'react-loading-skeleton/dist/skeleton.css'
import { SocketContext, socket } from '../context/socket.js'
import '../styles/globals.scss'
import '../styles/main.scss'
import SocketProvider from '../context/socket'
import NotificationsProvider from '../context/notifications'
import { Head } from 'next/head'


function MyApp({ Component, pageProps }) {


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, height=device-height,  initial-scale=1.0, user-scalable=no, user-scalable=0;" />
      </Head>
      <NotificationsProvider>
        <SocketProvider>
          <SWRConfig
            value={{
              revalidateIfStale: true,
              revalidateOnFocus: true,
            }}
          >
            <Component {...pageProps} />
          </SWRConfig>
        </SocketProvider>
      </NotificationsProvider>
    </>
  )
}

export default MyApp

import Head from 'next/head'
import React from 'react'

const Layout = ({desc, title='qqICK', children}) => {
  return (
    <div>
        <Head>
            <title>{title}</title>
            <meta name="description" content={desc} />
        </Head>
        {children}
    </div>
  )
}

export default Layout
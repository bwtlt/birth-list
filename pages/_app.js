import React from 'react'
import '../styles/globals.css'
import { AuthUserProvider } from '../context/AuthUserContext'
import Maintenance from './maintenance'
import PropTypes from 'prop-types'

function MyApp ({ Component, pageProps }) {
  return <AuthUserProvider>
    {process.env.NEXT_PUBLIC_MAINTENANCE_MODE ? <Maintenance/> : <Component {...pageProps} />}
  </AuthUserProvider>
}
MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.array
}

export default MyApp

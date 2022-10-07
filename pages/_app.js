import '../styles/globals.css'
import { AuthUserProvider } from '../context/AuthUserContext';
import Maintenance from './maintenance';

function MyApp({ Component, pageProps }) {
  return <AuthUserProvider>
    {process.env.NEXT_PUBLIC_MAINTENANCE_MODE ? <Maintenance/> : <Component {...pageProps} />}
  </AuthUserProvider>
}

export default MyApp

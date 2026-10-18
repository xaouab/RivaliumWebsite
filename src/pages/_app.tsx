import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../../tokens.css';
import '@/style/font.scss';
import '@/style/global.scss';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';

function App({ Component, pageProps }: AppProps) {
    const { pathname } = useRouter();
    // The portal pages are full-screen forms with their own navigation.
    const chrome = !pathname.startsWith("/portal");

    return <AuthProvider>
        <Layout navbar={chrome} footer={chrome}>
            <Component {...pageProps} />
        </Layout>
    </AuthProvider>;
}

export default App;

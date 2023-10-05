import { useEffect } from 'react';

import { useRouter } from 'next/router';

import LoginNotice from '@/components/Settings/loginNotice';

import Cookies from 'js-cookie';

function Logout() {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove('user');
    sessionStorage.clear();
    localStorage.clear();
    router.replace('/');
  }, []);

  return <LoginNotice content="您已退出登录！" showButton={false} />;
}
export default Logout;

import { useEffect } from 'react';

import { useRouter } from 'next/router';

import LoginNotice from '@/components/Settings/loginNotice';

import Cookie from 'js-cookie';

function Logout() {
  const router = useRouter();
  Cookie.remove('user');
  sessionStorage.clear();
  localStorage.clear();
  useEffect(() => {
    router.replace('/');
  }, []);

  return <LoginNotice content="您已退出登录！" showButton={false} />;
}
export default Logout;

import { useRouter } from 'next/router';

import LoginNotice from '@/components/Settings/loginNotice';

import Cookie from 'js-cookie';

function Login() {
  const router = useRouter();
  console.log(router.query);
  const user = router.query.user as string;
  if (user) {
    Cookie.set('user', user, { expires: 7 });
    console.log('login success');
    router.replace('/');
  }
  return <LoginNotice content={user + ' 登录成功'} showButton={false} />;
}
export default Login;

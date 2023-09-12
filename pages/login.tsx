import { useRouter } from 'next/router';

import LoginNotice from '@/components/Settings/loginNotice';

import Cookie from 'js-cookie';

function Login() {
  const router = useRouter();
  console.log(router.query);
  const user = router.query.username as string;
  if (user) {
    Cookie.set('user', user, { expires: 7 });
    console.log('login success');
    router.replace('/');
    return <LoginNotice content={user + ' 登录成功'} showButton={false} />;
  }
  return <LoginNotice content="未检测到登录信息" showButton={true} />;
}
export default Login;

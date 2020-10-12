import { FileOutlined, HomeOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, shallowEqual } from 'react-redux';
import { AuthModule } from 'src/auth/auth';
import { Header, Router, Sider } from 'src/components';
import { SiderItem } from 'src/components/sider/types';
import { APP_TITLE } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { getRoute } from 'src/utils/history';
import { views } from 'src/views';

import './style.less'; // last

const { Content } = Layout;

const items: SiderItem[] = [
  { view: views[0], icon: <HomeOutlined /> },
  {
    title: 'Documentos',
    icon: <FileOutlined />,
    children: [{ view: views[1] }],
  },
  {
    title: 'Cajas',
    icon: <InboxOutlined />,
    children: [{ view: views[2] }, { view: views[3] }, { view: views[4] }],
  },
  {
    title: 'Pedidos',
    icon: <ShoppingCartOutlined />,
    children: [{ view: views[5] }, { view: views[6] }, { view: views[7] }],
  },
];

const App = () => {
  const authModule: AuthModule = new AuthModule();
  const router = useSelector((state: RootState) => state.router);
  const [title, setTitle] = useState('');

  useEffect(() => {
    /* authModule.loadAuthModule();
    const signInType = isIE() ? 'loginRedirect' : 'loginPopup';
    //authModule.login(signInType);
    authModule.attemptSsoSilent();*/
  }, []);

  useEffect(() => {
    setTitle(getTitle());
  }, [router.location.pathname]);

  const getTitle = () => {
    const view = views.find((v) => v.path === getRoute());
    const title = view ? view.title : views[views.length - 1].title;
    return title;
  };

  return (
    <>
      <Helmet titleTemplate={`%s | ${APP_TITLE}`}>
        <title>{title}</title>
      </Helmet>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Layout>
          <Sider items={items} />
          <Content>
            <Router views={views} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;

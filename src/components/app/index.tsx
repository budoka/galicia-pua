import { FileOutlined, HomeOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { AuthModule } from 'src/auth/auth';
import { Header, Router, Sider } from 'src/components';
import { SiderItem } from 'src/components/sider/types';
import { APP_TITLE } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { isIE } from 'src/utils/browser';
import { getRoute } from 'src/utils/store';
import { views } from 'src/views';
import './app.less'; // last

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

  /*useEffect(() => {
    authModule.loadAuthModule();
    const signInType = isIE() ? 'loginRedirect' : 'loginPopup';
    authModule.login(signInType);
    //authModule.attemptSsoSilent();
  }, []);*/

  useEffect(() => {
    console.log('render app');
  }, []);

  useEffect(() => {
    setTitle(getTitle());
  }, [router]);

  const getTitle = () => {
    const view = views.find((v) => v.path === getRoute());
    return view ? view.title : '';
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
          <Switch>
            <Router views={views} />
          </Switch>
        </Layout>
      </Layout>
    </>
  );
};

export default App;

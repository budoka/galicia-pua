import { FileOutlined, HomeOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenMenu } from 'src/actions';

import { Header } from 'src/components/header';
import { Router } from 'src/components/router';
import { Sider } from 'src/components/sider';
import { SiderItem, SiderParentItem } from 'src/components/sider/types';
import { APP_TITLE } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { getRoute } from 'src/utils/history';
import { views } from 'src/views';
import styles from './style.module.less';
import { history } from 'src/store';
import { Footer } from '../footer';
import { Loading } from '../loading';
import { useAzureAuth } from 'src/auth/azure/useAzureAuth';
import 'src/services/setup-axios';
import 'src/components/message/setup-message';
import './style.less';

const { Content } = Layout;

const items: SiderItem[] = [
  { view: views['Inicio'], icon: <HomeOutlined /> },
  {
    title: 'Documentos',
    icon: <FileOutlined />,
    children: [{ view: views['Buscar Legajo'] }],
  },
  {
    title: 'Cajas',
    icon: <InboxOutlined />,
    children: [
      { view: views['Cajas'], hidden: true },
      { view: views['Buscar Caja'] },
      { view: views['Ingresar Caja'] },
      { view: views['Retirar Caja'] },
    ],
  },
  {
    title: 'Pedidos',
    icon: <ShoppingCartOutlined />,
    children: [{ view: views['Buscar Caja*'] }, { view: views['Buscar Legajo / Doc'] }, { view: views['Buscar Pedido'] }],
  },
];

const App = () => {
  const auth = useAzureAuth();
  const router = useSelector((state: RootState) => state.router);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(getTitle());
  }, [router.location.pathname]);

  const getTitle = () => {
    const view = Object.values(views).find((v) => v.path === getRoute());
    const title = view ? view.title : views['Not Found'].title;
    return title;
  };

  return !auth.disabled && !auth.data ? (
    <Loading style={{ height: '100vh' }} size={26} text={'Cargando'} />
  ) : (
    <>
      <Helmet titleTemplate={`%s | ${APP_TITLE}`}>
        <title>{title}</title>
      </Helmet>
      <Layout style={{ height: '100vh' }}>
        <Header className={styles.header} />
        <Layout className={styles.main}>
          <Sider items={items} />
          <Content className={styles.content}>
            <Router views={views} />
            <Footer />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;

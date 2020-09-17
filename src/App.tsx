import { FileOutlined, HomeOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { Header, Router, Sider } from 'src/components';
import { SiderItem } from 'src/components/sider/types';
import { RootState } from 'src/reducers';
import { getRoute, getUser } from 'src/utils/store';
import { Home, View } from 'src/views';
import { NotFound } from './views/not-found';

import 'src/app.less'; // last

export const views: View[] = [
  { title: 'Inicio', path: '/inicio', component: <Home />, private: true, scope: 'inicio' },
  { title: 'Buscar Legajo*', path: '/buscar-legajo', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Buscar Caja*', path: '/buscar-caja', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Ingresar Caja*', path: '/ingresar-caja', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Retirar Caja*', path: '/retirar-caja', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Buscar Caja*', path: '/buscar-caja2', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Buscar Legajo / Doc*', path: '/buscar-legajo-doc', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Buscar Pedidos*', path: '/buscar-pedidos', component: <NotFound />, private: true, scope: 'full' },
];

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
  const router = useSelector((state: RootState) => state.router);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(getTitle());
  }, [router]);

  const getTitle = () => {
    const view = views.find((v) => v.path === getRoute());
    return view ? view.title : '';
  };

  return (
    <>
      <Helmet titleTemplate="%s | PUA">
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

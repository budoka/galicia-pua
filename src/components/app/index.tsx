import { FileOutlined, HomeOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { matchPath } from 'react-router-dom';
import 'src/api/setup-axios';
import { useAzureAuth } from 'src/auth/azure/useAzureAuth';
import { Footer } from 'src/components/footer';
import { Header } from 'src/components/header';
import { LoadingContent } from 'src/components/loading';
import 'src/components/message/setup-message';
import { Router } from 'src/components/router';
import { Sider } from 'src/components/sider';
import { SiderChildItem, SiderItem } from 'src/components/sider/types';
import { APP_TITLE } from 'src/constants/constants';
import { fetchInfoSesion } from 'src/features/sesion/sesion.slice';
import { RootState } from 'src/reducers';
import { getLegajo } from 'src/utils/galicia';
import { views } from 'src/views';
import styles from './style.module.less';
import './style.less';

const { Content } = Layout;

export const siderItems: SiderItem[] = [
  { view: views['Inicio'], icon: <HomeOutlined /> },
  {
    title: 'Documentos',
    icon: <FileOutlined />,
    children: [{ view: views['Buscar_Legajo'] }],
  },
  {
    title: 'Cajas',
    icon: <InboxOutlined />,
    children: [
      { view: views.Cajas, hidden: true },
      { view: views.Buscar_Caja },
      { view: views.Ingresar_Caja },
      { view: views.Editar_Caja, hidden: true },
      { view: views.Retirar_Caja },
    ],
  },
  {
    title: 'Pedidos',
    icon: <ShoppingCartOutlined />,
    children: [{ view: views.Buscar_Caja2 }, { view: views.Buscar_Legajo_Doc }, { view: views.Buscar_Pedido }],
  },
].map((parent) => {
  if (!parent.children) return parent;
  return {
    ...parent,
    children: (parent.children as SiderChildItem[]).map((item) => ({ ...item, parent: parent.title })),
  };
});

export const App = () => {
  const dispatch = useDispatch();
  const auth = useAzureAuth();
  const router = useSelector((state: RootState) => state.router);
  const sesion = useSelector((state: RootState) => state.sesion);

  useEffect(() => {
    if (!auth.data) return;
    const nombreUsuario = auth.data.account.name;
    const legajo = getLegajo(auth.data.account.username)!;
    dispatch(fetchInfoSesion({ nombreUsuario, legajo }));
  }, [auth.data]);

  const getTitle = () => {
    const view = Object.values(views).find((v) =>
      matchPath(router.location.pathname, {
        path: v.path,
        exact: true,
        strict: true,
      }),
    );

    const title = view ? view.title : views.Not_Found.title;
    return title;
  };

  return !auth.disabled && !sesion.data ? (
    <LoadingContent />
  ) : (
    <>
      <Helmet titleTemplate={`%s | ${APP_TITLE}`}>
        <title>{getTitle()}</title>
      </Helmet>
      <Layout style={{ height: '100vh' }}>
        <Header className={styles.header} />
        <Layout className={styles.main}>
          <Sider items={siderItems} />
          <Content className={styles.content}>
            <Router views={views} />
            <Footer />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

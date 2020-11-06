import React from 'react';
import { View } from 'src/views/types';
import { Inicio } from 'src/views/inicio';
import { NotFound } from 'src/views/not-found';
import { IngresarCaja } from 'src/views/cajas/ingresar-caja';
import { Unavailable } from './unavailable';
import { Cajas } from './cajas/cajas';

/* Definición de las vistas de la aplicación */

export interface Views {
  Inicio: View;
  'Buscar Legajo': View;
  'Buscar Caja': View;
  'Ingresar Caja': View;
  'Retirar Caja': View;
  'Buscar Caja*': View;
  'Buscar Legajo / Doc': View;
  'Buscar Pedido': View;
  Cajas: View;
  'Not Found': View;
}

const views: Views = {
  Inicio: { title: 'Inicio', path: '/', component: <Inicio />, private: true, scope: 'inicio' },
  // Documentos
  'Buscar Legajo': { title: 'Buscar Legajo', path: '/buscar-legajo', component: <Unavailable />, private: true, scope: 'full' },
  // Cajas
  'Buscar Caja': { title: 'Buscar Caja', path: '/buscar-caja', component: <Unavailable />, private: true, scope: 'full' },
  'Ingresar Caja': { title: 'Ingresar Caja', path: '/ingresar-caja', component: <IngresarCaja />, private: true, scope: 'full' },
  'Retirar Caja': { title: 'Retirar Caja', path: '/retirar-caja', component: <Unavailable />, private: true, scope: 'full' },
  // Pedidos
  'Buscar Caja*': { title: 'Buscar Caja', path: '/buscar-caja2', component: <Unavailable />, private: true, scope: 'full' },
  'Buscar Legajo / Doc': {
    title: 'Buscar Legajo / Doc',
    path: '/buscar-legajo-doc',
    component: <Unavailable />,
    private: true,
    scope: 'full',
  },
  'Buscar Pedido': { title: 'Buscar Pedido', path: '/buscar-pedidos', component: <Unavailable />, private: true, scope: 'full' },
  // Cajas
  Cajas: { title: 'Cajas', path: '/cajas', component: <Cajas />, private: true, scope: 'full' },
  // Not Found
  'Not Found': { title: 'No Encontrado', path: undefined, component: <NotFound />, private: false, scope: 'full' },
};

export { views };

export * from 'src/views/types';

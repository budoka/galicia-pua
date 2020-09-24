import React from 'react';
import { View } from 'src/views/types';
import { Home } from 'src/views/home';
import { NotFound } from 'src/views/not-found';
import { Boxes } from 'src/views/boxes';

export const views: View[] = [
  { title: 'Inicio', path: '/inicio', component: <Home />, private: true, scope: 'inicio' },
  { title: 'Buscar Legajo*', path: '/buscar-legajo', component: <Boxes />, private: true, scope: 'full' },
  { title: 'Buscar Caja*', path: '/buscar-caja', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Ingresar Caja*', path: '/ingresar-caja', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Retirar Caja*', path: '/retirar-caja', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Buscar Caja*', path: '/buscar-caja2', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Buscar Legajo / Doc*', path: '/buscar-legajo-doc', component: <NotFound />, private: true, scope: 'full' },
  { title: 'Buscar Pedidos*', path: '/buscar-pedidos', component: <NotFound />, private: true, scope: 'full' },
];

export * from 'src/views/types';

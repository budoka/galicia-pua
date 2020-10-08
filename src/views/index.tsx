import React from 'react';
import { View } from 'src/views/types';
import { Inicio } from 'src/views/inicio';
import { NotFound } from 'src/views/not-found';
import { Cajas } from 'src/views/cajas';
import { Unavailable } from './unavailable';

const views: View[] = [
  { title: 'Inicio', path: '/', component: <Inicio />, private: true, scope: 'inicio' },
  { title: 'Buscar Legajo*', path: '/buscar-legajo', component: <Unavailable />, private: true, scope: 'full' },
  { title: 'Buscar Caja*', path: '/buscar-caja', component: <Unavailable />, private: true, scope: 'full' },
  { title: 'Ingresar Caja', path: '/ingresar-caja', component: <Cajas />, private: true, scope: 'full' },
  { title: 'Retirar Caja*', path: '/retirar-caja', component: <Unavailable />, private: true, scope: 'full' },
  { title: 'Buscar Caja*', path: '/buscar-caja2', component: <Unavailable />, private: true, scope: 'full' },
  { title: 'Buscar Legajo / Doc*', path: '/buscar-legajo-doc', component: <Unavailable />, private: true, scope: 'full' },
  { title: 'Buscar Pedidos*', path: '/buscar-pedidos', component: <Unavailable />, private: true, scope: 'full' },
  // Agregar vistas nuevas acá
];

// Forzar "Not Found" al final de la lista de las vistas.
views.push({ title: 'No Encontrado', path: undefined, component: <NotFound />, private: false, scope: 'full' });

export { views };

export * from 'src/views/types';

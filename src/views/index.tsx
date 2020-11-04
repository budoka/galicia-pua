import React from 'react';
import { View } from 'src/views/types';
import { Inicio } from 'src/views/inicio';
import { NotFound } from 'src/views/not-found';
import { IngresarCaja } from 'src/views/cajas/ingresar-caja';
import { Unavailable } from './unavailable';
import { Cajas } from './cajas/cajas';

/* Definición de las vistas de la aplicación */

const views: View[] = [
  { title: 'Inicio', path: '/', component: <Inicio />, private: true, scope: 'inicio' },
  // Documentos
  { title: 'Buscar Legajo', path: '/buscar-legajo', component: <Unavailable />, private: true, scope: 'full' },
  // Cajas
  { title: 'Buscar Caja', path: '/buscar-caja', component: <Unavailable />, private: true, scope: 'full' },
  { title: 'Ingresar Caja', path: '/ingresar-caja', component: <IngresarCaja />, private: true, scope: 'full' },
  { title: 'Retirar Caja', path: '/retirar-caja', component: <Unavailable />, private: true, scope: 'full' },
  // Pedidos
  { title: 'Buscar Caja*', path: '/buscar-caja2', component: <Unavailable />, private: true, scope: 'full' },
  { title: 'Buscar Legajo / Doc*', path: '/buscar-legajo-doc', component: <Unavailable />, private: true, scope: 'full' },
  { title: 'Buscar Pedido', path: '/buscar-pedidos', component: <Unavailable />, private: true, scope: 'full' },
  // Cajas
  { title: 'Cajas', path: '/cajas', component: <Cajas />, private: true, scope: 'full' },
];

// Forzar "Not Found" al final de la lista de las vistas. No modificar.
views.push({ title: 'No Encontrado', path: undefined, component: <NotFound />, private: false, scope: 'full' });

export { views };

export * from 'src/views/types';

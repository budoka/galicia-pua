import React from 'react';
import { View } from 'src/views/types';
import { Inicio } from 'src/views/inicio';
import { NotFound } from 'src/views/not-found';
import { IngresarCaja } from 'src/views/cajas/ingresar-caja';
import { Unavailable } from './unavailable';
import { Cajas } from './cajas/cajas';
import { EditarCaja } from './cajas/editar-caja';

/* Definición de las vistas de la aplicación */

export interface Views {
  Inicio: View;
  Buscar_Legajo: View;
  Buscar_Caja: View;
  Ingresar_Caja: View;
  Editar_Caja: View;
  Retirar_Caja: View;
  Buscar_Caja2: View;
  Buscar_Legajo_Doc: View;
  Buscar_Pedido: View;
  Cajas: View;
  Not_Found: View;
}

const views: Views = {
  Inicio: { title: 'Inicio', path: '/', component: <Inicio />, private: true, scope: 'inicio' },
  // Documentos
  Buscar_Legajo: { title: 'Buscar Legajo', path: '/buscar-legajo', component: <Unavailable />, private: true, scope: 'full' },
  // Cajas
  Buscar_Caja: { title: 'Buscar Caja', path: '/buscar-caja', component: <Unavailable />, private: true, scope: 'full' },
  Ingresar_Caja: { title: 'Ingresar Caja', path: '/ingresar-caja', component: <IngresarCaja />, private: true, scope: 'full' },
  Editar_Caja: { title: 'Editar Caja', path: '/editar-caja/:id', component: <EditarCaja />, private: true, scope: 'full' },
  Retirar_Caja: { title: 'Retirar Caja', path: '/retirar-caja', component: <Unavailable />, private: true, scope: 'full' },
  // Pedidos
  Buscar_Caja2: { title: 'Buscar Caja', path: '/buscar-caja2', component: <Unavailable />, private: true, scope: 'full' },
  Buscar_Legajo_Doc: {
    title: 'Buscar Legajo / Doc',
    path: '/buscar-legajo-doc',
    component: <Unavailable />,
    private: true,
    scope: 'full',
  },
  Buscar_Pedido: { title: 'Buscar Pedido', path: '/buscar-pedidos', component: <Unavailable />, private: true, scope: 'full' },
  // Cajas
  Cajas: {
    title: 'Cajas',
    path: '/cajas',
    component: <Cajas />,
    private: true,
    scope: 'full',
  },
  // Not Found
  Not_Found: { title: 'No Encontrado', path: undefined, component: <NotFound />, private: false, scope: 'full' },
};

export { views };

export * from 'src/views/types';

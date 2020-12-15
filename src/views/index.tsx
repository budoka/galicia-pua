import React from 'react';
import { NotFound } from 'src/components/not-found';
import { Unavailable } from 'src/components/unavailable';
import { IngresarCaja } from 'src/views/cajas/ingresar-caja';
import { Inicio } from 'src/views/inicio';
import { View } from 'src/views/types';
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
  Inicio: { title: 'Inicio', path: '/', component: <Inicio />, scope: 'user.read' },
  // Documentos
  Buscar_Legajo: { title: 'Buscar Legajo', path: '/buscar-legajo', component: <Unavailable />, scope: 'user.read' },
  // Cajas
  Buscar_Caja: { title: 'Buscar Caja', path: '/buscar-caja', component: <Unavailable />, scope: 'user.read' },
  Ingresar_Caja: { title: 'Ingresar Caja', path: '/ingresar-caja', component: <IngresarCaja />, scope: 'user.read' },
  Editar_Caja: { title: 'Editar Caja', path: '/editar-caja/:id', component: <EditarCaja />, scope: 'user.read' },
  Retirar_Caja: { title: 'Retirar Caja', path: '/retirar-caja', component: <Unavailable />, scope: 'user.read' },
  // Pedidos
  Buscar_Caja2: { title: 'Buscar Caja', path: '/buscar-caja2', component: <Unavailable />, scope: 'user.read' },
  Buscar_Legajo_Doc: {
    title: 'Buscar Legajo / Doc',
    path: '/buscar-legajo-doc',
    component: <Unavailable />,

    scope: 'user.read',
  },
  Buscar_Pedido: { title: 'Buscar Pedido', path: '/buscar-pedidos', component: <Unavailable />, scope: 'user.read' },
  // Cajas
  Cajas: {
    title: 'Cajas',
    path: '/cajas',
    component: <Cajas />,
    scope: 'user.read',
  },
  // Not Found
  Not_Found: { title: 'No Encontrado', path: undefined, component: <NotFound /> },
};

export * from 'src/views/types';
export { views };

import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { InfoSesion } from 'src/features/sesion/types';

export interface PrivateRouteProps extends RouteProps {
  session: InfoSesion;
  loginRedirect: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ session, loginRedirect, children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        session.idUsuario ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: loginRedirect,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

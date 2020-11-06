import { Layout } from 'antd';
import _ from 'lodash';
import React from 'react';
import { Redirect, Route } from 'react-router';
import { Switch } from 'react-router-dom';
import { getUser } from 'src/utils/store';
import { getKey } from 'src/utils/string';
import { View, Views } from 'src/views';
import { Inicio } from 'src/views/inicio';
import { NotFound } from 'src/views/not-found';
import { PrivateRoute } from './privateRouter';

type RouterProps = {
  views: Views;
};

export function Router(props: RouterProps) {
  //console.log('router');

  const renderViews = (views: Views) => {
    return (Object.values(views) as View[])
      .filter(
        (view) =>
          !getUser().permissions || !view.scope || getUser().permissions!.includes('full') || getUser().permissions!.includes(view.scope!),
      )
      .map((view) => {
        const key = view.title;

        return view.private ? (
          <PrivateRoute key={key} exact path={view.path}>
            {view.component}
          </PrivateRoute>
        ) : (
          <Route key={key} exact path={view.path}>
            {view.component}
          </Route>
        );
      });
  };

  return <Switch>{renderViews(props.views)}</Switch>;
}

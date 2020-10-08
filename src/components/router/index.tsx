import { Layout } from 'antd';
import React from 'react';
import { Redirect, Route } from 'react-router';
import { Switch } from 'react-router-dom';
import { getUser } from 'src/utils/store';
import { getKey } from 'src/utils/string';
import { View } from 'src/views';
import { Inicio } from 'src/views/inicio';
import { NotFound } from 'src/views/not-found';
import { PrivateRoute } from './privateRouter';

type RouterProps = {
  views: View[];
};

export function Router(props: RouterProps) {
  //console.log('router');

  const renderViews = (views: View[]) => {
    return views
      .filter(
        (v) => !getUser().permissions || !v.scope || getUser().permissions!.includes('full') || getUser().permissions!.includes(v.scope!),
      )
      .map((view, index) => {
        const key = index;
        //const key = getKey(view.path);
        console.log(view);

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

  const renderNotFoundView = () => {
    return <Route key={'404'} component={NotFound} />;
  };

  return (
    <Switch>
      {renderViews(props.views)}
      {/*renderNotFoundView()*/}
    </Switch>
  );
}

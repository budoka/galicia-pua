import { Layout } from 'antd';
import React from 'react';
import { Redirect, Route } from 'react-router';
import { getUser } from 'src/utils/store';
import { getKey } from 'src/utils/string';
import { View } from 'src/views';
import { PrivateRoute } from './privateRouter';

const { Content } = Layout;

type RouterProps = {
  views: View[];
};

export function Router(props: RouterProps) {
  //console.log('router');

  const renderViews = (views: View[]) => {
    return views
      .filter(
        (v) =>
          !getUser().permissions ||
          !v.scope ||
          getUser().permissions!.includes('full') ||
          getUser().permissions!.includes(v.scope!),
      )
      .map((view) => {
        const key = getKey(view.path);
        //console.log(key);

        return view.private ? (
          <PrivateRoute key={key} exact path={view.path}>
            {view.component}
          </PrivateRoute>
        ) : (
            <Route key={key} push exact path={view.path}>
              {view.component}
            </Route>
          );
      });
  };

  return <Content>{renderViews(props.views)}</Content>;
}

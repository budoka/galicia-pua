import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router';
import { Switch } from 'react-router-dom';
import { getUser } from 'src/utils/store';
import { View, Views } from 'src/views';
import { PrivateRoute } from './privateRouter';

type RouterProps = {
  views: Views;
};

export const Router: React.FC<RouterProps> = React.memo((props) => {
  useEffect(() => console.log('router'));

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

  return (
    <Switch>
      <Redirect from="/:url*(/+)" to={window.location.pathname.slice(0, -1)} />
      {renderViews(props.views)}
    </Switch>
  );
});

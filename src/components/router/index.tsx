import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router';
import { Switch } from 'react-router-dom';
import { View, Views } from 'src/views';

type RouterProps = {
  views: Views;
};

export const Router: React.FC<RouterProps> = React.memo((props) => {
  useEffect(() => console.log('router'));

  const renderViews = (views: Views) => {
    const viewsArray = Object.values(views) as View[];
    return (
      viewsArray
        // .filter((view) => !view.scope)
        .map((view) => {
          const key = view.title;

          return (
            <Route key={key} exact path={view.path}>
              {view.component}
            </Route>
          );
        })
    );
  };

  return (
    <Switch>
      <Redirect from="/:url*(/+)" to={window.location.pathname.slice(0, -1)} />
      {renderViews(props.views)}
    </Switch>
  );
});

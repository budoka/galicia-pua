import { store } from 'src/store';
import { View } from 'src/views';
import { views } from 'src/views';

export const getUser = () => {
  /*const token = store.getState().auth.token!;
  const user = store.getState().auth.username!;
  const permissions = store.getState().auth.permissions;*/
  const token = '';
  const user = 'Dev';
  const permissions = 'full';

  return { user, token, permissions };
};

export const getRoute = () => {
  //console.log(store.getState().router.location);
  return store.getState().router.location.pathname;
};

export const isValidRoute = () => {
  const currentPath = getRoute();

  const view = views.find((view) => view.path === currentPath);
  const isValid = Boolean(view);

  return isValid;
};

export const isPrivatedRoute = () => {
  const currentPath = getRoute();

  const view = views.find((view) => view.path === currentPath);
  const isPrivated = Boolean(view && view.private);

  return isPrivated;
};

const isRoute = (path: View['path']) => {
  const currentPath = getRoute();
  path = path![0] !== '/' ? '/' + path : path;
  //console.log(`# Current path: ${currentPath}, path: ${path}`);
  return currentPath === path;
};

export const hasViewPermission = () => {
  const currentPath = getRoute();
  const view = views.find((view) => view.path === currentPath);

  if (
    view &&
    getUser().permissions &&
    (!view.scope || getUser().permissions!.includes('full') || getUser().permissions!.includes(view.scope!))
  )
    return true;
  return false;
};

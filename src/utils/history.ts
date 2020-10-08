import { history } from 'src/store';

/**
 * Go to home page.
 */
export function goHome() {
  history.push('/');
}

/**
 * Go to back page.
 */
export function goBack() {
  history.goBack();
}

/**
 * Go to page.
 */
export function goTo(path: string) {
  history.push(path);
}

/**
 * Replace the current page.
 */
export function replacePage(path: string) {
  history.replace(path);
}

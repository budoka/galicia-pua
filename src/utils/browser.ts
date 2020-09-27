/**
 * Check if using web browser is IE
 */
export function isIE() {
  const userAgent = window.navigator.userAgent;
  const msie = userAgent.indexOf('MSIE ');
  const msie11 = userAgent.indexOf('Trident/');
  return msie > 0 || msie11 > 0;
}

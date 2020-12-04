import { Rule } from 'antd/lib/form';
import { LabeledValue, SelectValue } from 'antd/lib/select';

export interface BasicComponenetProps<HTMLElement>
  extends React.DetailedHTMLProps<Omit<React.HTMLAttributes<HTMLElement>, 'unselectable'>, HTMLElement> {}

/* export interface BasicComponenetProps2<HTMLElement>
  extends React.DetailedHTMLProps<React.HTMLAttributes<Omit<HTMLElement, 'unselectable'>>, Exclude<HTMLElement, 'unselectable'>> {}
 */

export type ExtractStringPropertyNames<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export interface IElement {
  key: React.Key;
  [key: string]: any;
}

export interface Reglas {
  [key: string]: Rule[];
}

export interface Size {
  width: number;
  height: number;
}

export interface Dictionary<T> {
  [key: string]: T;
}

export interface ObjectLiteral {
  [key: string]: any;
}

export interface QueryParams {
  select?: string[];
  where?: ObjectLiteral;
  offset?: number;
  limit?: number;
  order?: { [P in keyof any]?: 'ASC' | 'DESC' };
}

export interface RequestOptions {
  expiration?: number;
  force?: boolean;
}

export interface Opcion extends LabeledValue {
  /*   key?: React.Key;
  valor: number | string;
  descripcion: string; */
}

export interface CacheableState {
  cache: { key: string; expiration?: number };
}

declare module 'antd/lib/select' {
  // export interface OptionProps extends Opcion {}
  // export interface OptionProps extends FiltroTipoCajaResponse, FiltroTipoContenidoCajaResponse, FiltroPlantillaRequest
}

/* declare module 'antd/lib/select' {
  export interface OptionProps extends Opcion {}
}
 */

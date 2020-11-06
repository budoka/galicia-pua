export interface BasicComponenetProps<HTMLElement>
  extends React.DetailedHTMLProps<React.HTMLAttributes<Exclude<HTMLElement, 'unselectable'>>, Exclude<HTMLElement, 'unselectable'>> {}

export interface IElement {
  key: React.Key;
  [key: string]: any;
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


import { ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export type Scope = 'full' | 'inicio';

export interface View {
  title: string;
  path?: string;
  component: JSX.Element;
  private: boolean;
  scope?: Scope;
}

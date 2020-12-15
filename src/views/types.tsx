export type Scope = 'user.read' | 'user.write';

export interface View {
  title: string;
  path?: string;
  component: JSX.Element;
  scope?: Scope;
}

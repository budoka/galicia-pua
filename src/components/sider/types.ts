import { View } from 'src/views';

export interface SiderParentItem {
  title: string;
  children: SiderChildItem[];
  icon?: React.ReactNode;
}

export interface SiderChildItem {
  view: View;
  icon?: React.ReactNode;
  hidden?: boolean;
}

export type SiderItem = SiderParentItem | SiderChildItem;

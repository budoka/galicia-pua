export interface IListCard {
  title?: React.ReactNode;
  items?: IListCardItem[];
}

export interface IListCardItem {
  description: React.ReactNode;
  count?: number;
  path?: string;
}

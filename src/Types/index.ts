export interface DataItem {
  if?: string;
  then?: Data;
  else?: Data;
}

export type Data = (string | DataItem)[];

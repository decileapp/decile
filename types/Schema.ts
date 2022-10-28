import { Column } from "./Column";
import { Table } from "./Table";

export interface Schema extends Table {
  columns?: Column[];
}

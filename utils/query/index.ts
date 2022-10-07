export interface Table {
  name: string;
  join: string;
}

export interface QueryVar {
  name: string;
  type: string;
  function: string;
}

export interface SortBy {
  var: string[];
  type: string;
}

export interface FilterBy {
  var: string;
  operator: string;
  value: number | string;
  combo: string;
}

export const isNumerical = (x: string) => {
  if (x === "bigint") {
    return true;
  }

  if (x === "double precission") {
    return true;
  }

  return false;
};

const queryBuilder = ({
  tables,
  vars,
  sortBy,
  filterBy,
  limit,
}: {
  tables: Table[];
  vars: QueryVar[];
  sortBy?: SortBy[];
  filterBy?: FilterBy[];
  limit?: string;
}) => {
  // If all the text variables are not in group by, throw an error

  // Generate select vars
  const selectVars = vars
    .map((v) => {
      if (
        isNumerical(v.type) &&
        v.function !== "GROUP" &&
        v.function !== "NONE"
      ) {
        return `${v.function}('${v.name}')`;
      }

      return `"${v.name}"`;
    })
    .join(", ");

  // Tables
  const tableNames = tables[0].name;

  // Where clause
  let whereClause = "";
  if (filterBy) {
    whereClause =
      `${filterBy[0].var} ${filterBy[0].operator} '${filterBy[0].value}'` || "";
    if (filterBy.length > 0) {
      filterBy.map((f, id) => {
        whereClause =
          whereClause +
          `${filterBy[id - 1].combo} ${f.var} ${f.operator} '${
            filterBy[0].value
          }'`;
        return;
      });
    }
  }

  // Group by
  const groupBy = vars.filter((q) => q.function === "GROUP");

  // Sory by
  let sortClause = "";
  if (sortBy) {
    sortBy.map((s) => {
      sortClause + " " + s.var + " " + s.type;
      return;
    });
  }

  let query = `
  SELECT 
    ${selectVars} 
  FROM 
    public.${tableNames}`;

  if (filterBy) {
    query = query + " " + "WHERE" + " " + whereClause;
  }

  if (groupBy.length > 0) {
    query =
      query + " " + "GROUP BY" + " " + groupBy.map((g) => g.name).join(" ");
  }

  if (sortClause) {
    query = query + " " + "ORDER BY" + " " + sortClause;
  }

  if (limit) {
    query = query + " " + "LIMIT" + " " + limit;
  }

  query = query + ";";

  return query;
};

export default queryBuilder;

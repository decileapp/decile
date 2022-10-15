// Interfaces
export interface Table {
  name: string;
  join: string;
}

export interface QueryVar {
  name: string;
  type: string;
}

export interface GroupBy extends QueryVar {
  function: string;
}

export interface SortBy {
  name: string;
  type: string;
}

export interface FilterBy {
  var: string;
  operator: string;
  value: number | string;
  combo: string;
}

export interface QueryInputs {
  tables: Table[];
  vars: QueryVar[];
  sortBy?: SortBy[];
  filterBy?: FilterBy[];
  groupBy?: GroupBy[];
  limit?: string;
}

// Objects
export const fitlerOperators = ["=", ">", "<", ">=", "<=", "!="];
export const filterComboOperators = ["AND", "OR"];
export const textSummarise = [
  {
    title: "Group",
    description: "Aggregate numerical values by collapsing this variable.",
    value: "GROUP",
    current: true,
  },
  {
    title: "Count",
    description: "Count all the instances of this column.",
    value: "COUNT",
    current: true,
  },
];
export const numericalSummarise = textSummarise.concat([
  {
    title: "Sum",
    description: "Aggregate this variable by summing its values.",
    value: "SUM",
    current: true,
  },
  {
    title: "Average",
    description: "Calculate a simple average of this value.",
    value: "AVG",
    current: false,
  },
  {
    title: "Min",
    description: "Calculate a simple average of this value.",
    value: "MIN",
    current: false,
  },
  {
    title: "Max",
    description: "Calculate a simple average of this value.",
    value: "MAX",
    current: false,
  },
]);

// Functions
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
  groupBy,
}: QueryInputs) => {
  // If all the text variables are not in group by, throw an error

  // Generate select vars
  const selectVars = vars
    .map((v) => {
      // Check if variable has been grouped
      let grouped: GroupBy | undefined;
      grouped = groupBy?.find((g) => g.name === v.name);

      if (grouped && grouped.function !== "GROUP") {
        return `${grouped.function}("${v.name}")`;
      }

      return `"${v.name}"`;
    })
    .join(", ");

  // Tables
  const tableNames = tables[0].name;

  // Where clause
  let whereClause = "";
  if (filterBy && filterBy.length > 0) {
    filterBy.map((f, id) => {
      // for everything but the last value
      if (id < filterBy.length - 1) {
        whereClause =
          whereClause + `"${f.var}" ${f.operator} '${f.value}' ${f.combo} `;
      } else {
        whereClause = whereClause + `"${f.var}" ${f.operator} '${f.value}'`;
      }

      return;
    });
  }

  // Sory by
  let sortClause = "";
  if (sortBy && sortBy.length > 0) {
    sortBy.map((s) => {
      sortClause = sortClause + " " + `"${s.name}"` + " " + s.type;
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

  if (groupBy && groupBy.length > 0) {
    query =
      query +
      " " +
      "GROUP BY" +
      " " +
      groupBy
        .filter((g) => g.function === "GROUP")
        .map((g) => `"${g.name}"`)
        .join(",");
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

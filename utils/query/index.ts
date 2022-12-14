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
export const textFilterOperators = [
  {
    title: "=",
    description: "Equal to.",
    value: "=",
    current: false,
  },
  {
    title: "!=",
    description: "Not equal to.",
    value: "!=",
    current: false,
  },
];

export const numericalFilterOperators = textFilterOperators.concat([
  {
    title: ">",
    description: "Greater than.",
    value: ">",
    current: false,
  },
  {
    title: ">=",
    description: "Greater than or equal to",
    value: ">=",
    current: false,
  },
  {
    title: "<",
    description: "Less than.",
    value: "<",
    current: false,
  },
  {
    title: "<=",
    description: "Less than or equal to",
    value: "<=",
    current: false,
  },
]);

export const filterComboOperators = [
  {
    title: "and",
    description: "",
    value: "AND",
    current: false,
  },
  {
    title: "or",
    description: "",
    value: "OR",
    current: false,
  },
];

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
  if (
    [
      "smallint",
      "integer",
      "bigint",
      "decimal",
      "numeric",
      "real",
      "double precision",
      "smallserial",
      "serial",
      "bigserial",
      "money",
    ].includes(x)
  ) {
    return true;
  } else {
    return false;
  }
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
  const rawSelectVars = vars.map((v) => {
    // Check if variable has been grouped
    let grouped: GroupBy | undefined;
    grouped = groupBy?.find((g) => g.name === v.name);

    if (grouped && grouped.function !== "GROUP") {
      return `${grouped.function}("${v.name}")`;
    }

    return `"${v.name}"`;
  });

  const selectVars = rawSelectVars.join(", ");

  // Tables
  const tableNames = tables[0].name;

  // Where clause
  let whereClause = "";
  if (filterBy && filterBy.length > 0) {
    filterBy.map((f, id) => {
      // for everything but the last value
      if (id < filterBy.length - 1) {
        // If there is no value
        if (!f.value) {
          if (f.operator === "!=") {
            whereClause = whereClause + `"${f.var}" is not null ${f.combo} `;
            return;
          }
          if (f.operator === "=") {
            whereClause = whereClause + `"${f.var}" is null ${f.combo} `;
            return;
          }
        }
        whereClause =
          whereClause + `"${f.var}" ${f.operator} '${f.value}' ${f.combo} `;
      } else {
        // If there is no value
        if (!f.value) {
          if (f.operator === "!=") {
            whereClause = whereClause + `"${f.var}" is not null `;
            return;
          }
          if (f.operator === "=") {
            whereClause = whereClause + `"${f.var}" is null `;
            return;
          }
        }
        whereClause = whereClause + `"${f.var}" ${f.operator} '${f.value}'`;
      }

      return;
    });
  }

  // Sort by
  let sortClause = "";
  if (sortBy && sortBy.length > 0) {
    sortBy.map((s) => {
      // Find the summarised variable
      const index = vars.findIndex((x) => x.name === s.name);

      // sortClause = sortClause + " " + `"${s.name}"` + " " + s.type;
      sortClause = sortClause + " " + rawSelectVars[index] + " " + s.type;
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

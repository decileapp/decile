import React from "react";

type Props = {
  labels: string[];
};

const TableHeader: React.FC<Props> = ({ ...props }) => {
  const { labels } = props;
  return (
    <thead className="">
      <tr>
        {labels.map((l, id) => {
          return (
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6  bg-zinc-700 text-zinc-100 dark:bg-zinc-200 dark: dark:text-zinc-700"
              key={id}
            >
              {l}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;

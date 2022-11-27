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
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6  bg-zinc-300 dark:bg-zinc-600 truncate"
              key={`${l}-${id}`}
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

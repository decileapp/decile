import _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Source } from "../../../types/Sources";
import { selectedSourceState } from "../../../utils/contexts/query/state";
import axios from "axios";
import Loading from "../../individual/Loading";
import { Schema } from "../../../types/Schema";
import { classNames } from "../../../utils/classnames";
import { isNumerical } from "../../../utils/query";

interface Props {
  sources?: Source[];
}

const Schema: React.FC<Props> = (props) => {
  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);
  const [schema, setSchema] = useState<Schema[]>([]);
  const [schemaLoading, setSchemaloading] = useState(false);

  // Get tables
  const getSchema = async () => {
    try {
      setSchema([]);
      setSchemaloading(true);
      if (!selectedSource || !props.sources) {
        return;
      }
      const selectedDb = props?.sources.find((s) => s.id === selectedSource);

      if (!selectedDb) return;

      const res = await axios.post("/api/user/postgres/get-schema", {
        ...selectedDb,
      });
      if (res) {
        setSchema(res.data.schema);
      }
      setSchemaloading(false);
      return;
    } catch (e) {
      setSchemaloading(false);
      return;
    }
  };

  useEffect(() => {
    getSchema();
  }, [selectedSource]);

  const tableComp = (x: Schema) => {
    const numerical = x.columns?.filter((c) => isNumerical(c.type));
    const textual = x.columns?.filter((c) => !isNumerical(c.type));
    let sortedColumns = textual;
    if (numerical) {
      sortedColumns = textual?.concat(numerical);
    }
    return (
      <div className="flex flex-col p-2 border border-zinc-200 rounded-lg">
        <p className="text-md font-bold">{x.title}</p>
        <div className="mt-2">
          {sortedColumns && sortedColumns.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {sortedColumns.map((c, id) => {
                return (
                  <div
                    className={
                      "flex flex-row space-x-1 justify-between items-center  key={id}  rounded-lg "
                    }
                    key={id}
                  >
                    <p className=" text-sm truncate">{c.title}</p>
                    <p
                      className={classNames(
                        isNumerical(c.type)
                          ? "text-primary-600"
                          : "text-secondary-600",
                        "text-xs truncate italic"
                      )}
                      key={id}
                    >
                      {c.type}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  let mainComp;
  if (schemaLoading) {
    mainComp = (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  } else {
    mainComp = (
      <div className="grid grid-cols-6 gap-4">
        {schema &&
          schema.length > 0 &&
          schema.map((s) => {
            return <div className="col-span-1">{tableComp(s)}</div>;
          })}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 justify-start items-center h-full w-full">
      <div>
        <p className="text-lg font-bold mb-2">Table summary</p>
        <p className="text-sm">{`Tables and varaibles in your database`}</p>
      </div>
      {mainComp}
    </div>
  );
};

export default Schema;

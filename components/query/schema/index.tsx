import _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Source } from "../../../types/Sources";
import { selectedSourceState } from "../../../utils/contexts/query/state";
import axios from "axios";

interface Props {
  sources?: Source[];
}

const Schema: React.FC<Props> = (props) => {
  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);
  const [schema, setSchema] = useState();
  const [schemaLoading, setSchemaloading] = useState(false);

  // Get tables
  const getSchema = async () => {
    try {
      setSchema(undefined);
      setSchemaloading(true);
      if (!selectedSource || !props.sources) {
        return;
      }
      const selectedDb = props?.sources.find((s) => s.id === selectedSource);

      if (!selectedDb) return;

      const res = await axios.post("/api/user/postgres/get-schema-diagram", {
        ...selectedDb,
      });
      if (res) {
        console.log(res.data);
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

  return <div>p</div>;
};

export default Schema;

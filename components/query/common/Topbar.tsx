import { Source } from "../../../types/Sources";
import TextInput from "../../individual/TextInput";
import Select from "../../individual/Select";
import Switch from "../../individual/Switch";
import _ from "lodash";
import dateFormatter from "../../../utils/dateFormatter";
import {
  CodeIcon,
  EyeIcon,
  EyeOffIcon,
  InformationCircleIcon,
  TableIcon,
} from "@heroicons/react/outline";
import { selectedSourceState } from "../../../utils/contexts/query/state";
import { useRecoilState } from "recoil";
import { useState } from "react";
import Schema from "./schema";
import FullPageDialog from "../../individual/FullPageDialog";
import Button from "../../individual/Button";

interface Props {
  id?: string;
  name?: string;
  setName: (x: string) => void;
  publicQuery?: boolean;
  setPublicQuery: (x: boolean) => void;
  sources: Source[];
  queryBuilder: boolean;
  setQueryBuilder: (x: boolean) => void;
  savedAt?: Date;
  saving: boolean;
  error?: string;
}

const QueryTopBar: React.FC<Props> = (props) => {
  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);
  const [diagram, setDiagram] = useState(false);
  const {
    id,
    name,
    setName,
    publicQuery,
    setPublicQuery,
    sources,
    queryBuilder,
    setQueryBuilder,
    savedAt,
    saving,
    error,
  } = props;

  if (diagram) {
    return (
      <FullPageDialog open={diagram} setOpen={setDiagram}>
        <Schema sources={sources} />
      </FullPageDialog>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 border-b border-zinc-400 w-full items-start justify-between p-4">
        <div className="flex flex-row justify-start items-start space-x-4 ">
          {props.sources && (
            <Select
              title="Database"
              value={selectedSource || ""}
              id="database"
              name="database"
              setSelected={setSelectedSource}
              options={sources.map((s) => {
                return { name: s.name, value: s.id };
              })}
            />
          )}
          <TextInput
            name="name"
            id="name"
            handleChange={setName}
            label="Supabase"
            value={name || ""}
            type="text"
            title="Name"
            error={error}
          />
          <Switch
            setSelected={() => setPublicQuery(!publicQuery)}
            value={publicQuery}
            title={publicQuery ? "Public query" : "Private query"}
            trueIcon={<EyeIcon />}
            falseIcon={<EyeOffIcon />}
          />
        </div>
        <div className="flex flex-row justify-end items-start">
          <Button
            onClick={() => setDiagram(!diagram)}
            label="Summary"
            type="text-plain"
            icon={<InformationCircleIcon className="h-5 w-5" />}
          />

          <div className="flex flex-col items-end justify-start ">
            <p>{queryBuilder ? "Query builder" : "Write SQL"}</p>
            <Switch
              setSelected={setQueryBuilder}
              value={queryBuilder}
              trueIcon={<TableIcon />}
              falseIcon={<CodeIcon />}
            />

            <div className="text-sm mt-2">
              {!savedAt && !saving && (
                <p className=" text-red-500">Changes not saved</p>
              )}
              {savedAt && !saving && (
                <p className="text-sm ">{`Last saved: ${dateFormatter({
                  dateVar: savedAt,
                  type: "time",
                })}`}</p>
              )}
              {saving && <p className="text-sm">Saving...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryTopBar;

import { Source } from "../../../../types/Sources";
import TextInput from "../../../individual/TextInput";
import Select from "../../../individual/Select";
import Switch from "../../../individual/Switch";
import _ from "lodash";
import {
  EyeIcon,
  EyeOffIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import {
  nameState,
  publicQueryState,
  selectedSourceState,
} from "../../../../utils/contexts/query/state";
import { useRecoilState } from "recoil";
import { useState } from "react";
import Schema from "./schema";
import FullPageDialog from "../../../individual/FullPageDialog";
import InputLabel from "../../../individual/common/InputLabel";
import QueryTypeSelector from "./QueryType";
import DatabaseSelector from "./DatabaseSelector";

interface Props {
  sources: Source[];
  changeDatabase: (x: string) => void;
  error?: string;
}

const QueryTopBar: React.FC<Props> = (props) => {
  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);
  const [name, setName] = useRecoilState(nameState);
  const [publicQuery, setPublicQuery] = useRecoilState(publicQueryState);
  const [diagram, setDiagram] = useState(false);
  const { sources, error, changeDatabase } = props;

  if (diagram) {
    return (
      <FullPageDialog open={diagram} setOpen={setDiagram}>
        <Schema sources={sources} />
      </FullPageDialog>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 border-b border-zinc-400 w-full items-start justify-between p-4">
        <div className="col-span-3 flex flex-row justify-start items-start space-x-4 ">
          <div className="w-48">
            <DatabaseSelector
              sources={sources}
              changeDatabase={changeDatabase}
            />
          </div>
          <TextInput
            name="name"
            id="name"
            handleChange={setName}
            label="Name"
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
          <div className="flex flex-col items-end justify-start ">
            <QueryTypeSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryTopBar;

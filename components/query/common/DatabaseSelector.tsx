import { Source } from "../../../types/Sources";
import Select from "../../individual/Select";
import _ from "lodash";
import {
  ChevronLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import { selectedSourceState } from "../../../utils/contexts/query/state";
import { useRecoilState } from "recoil";
import { useState } from "react";
import Schema from "./schema";
import FullPageDialog from "../../individual/FullPageDialog";
import InputLabel from "../../individual/common/InputLabel";

interface Props {
  sources: Source[];
  changeDatabase: (x: number) => void;
  error?: string;
  setShowSchema?: (x: boolean) => void;
}

const DatabaseSelector: React.FC<Props> = (props) => {
  const [selectedSource, setSelectedSource] =
    useRecoilState(selectedSourceState);
  const [diagram, setDiagram] = useState(false);
  const { sources, error, changeDatabase, setShowSchema } = props;

  if (diagram) {
    return (
      <FullPageDialog open={diagram} setOpen={setDiagram}>
        <Schema sources={sources} />
      </FullPageDialog>
    );
  }

  return (
    <div className="flex flex-col justify-start items-start  w-full">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="space-x-2 flex flex-row">
          <InputLabel title="Source" />
          {selectedSource && (
            <a
              className=" hover:text-primary-500"
              onClick={() => setDiagram(!diagram)}
              href="#"
            >
              <InformationCircleIcon className="h-5 w-5 hover:text-primary-500 text-zinc-600" />
            </a>
          )}
        </div>
        {setShowSchema && (
          <div>
            <ChevronLeftIcon
              className="h-5 w-5 hover:text-primary-500 "
              onClick={() => setShowSchema(false)}
            />
          </div>
        )}
      </div>
      <Select
        value={selectedSource?.toString() || ""}
        id="database"
        name="database"
        setSelected={(x) => changeDatabase(parseInt(x, 10))}
        options={sources.map((s) => {
          return { name: s.name, value: s.id.toString() };
        })}
      />
    </div>
  );
};

export default DatabaseSelector;

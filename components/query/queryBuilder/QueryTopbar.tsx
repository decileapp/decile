import Select, { Option } from "../../individual/Select";
import TextInput from "../../individual/TextInput";
import Switch from "../../individual/Switch";
import _ from "lodash";
import dateFormatter from "../../../utils/dateFormatter";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Source } from "../../../types/Sources";
import Button from "../../individual/Button";

interface Props {
  sources?: Source[];
  setSelectedSource: (x: string) => void;
  selectedSource?: string;
  name?: string;
  setName: (x: string) => void;
  publicQuery?: boolean;
  setPublicQuery: (x: boolean) => void;
  savedAt?: Date;
  saving: boolean;
  error?: string;
  run?: boolean;
  runFunc?: () => void;
}

const QueryTopbar: React.FC<Props> = (props) => {
  const {
    sources,
    selectedSource,
    setSelectedSource,
    name,
    setName,
    publicQuery,
    setPublicQuery,
    savedAt,
    saving,
    error,
    run,
    runFunc,
  } = props;

  return (
    <div className="grid grid-cols-2 gap-4 w-full items-end justify-between p-2">
      <div className="flex flex-row justify-start items-start space-x-4 ">
        {sources && (
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
      <div className="flex flex-col items-end justify-between space-y-2">
        {run && runFunc && (
          <Button label="Run" onClick={() => runFunc()} type="secondary" />
        )}
        {savedAt && !saving && (
          <p className="text-sm">{`Last saved: ${dateFormatter({
            dateVar: savedAt,
            type: "time",
          })}`}</p>
        )}
        {!savedAt && !saving && (
          <p className="text-sm text-red-500">Changes not saved</p>
        )}
        {saving && <p className="text-sm">Saving...</p>}
      </div>
    </div>
  );
};

export default QueryTopbar;

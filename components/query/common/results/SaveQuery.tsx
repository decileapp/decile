import { supabase } from "../../../../utils/supabaseClient";
import Button from "../../../individual/Button";
import BasicDialog from "../../../individual/common/BasicDialog";
import TextInput from "../../../individual/TextInput";
import Switch from "../../../individual/Switch";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import {
  nameState,
  publicQueryState,
} from "../../../../utils/contexts/query/state";
import { useUser } from "@supabase/auth-helpers-react";

interface Props {
  open: boolean;
  setOpen: (x: boolean) => void;
  confirmFunc: () => void;
}

const SaveQuery: React.FC<Props> = (props) => {
  const { open, setOpen, confirmFunc } = props;

  // Chart details
  const [name, setName] = useRecoilState(nameState);
  const [publicQuery, setPublicQuery] = useRecoilState(publicQueryState);
  const user = useUser();

  return (
    <BasicDialog open={open} setOpen={setOpen}>
      <div className="flex flex-col space-y-4">
        <TextInput
          name="name"
          id="name"
          handleChange={setName}
          label="Name"
          value={name || ""}
          type="text"
          title="Name"
        />
        <Switch
          setSelected={() => setPublicQuery(!publicQuery)}
          value={publicQuery}
          title={publicQuery ? "Public query" : "Private query"}
          trueIcon={<EyeIcon />}
          falseIcon={<EyeOffIcon />}
        />
      </div>
      <div className="flex flex-row mt-4 items-center justify-end">
        <Button label="Save" onClick={() => confirmFunc()} type="primary" />
      </div>
    </BasicDialog>
  );
};

export default SaveQuery;

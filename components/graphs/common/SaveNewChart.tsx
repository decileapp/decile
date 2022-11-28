import { Serie } from "@nivo/line";
import { ReactElement, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../../utils/supabaseClient";
import Button from "../../individual/Button";
import BasicDialog from "../../individual/common/BasicDialog";

import TextInput from "../../individual/TextInput";
import Switch from "../../individual/Switch";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useRecoilValue } from "recoil";
import {
  publicQueryState,
  queryIdState,
} from "../../../utils/contexts/query/state";
import { useUser } from "@supabase/auth-helpers-react";

interface Props {
  open: boolean;
  setOpen: (x: boolean) => void;
  title?: string;
  setTitle: (x: string) => void;
  publicChart?: boolean;
  setPublicChart: (x: boolean) => void;
  confirmFunc: () => void;
}

const SaveChart: React.FC<Props> = (props) => {
  const {
    open,
    setOpen,
    title,
    setTitle,
    publicChart,
    setPublicChart,
    confirmFunc,
  } = props;

  // Chart details
  const queryId = useRecoilValue(queryIdState);
  const publicQuery = useRecoilValue(publicQueryState);
  const user = useUser();

  return (
    <BasicDialog open={open} setOpen={setOpen}>
      <div className="flex flex-col space-y-4">
        <TextInput
          name="chartName"
          id="chartName"
          handleChange={setTitle}
          value={title || ""}
          type="text"
          title="Chart name"
          label="New users"
        />
        {publicQuery && (
          <Switch
            setSelected={() => setPublicChart(!publicChart)}
            value={publicChart}
            title={publicChart ? "Public chart" : "Private chart"}
            trueIcon={<EyeIcon />}
            falseIcon={<EyeOffIcon />}
          />
        )}
        {!publicQuery && (
          <p className="text-sm">
            This chart will be private because the underlying query is private.
          </p>
        )}
      </div>
      <div className="flex flex-row mt-4 items-center justify-end">
        <Button label="Save" onClick={() => confirmFunc()} type="primary" />
      </div>
    </BasicDialog>
  );
};

export default SaveChart;

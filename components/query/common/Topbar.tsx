import { useCallback, useEffect, useRef, useState } from "react";
import Loading from "../../individual/Loading";
import axios from "axios";
import { supabase } from "../../../utils/supabaseClient";
import Page from "../../layouts/Page";
import { Source } from "../../../types/Sources";
import TextInput from "../../individual/TextInput";
import Select from "../../individual/Select";
import Switch from "../../individual/Switch";
import { toast, ToastContainer } from "react-toastify";
import { Column } from "../../../types/Column";
import _ from "lodash";
import dateFormatter from "../../../utils/dateFormatter";
import {
  CodeIcon,
  EyeIcon,
  EyeOffIcon,
  TableIcon,
} from "@heroicons/react/outline";
import Columnns from "./../editor/columns";
import Results from "./results";
import Editor from "./../editor/editor";
import QueryBuilder from "./../builder";
import { classNames } from "../../../utils/classnames";
import {
  bodyState,
  buildQueryState,
  columnsLoadingState,
  columnsState,
  dataState,
  fieldsState,
  nameState,
  publicQueryState,
  queryVarsState,
  selectedSourceState,
  selectedTableState,
  tableLoadingState,
  tablesState,
} from "../../../utils/contexts/query/state";
import { useRecoilState, useRecoilValue } from "recoil";
import TableSelector from "./../common/TableSelector";

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
        <div className="flex flex-row justify-end items-end">
          <div className="flex flex-col items-end ">
            <p>{queryBuilder ? "Query builder" : "Write SQL"}</p>
            <Switch
              setSelected={setQueryBuilder}
              value={queryBuilder}
              trueIcon={<TableIcon />}
              falseIcon={<CodeIcon />}
            />
            {savedAt && !saving && (
              <p className="text-sm mt-2">{`Last saved: ${dateFormatter({
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
      </div>
    </div>
  );
};

export default QueryTopBar;

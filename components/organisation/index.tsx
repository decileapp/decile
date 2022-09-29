import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, UserGroupIcon } from "@heroicons/react/outline";
import BasicDialog from "../individual/common/BasicDialog";
import Button from "../individual/Button";
import TextInput from "../individual/TextInput";
import { supabase } from "../../utils/supabaseClient";
import { toast } from "react-toastify";
import MiniLoading from "../individual/MiniLoading";
import updateOrgForSession from "../../utils/organisation/updateOrgForSession";

interface Props {
  open: boolean;
}

const OrganisationPopup: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(props.open);
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState<string>();
  const user = supabase.auth.user();

  const updateOrg = async () => {
    try {
      if (!user || !orgName) {
        return;
      }
      setLoading(true);

      // Check there is no org already
      const { data: checkOrg } = await supabase
        .from("organisations")
        .select("id")
        .match({ user_id: user?.id })
        .single();

      if (checkOrg) {
        toast.error("Organisation already exists for this user.");
        setOpen(false);
        return;
      }

      // Create org
      const { data, error: orgError } = await supabase
        .from("organisations")
        .insert({
          name: orgName,
          user_id: user?.id,
        })
        .single();

      // Create role
      if (data) {
        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .insert({
            org_id: data.id,
            user_id: user?.id,
            role: "ADMIN",
          })
          .single();
        // Close dialog
        if (roleData) {
          await updateOrgForSession(user);
          setOpen(false);
        }
        // If it doesnt work delete org
        else {
          const { data: deleted, error } = await supabase
            .from("organisations")
            .delete()
            .match({ id: data.id });
        }
      }
      setLoading(false);
      return;
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error("Something went wrong.");
    }
  };

  return (
    <BasicDialog open={open} setOpen={setOpen}>
      <div className="sm:flex sm:items-start">
        <div
          className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-400 sm:mx-0 sm:h-10 sm:w-10`}
        >
          <UserGroupIcon className="text-primary-800 h-8 w-8" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Dialog.Title
            as="h3"
            className={`text-lg leading-6 font-medium text-primary-600`}
          >
            Company name
          </Dialog.Title>
          <TextInput
            name="orgName"
            id="orgName"
            value={orgName || ""}
            handleChange={setOrgName}
            type="text"
            label="Acme"
          />
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        {loading ? (
          <MiniLoading />
        ) : (
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-primary-500 shadow-sm px-4 py-2 text-primary-600 text-base font-medium  hover:bg-primary-700 hover:text-white sm:ml-3 sm:w-auto sm:text-sm`}
            onClick={() => updateOrg()}
          >
            Save
          </button>
        )}
      </div>
    </BasicDialog>
  );
};

export default OrganisationPopup;

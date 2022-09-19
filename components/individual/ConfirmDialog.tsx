import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import BasicDialog from "./common/BasicDialog";
import Button from "./Button";

type Props = {
  title: string;
  description: string;
  id: string;
  name: string;
  buttonText: string;
  confirmFunc: () => void;
  open: boolean;
  setOpen: (x: boolean) => void;
  icon: React.ComponentProps<"svg">;
  color: string;
};

const ConfirmDialog: React.FC<Props> = ({ ...props }) => {
  const cancelButtonRef = useRef(null);
  const {
    open,
    setOpen,
    title,
    description,
    name,
    buttonText,
    confirmFunc,
    icon,
    color,
  } = props;

  return (
    <BasicDialog open={open} setOpen={setOpen}>
      <div className="sm:flex sm:items-start">
        <div
          className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${props.color}-100 dark:bg-${props.color}-400 sm:mx-0 sm:h-10 sm:w-10`}
        >
          {props.icon}
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Dialog.Title
            as="h3"
            className={`text-lg leading-6 font-medium text-${props.color}-600`}
          >
            {props.title}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm dark:">{props.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className={`w-full inline-flex justify-center rounded-md border border-${props.color}-500 shadow-sm px-4 py-2 text-${props.color}-600 text-base font-medium  hover:bg-${props.color}-700 sm:ml-3 sm:w-auto sm:text-sm`}
          onClick={() => props.confirmFunc()}
        >
          {props.buttonText}
        </button>

        <Button
          label="Cancel"
          type="primary"
          onClick={() => props.setOpen(false)}
        />
      </div>
    </BasicDialog>
  );
};

export default ConfirmDialog;

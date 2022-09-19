import React from "react";
import InputLabel from "./common/InputLabel";
import moment from "moment";

type Props = {
  title?: string;
  description?: string;
  id: string;
  name: string;
  value: Date | null;
  handleChange: (e: Date) => void;
  disabled?: boolean;
};

const DatePicker: React.FC<Props> = ({ ...props }) => {
  const { id, name, value, handleChange, title, description } = props;
  return (
    <div className="relative">
      {title && <InputLabel title={title} />}

      <input
        type="date"
        id={id}
        className="p-y-2 max-w-md shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
        name={name}
        value={
          moment(value).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD")
        }
        onChange={(e) => {
          handleChange(new Date(e.target.valueAsNumber));
        }}
      />
    </div>
  );
};

export default DatePicker;

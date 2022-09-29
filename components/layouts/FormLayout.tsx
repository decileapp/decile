import React from "react";
import Loading from "../individual/Loading";
import PageHeading from "./Page/PageHeading";

type Props = {
  pageLoading?: boolean;
  heading?: string;
};

const FormLayout: React.FC<Props> = ({
  children,
  pageLoading = false,
  heading,
}) => {
  return pageLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <form className="flex flex-col w-full h-full justify-center sm:w-1/3 2xl:w-1/4 space-y-4 p-4 ">
        {heading && <PageHeading title={heading} />}
        {children}
      </form>
    </div>
  );
};

export default FormLayout;

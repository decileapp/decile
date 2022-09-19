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
    <form className="flex flex-col w-full sm:w-1/3 2xl:w-1/4 py-6 sm:px-4 space-y-6 sm:p-6">
      {heading && <PageHeading title={heading} />}
      {children}
    </form>
  );
};

export default FormLayout;

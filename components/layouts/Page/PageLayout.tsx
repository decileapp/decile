import React from "react";
import Loading from "../../individual/Loading";
import Footer from "../Footer";

type Props = {
  pageLoading?: boolean;
  footer?: boolean;
};

const PageLayout: React.FC<Props> = ({
  children,
  pageLoading = false,
  footer = false,
}) => {
  return pageLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col flex-grow p-8 overflow-hidden">
      {children}
    </div>
  );
};

export default PageLayout;

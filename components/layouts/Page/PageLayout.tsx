import React from "react";
import { boolean } from "yup";
import { classNames } from "../../../utils/classnames";
import Loading from "../../individual/Loading";
import Footer from "../Footer";

type Props = {
  pageLoading?: boolean;
  footer?: boolean;
  padding?: boolean;
};

const PageLayout: React.FC<Props> = ({
  children,
  pageLoading = false,
  footer = false,
  padding = true,
}) => {
  return pageLoading ? (
    <Loading />
  ) : (
    <div
      className={classNames(
        padding ? "px-4 " : "",
        "flex flex-col flex-grow h-full overflow-hidden"
      )}
    >
      {children}
    </div>
  );
};

export default PageLayout;

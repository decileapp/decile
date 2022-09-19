import PageLayout from "./PageLayout";
import PageHeading from "./PageHeading";
import PageDescription from "./PageDescription";
import Button from "../../individual/Button";
import { classNames } from "../../../utils/classnames";

type Props = {
  pageLoading?: boolean;
  title?: string;
  description?: string;
  button?: string;
  onClick?: () => void;
  footer?: boolean;
  align?: "left" | "center";
};

const Page: React.FC<Props> = (props) => {
  const {
    pageLoading,
    title,
    description,
    button,
    onClick,
    footer,
    children,
    align,
  } = props;

  return (
    <PageLayout pageLoading={pageLoading} footer={footer} key="page">
      <div className={"sm:items-center sm:flex"}>
        <div
          className={classNames(
            align === "center" ? "items-center" : "",
            "flex flex-col sm:flex-auto mb-4"
          )}
        >
          {title && <PageHeading title={title} />}
          {description && <PageDescription description={description} />}
        </div>
        {button && onClick && (
          <Button label={button} onClick={() => onClick()} type="primary" />
        )}
      </div>
      {children}
    </PageLayout>
  );
};

export default Page;

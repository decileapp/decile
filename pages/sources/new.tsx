import SourceForm from "../../components/forms/source";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const NewSource: React.FC = () => {
  return <SourceForm />;
};

export const getServerSideProps = withPageAuthRequired({});

export default NewSource;

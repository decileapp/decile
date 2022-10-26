import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import TableShell from "../../components/individual/table/shell";
import { GetServerSideProps } from "next";
import TableHeader from "../../components/individual/table/header";
import { Org_User } from "../../types/Organisation";

interface Props {
  members: Org_User[];
}

const Organisation: React.FC<Props> = (props) => {
  const router = useRouter();
  const { members } = props;
  const user = supabase.auth.user();

  // Variable map
  const fields = ["Email", "Role", "", ""];

  return (
    <>
      <Page
        title="Organisation users"
        button={user?.user_metadata.role_id === 1 ? "Invite" : undefined}
        onClick={() =>
          user?.user_metadata.role_id === 1
            ? router.push("/organisation/invite")
            : undefined
        }
      >
        {members && members.length > 0 && (
          <div className="h-full">
            <TableShell>
              <TableHeader labels={fields} />

              <tbody className="divide-y divide-gray-200">
                {members.map((row: any, id: number) => {
                  return (
                    <tr key={id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6">
                        {row.user_id.email}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium  sm:pl-6 truncate">
                        {row.role_id.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </TableShell>
          </div>
        )}
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  // Only show if assigned to org
  if (!user.user_metadata.org_id) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  supabase.auth.setAuth(token);
  const { data: members, error } = await supabase
    .from<Org_User[]>("org_users")
    .select(`id, org_id(id, name), role_id(id, name), user_id(id, email)`)
    .match({ org_id: user.user_metadata.org_id });
  return {
    props: { members: members },
  };
};

export default Organisation;

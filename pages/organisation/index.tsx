import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import TableShell from "../../components/individual/table/shell";
import { useState } from "react";
import ConfirmDialog from "../../components/individual/ConfirmDialog";
import { TrashIcon } from "@heroicons/react/outline";
import { Query } from "../../types/Query";
import { GetServerSideProps } from "next";
import Cookies from "cookies";

import { getUser } from "@supabase/auth-helpers-nextjs";
import dateFormatter from "../../utils/dateFormatter";
import TableHeader from "../../components/individual/table/header";
import { toast } from "react-toastify";
import axios from "axios";
import { Org_User } from "../../types/Organisation";

interface Props {
  members: Org_User[];
}

const Organisation: React.FC<Props> = (props) => {
  const router = useRouter();
  const { members } = props;

  // Variable map
  const fields = ["Email", "Role", "", ""];

  return (
    <>
      <Page
        title="Organisation users"
        button="Invite"
        onClick={() => router.push("/organisation/invite")}
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
                        {row.role}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-primary-600 hover:text-primary-900"
                          onClick={() =>
                            router.push({
                              pathname: "/queries/edit",
                              query: {
                                id: row.id,
                              },
                            })
                          }
                        >
                          Edit
                          <span className="sr-only">, {row.name}</span>
                        </a>
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

  // Admins only
  if (user.user_metadata.role_id !== 1) {
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
    .select(`id, org_id(id, name), role_id, user_id(id, email)`)
    .match({ org_id: user.user_metadata.org_id });

  return {
    props: { members: members },
  };
};

export default Organisation;

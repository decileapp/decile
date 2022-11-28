import { useRouter } from "next/router";
import TableShell from "../individual/table/shell";
import TableHeader from "../individual/table/header";
import { Org_User } from "../../types/Organisation";
import Button from "../individual/Button";
import { useUser } from "@supabase/auth-helpers-react";

interface Props {
  members: Org_User[];
}

const Organisation: React.FC<Props> = (props) => {
  const router = useRouter();
  const { members } = props;
  const user = useUser();

  // Variable map
  const fields = ["Email", "Role", "", ""];

  return (
    <div className="h-full mt-2">
      <div className="flex flex-row justify-end items-center mb-2">
        <Button
          onClick={() =>
            user?.user_metadata.role_id === 1
              ? router.push("/team/invite")
              : undefined
          }
          label="Invite"
          type="primary"
        />
      </div>
      {members && members.length > 0 && (
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
      )}
    </div>
  );
};

export default Organisation;

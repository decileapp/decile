import { supabase } from "../../utils/supabaseClient";
import Page from "../../components/layouts/Page";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { MailIcon, UsersIcon } from "@heroicons/react/outline";

interface Props {}

const stats = [
  {
    id: 1,
    name: "Total Subscribers",
    stat: "71,897",
    icon: UsersIcon,
    change: "122",
    changeType: "increase",
  },
  {
    id: 2,
    name: "Avg. Open Rate",
    stat: "58.16%",
    icon: MailIcon,
    change: "5.4%",
    changeType: "increase",
  },
];

const Reports: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const user = supabase.auth.user();

  const chartdata = [
    {
      year: 1951,
      "Population growth rate": 1.74,
    },
    {
      year: 1952,
      "Population growth rate": 1.93,
    },
    {
      year: 1953,
      "Population growth rate": 1.9,
    },
    {
      year: 1954,
      "Population growth rate": 1.98,
    },
    {
      year: 1955,
      "Population growth rate": 2,
    },
  ];

  93;

  return (
    <Page padding={true} title="Dashboard">
      <div className="grid grid-cols-1 gap-8 min-h-10">
        {/* {stats.map((s) => {
          return (
            <Tile
              name={s.name}
              stat={s.stat}
              icon={s.icon}
              change={s.change}
              changeType={s.changeType}
            />
          );
        })} */}
        {/* <Line data={chartdata} /> */}
      </div>
    </Page>
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

  supabase.auth.setAuth(token);

  return {
    props: {},
  };
};

export default Reports;

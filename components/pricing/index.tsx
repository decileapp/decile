import { classNames } from "../../utils/classnames";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@supabase/auth-helpers-react";
import dateFormatter from "../../utils/dateFormatter";

interface Props {
  showTrialExpiry?: boolean;
}

const Pricing: React.FC<Props> = (props) => {
  const user = useUser();
  const pricing = [
    {
      title: "Starter",
      price: "$19",
      cadence: "/month",
      summary: "Ideal for single users.",
      features: [
        "1 user",
        "Unlimited queries",
        "Query with text using AI (Beta)*",
        "Visualise results",
        "Export results as CSV",
        "Export to Google Sheets",
        "100 scheduled runs per month",
      ],
      higlighted: user?.user_metadata.plan_id === 2,
      plan_type: "starter",
      recommended: false,
    },
    {
      title: "Team (Recommended)",
      price: "$49",
      cadence: "/month",
      summary: "For small teams.",
      features: [
        "3 users",
        "Unlimited queries",
        "Query with text using AI (Beta)*",
        "Visualise results",
        "Export results as CSV",
        "Export to Google Sheets",
        "500 scheduled runs per month",
      ],
      higlighted: user?.user_metadata.plan_id === 3,
      plan_type: "team",
      recommended: true,
    },
    {
      title: "Enterprise",
      price: "$149",
      cadence: "/month",
      summary: "For large teams.",
      features: [
        "10 users",
        "Unlimited queries",
        "Query with text using AI (Beta)*",
        "Visualise results",
        "Export results as CSV",
        "Export to Google Sheets",
        "2500 scheduled runs per month",
      ],
      higlighted: user?.user_metadata.plan_id === 4,
      plan_type: "enterprise",
      recommended: false,
    },
  ];

  const getPaymentLink = async (x: string) => {
    try {
      const res = await axios.post("/api/admin/billing/create-payment-link", {
        plan_type: x,
      });
      if (res.data.link) {
        window.open(res.data.link);
      }
      return;
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong.");
      return;
    }
  };

  const d = new Date(user?.created_at || "");
  const trialExpiry = new Date(d.getTime() + 14 * 24 * 60 * 60 * 1000);

  return (
    <div>
      {props.showTrialExpiry && (
        <p className="mb-6 text-center">
          Your free trial expires on
          <span className="font-bold">
            {" " +
              dateFormatter({
                dateVar: trialExpiry,
                type: "date",
              })}
          </span>
          . Please upgrade to a paid plan to keep using Decile.
        </p>
      )}
      <div className="grid grid-cols-3 w-full gap-4">
        {pricing.map((p, id) => {
          return (
            <div key={id}>
              <div
                className={classNames(
                  p.recommended ? "bg-primary-600 text-white" : "bg-white",
                  "w-full  rounded-lg shadow hover:shadow-xl transition duration-100 ease-in-out p-6 md:mr-4 mb-10 md:mb-0"
                )}
              >
                <h3 className="text-lg">{p.title}</h3>
                <p className=" mt-1">
                  <span className="font-bold text-4xl">{p.price}</span>{" "}
                  {p.cadence}
                </p>
                <p className="text-sm  mt-2">{p.summary}</p>
                <div className="text-sm  mt-4">
                  {p.features.map((f) => {
                    return (
                      <p className="my-2">
                        <span className="fa fa-check-circle mr-2 ml-1"></span>{" "}
                        {f}
                      </p>
                    );
                  })}
                </div>
                {p.higlighted ? (
                  <p
                    className={classNames(
                      p.recommended ? "bg-primary-400" : "text-primary-600 ",
                      "w-full    rounded  py-4 mt-4 text-center"
                    )}
                  >
                    Your current plan
                  </p>
                ) : (
                  <button
                    className={classNames(
                      p.recommended
                        ? "bg-primary-400"
                        : "text-primary-600 border-primary-600 border",
                      "w-full    rounded hover:bg-primary-700 hover:text-white hover:shadow-xl transition duration-150 ease-in-out py-4 mt-4"
                    )}
                    onClick={() => getPaymentLink(p.plan_type)}
                  >
                    Choose Plan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm">
        * The ability to query using natural language is included for free as we
        develop the product. Please note that this will change in the future.
      </p>
    </div>
  );
};
export default Pricing;

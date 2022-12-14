import { classNames } from "../../utils/classnames";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@supabase/auth-helpers-react";
import dateFormatter from "../../utils/dateFormatter";

const Pricing: React.FC = () => {
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
        "Access to learning content",
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
        "Access to learning content",
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
        "Access to learning content",
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

  const pricingString =
    trialExpiry > new Date(Date.now()) ? "expired" : "expires";

  return (
    <div>
      <p className="mb-6 text-center font-bold">
        Please upgrade to a paid plan to keep using Decile.
      </p>

      <div className="grid grid-cols-3 w-full gap-4">
        {pricing.map((p, id) => {
          return (
            <div key={id}>
              <div
                className={classNames(
                  p.recommended
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-zinc-800",
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
        * The ability to query using AI is provided without limits during the
        Beta period. In the future, usage will likely be capped for each plan.
      </p>
    </div>
  );
};
export default Pricing;

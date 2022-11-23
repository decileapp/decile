import { classNames } from "../../utils/classnames";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import { toast } from "react-toastify";

const Pricing: React.FC = () => {
  const user = supabase.auth.user();
  const pricing = [
    {
      title: "Starter",
      price: "Free",
      cadence: "",
      summary: "Ideal for single users.",
      features: ["1 user", "Unlimited queries", "No scheduled runs"],
      higlighted: user?.user_metadata.plan_id === 1,
      plan_type: "free",
      recommended: false,
    },
    {
      title: "Team (Recommended)",
      price: "£49",
      cadence: "/month",
      summary: "For small teams.",
      features: ["3 users", "Unlimited queries", "500 scheduled runs"],
      higlighted: user?.user_metadata.plan_id === 2,
      plan_type: "team",
      recommended: true,
    },
    {
      title: "Enterprise",
      price: "£149",
      cadence: "/month",
      summary: "For large teams.",
      features: ["10 users", "Unlimited queries", "2,500 scheduled queries"],
      higlighted: user?.user_metadata.plan_id === 3,
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
      console.log(e);
      toast.error("Something went wrong.");
      return;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 w-full gap-4">
        {pricing.map((p) => {
          return (
            <div>
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
    </div>
  );
};
export default Pricing;

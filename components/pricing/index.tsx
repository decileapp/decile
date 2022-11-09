import { classNames } from "../../utils/classnames";
import axios from "axios";

const Pricing: React.FC = () => {
  const pricing = [
    {
      title: "Starter",
      price: "£19",
      summary: "Ideal for single users.",
      features: ["1 user", "Unlimited queries", "10 scheduled runs"],
      higlighted: false,
      priceId: 2,
    },
    {
      title: "Team",
      price: "£49",
      summary: "Our recommended plan for small teams.",
      features: ["3 users", "Unlimited queries", "500 scheduled runs"],
      higlighted: true,
      priceId: 3,
    },
    {
      title: "Enterprise",
      price: "£149",
      summary: "For large teams.",
      features: ["10 users", "Unlimited queries", "2,500 scheduled queries"],
      higlighted: false,
      priceId: 4,
    },
  ];

  const getPaymentLink = async (x: number) => {
    const res = await axios.post("/api/admin/billing/create-payment-link", {
      priceId: x,
    });
    if (res.data.link) {
      window.open(res.data.link);
    }
    return;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row px-2 md:px-0">
        {pricing.map((p) => {
          return (
            <div
              className={classNames(
                p.higlighted ? "bg-primary-600 text-white" : "bg-white",
                "w-full md:w-1/3 rounded-lg shadow hover:shadow-xl transition duration-100 ease-in-out p-6 md:mr-4 mb-10 md:mb-0"
              )}
            >
              <h3 className="text-lg">{p.title}</h3>
              <p className=" mt-1">
                <span className="font-bold text-4xl">{p.price}</span> /Month
              </p>
              <p className="text-sm  mt-2">{p.summary}</p>
              <div className="text-sm  mt-4">
                {p.features.map((f) => {
                  return (
                    <p className="my-2">
                      <span className="fa fa-check-circle mr-2 ml-1"></span> {f}
                    </p>
                  );
                })}
              </div>
              <button
                className={classNames(
                  p.higlighted
                    ? "bg-primary-400"
                    : "text-primary-600 border-primary-600 border",
                  "w-full    rounded hover:bg-primary-700 hover:text-white hover:shadow-xl transition duration-150 ease-in-out py-4 mt-4"
                )}
                onClick={() => getPaymentLink(p.priceId)}
              >
                Choose Plan
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Pricing;

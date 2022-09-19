import { classNames } from "../../utils/classnames";

interface Tab {
  name: string;
  value: string;
}

type Props = {
  tabs: Tab[];
  current: string;
  handleChange: (x: string) => void;
};

const Tabs: React.FC<Props> = (props) => {
  const { tabs, current, handleChange } = props;
  return (
    <div className="w-full space-evenly">
      <div className=" sm:block">
        <div className="">
          <nav
            className="-mb-px flex justify-evenly space-x-8"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <a
                key={tab.name}
                className={classNames(
                  tab.value === current
                    ? "border-secondary-400 text-secondary-400"
                    : "border-transparent dark:text-zinc-300 text-zinc-500 hover:text-zinc-700 hover:dark:text-zinc-100 ",
                  "w-1/4 py-4 px-1 text-center border-b-2 font-medium text-lg"
                )}
                aria-current={tab.value === current ? "page" : undefined}
                onClick={() => handleChange(tab.value)}
                href="#"
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tabs;

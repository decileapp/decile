const TableShell: React.FC = (props) => {
  return (
    <div className="flex flex-col h-full w-full ">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden  md:rounded-lg bg-zinc-100 dark:bg-zinc-700">
            <table className="min-w-full divide-y divide-zinc-300 ">
              {props.children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableShell;

const TableShell: React.FC = (props) => {
  return (
    <div className="flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-gray-50 dark:bg-zinc-800">
            <table className="min-w-full divide-y divide-gray-300 ">
              {props.children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableShell;

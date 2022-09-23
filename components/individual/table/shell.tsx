const TableShell: React.FC = (props) => {
  return (
    <div className="h-full w-full overflow-scroll md:rounded-sm bg-zinc-100 dark:bg-zinc-700 ">
      <table className="overflow-scroll min-w-full divide-y divide-zinc-300 ">
        {props.children}
      </table>
    </div>
  );
};

export default TableShell;

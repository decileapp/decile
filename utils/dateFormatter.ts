import moment from "moment";

const dateFormatter = ({
  dateVar,
  type = "date",
  emptyMessage = "No date available.",
}: {
  dateVar: Date | null;
  type?: "date" | "time" | "day" | "dateNoDay";
  emptyMessage?: string;
}) => {
  let dateComp = "";
  if (dateVar === null || dateVar === undefined) {
    return emptyMessage;
  }
  if (dateVar !== null && type === "day") {
    dateComp = moment(dateVar).format("dddd");
  }
  if (dateVar !== null && type === "date") {
    dateComp = moment(dateVar).format("dddd, D MMM Y");
  }
  if (dateVar !== null && type === "dateNoDay") {
    dateComp = moment(dateVar).format("D MMM Y");
  }
  if (dateVar !== null && type === "time") {
    dateComp = moment(dateVar).format("dddd, h:mm A");
  }

  return dateComp;
};

export default dateFormatter;

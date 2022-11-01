export const getSpreadsheetId = (x: string) => {
  if (x.search("https://docs.google.com/spreadsheets/d/") < 0) {
    return;
  }
  const rawId = x.split("https://docs.google.com/spreadsheets/d/");
  const spreadsheetId = rawId[1].split("/")[0];
  return spreadsheetId;
};

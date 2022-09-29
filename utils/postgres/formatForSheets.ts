const formatForSheets = (data: any) => {
  try {
    // Format data for google sheets
    const getAllRows = data.rows.map((r: any) => Object.values(r));
    const rowData = [Object.keys(data.rows[0])].concat(getAllRows);
    return rowData;
  } catch (e: any) {
    return e;
  }
};

export default formatForSheets;

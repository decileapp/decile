import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

// CREATE
export async function createSpreadsheet({
  auth,
  title,
}: {
  auth: OAuth2Client;
  title: string;
}) {
  const service = google.sheets({ version: "v4", auth });
  try {
    const resource = {
      properties: {
        title,
      },
    };

    const spreadsheet = await service.spreadsheets.create({
      requestBody: {
        properties: {
          title: title,
        },
      },
      fields: "spreadsheetId",
    });
    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    throw err;
  }
}

// WRITE
export async function writeOnSpreadsheet({
  spreadsheet,
  auth,
  data,
  range,
}: {
  spreadsheet: string;
  auth: OAuth2Client;
  data: any;
  range: string;
}) {
  const service = google.sheets({ version: "v4", auth });
  try {
    const updated = await service.spreadsheets.values.update({
      spreadsheetId: spreadsheet,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: data },
    });
    return updated.data.spreadsheetId;
  } catch (err) {
    throw err;
  }
}

// CREATE and WRITE
export async function createAndWriteSpreadsheet({
  title,
  auth,
  data,
  range,
}: {
  title: string;
  auth: OAuth2Client;
  data: any;
  range: string;
}) {
  const service = google.sheets({ version: "v4", auth });
  try {
    const created = await createSpreadsheet({ title: title, auth: auth });
    if (!created) throw Error;
    const updated = await writeOnSpreadsheet({
      spreadsheet: created,
      auth: auth,
      data: data,
      range: range,
    });
    return updated;
  } catch (err) {
    throw err;
  }
}

// READ
export async function readSpreadsheet({
  auth,
  spreadsheet,
  range,
}: {
  auth: OAuth2Client;
  spreadsheet: string;
  range: string;
}) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheet,
      range: range,
    });

    return r;
  } catch (e) {
    throw e;
  }
}

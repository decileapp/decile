import { Credentials, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { decrypt } from "../encryption";
import { getServiceSupabase } from "../supabaseClient";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Authorise with creds
export async function authoriseGoogle() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_ORIGIN}api/auth/google/callback`
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return authUrl;
}

// Get the token
export async function getNewToken(code: string) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_ORIGIN}api/auth/google/callback`
  );
  const token: Credentials = await new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (err: any, token: any) => {
      err ? reject(err) : resolve(token);
    });
  });
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

export async function checkExistingToken(userId: string) {
  const serviceSupabase = getServiceSupabase();
  // Store data in DB
  const { data, error } = await serviceSupabase
    .from("integration_credentials")
    .select("*")
    .match({ user_id: userId })
    .single();

  if (data) {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_ORIGIN}api/auth/google/callback`
    );

    // if (data.refresh_token < new Date(Date.now()).getTime()) {
    oAuth2Client.setCredentials({
      access_token: decrypt(data.access_token),
      refresh_token: decrypt(data.refresh_token),
      expiry_date: data.expiry_date,
      token_type: "Bearer",
      scope: data.scope,
    });
    // } else {
    //   // Need refresh token
    // }
    return oAuth2Client;
  } else {
    return null;
  }
}

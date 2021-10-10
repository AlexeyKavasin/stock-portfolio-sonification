import { google } from 'googleapis';
import { credentials } from '../money-talk-credentials';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export const getAuthClient = async () => {
  const { client_email, private_key } = credentials;

  const client = new google.auth.JWT(
    client_email,
    undefined,
    private_key,
    SCOPES,
    undefined
  );

  return client;
};

export const getApiClient = async () => {
  const authClient = await getAuthClient();
  const { spreadsheets: apiClient } = google.sheets({
    version: 'v4',
    auth: authClient,
  });

  return apiClient;
};

export const getSheetsData = async (apiClient: any) => {
  const { sheet_id } = credentials;
  const { data } = await apiClient.get({
    spreadsheetId: sheet_id,
    fields: 'sheets',
    ranges: 'money-talk',
    includeGridData: true,
  });

  return data.sheets;
};

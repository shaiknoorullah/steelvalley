import axios from "axios";
import { airtableGetTableApi, axiosAirtableHeaders } from "./axiosConfig";

export const getTableData = async (tableId:string) => {
  const baseId = process.env.AIRTABLE_BASE_ID;

  const endpoint = airtableGetTableApi(baseId, tableId);
  const endpoints = airtableGetTableApi(process.env.AIRTABLE_BASE_ID, tableId);
  try {
    const response = await axios.get(endpoint, {
      headers: axiosAirtableHeaders,
    });

    if (!response) {
      throw new Error("could not get the Data");
    }


    return response;
  } catch (error) {
    throw new Error(`${error}, "from catch"`);
  }
};

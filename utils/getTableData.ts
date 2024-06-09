import axios from "axios";
import { airtableGetTableApi, axiosAirtableHeaders } from "./axiosConfig";

export const getTableData = async (tableId:string) => {
  console.log("INTABLE");
  console.log("hello");
  const baseId = process.env.AIRTABLE_BASE_ID;
  console.log("Base ID:", baseId);

  const endpoint = airtableGetTableApi(baseId, tableId);
  console.log("Endpoint:", endpoint);
  const endpoints = airtableGetTableApi(process.env.AIRTABLE_BASE_ID, tableId);
  try {
    const response = await axios.get(endpoint, {
      headers: axiosAirtableHeaders,
    });

    if (!response) {
      throw new Error("could not get the Data");
    }

    console.log(response);

    return response;
  } catch (error) {
    throw new Error(`${error}, "from catch"`);
  }
};

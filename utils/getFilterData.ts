import axios from "axios";
import { airtableGetTableApi, axiosAirtableHeaders } from "./axiosConfig";

export const getFilterData = async (tableId: string, name: string) => {
  const baseId = process.env.AIRTABLE_BASE_ID;


  const endpoint = airtableGetTableApi(baseId, tableId);
  
  console.log("Endpointoffilter:", endpoint);

  const config = {
    headers: axiosAirtableHeaders,
    params: {
      filterByFormula: `({shortname}='${name}')`,
    },
  };

  try {
    const response = await axios.get(endpoint, config);

    if (!response) {
      throw new Error("could not get the Data");
    }

    console.log(response);

    return response;
  } catch (error) {
    throw new Error(`${error}, "from catch"`);
  }
};

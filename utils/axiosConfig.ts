export const axiosAirtableHeaders = {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
  
  export const airtableBaseApi = `https://api.airtable.com/v0`;
  
  export const airtableGetTableApi = (baseId:any, tableId:any) => {
    return `${airtableBaseApi}/${baseId}/${tableId}`;
  };
  
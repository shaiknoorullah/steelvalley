import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import {  airtableGetTableApi, axiosAirtableHeaders } from "../../../utils/axiosConfig";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, email, phoneNumber, message } = req.body;
  const baseId = process.env.AIRTABLE_BASE_ID as string;
  const tableId = "tblnlaeq7tRnfHtma"; 

  const data = {
    fields: {
      "fullName": fullName,
      "email": email,
      "phoneNumber": phoneNumber,
      "message": message,
    },
  };

  try {
    const response = await axios.post(airtableGetTableApi(baseId, tableId), data, {
      headers: axiosAirtableHeaders,
    });
    return res.status(200).json(response.data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;

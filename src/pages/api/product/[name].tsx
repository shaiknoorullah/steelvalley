import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { name },
  } = req;
  try {
    const AIRTABLE_API_ENDPOINT = `https://api.airtable.com/v0/appNpL3dO0aG3DBH9/tblc8rwiTnZwKbOwl`;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    const config = {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        filterByFormula: `({shortname}='${name}')`,
      },
    };

    const response = await axios.get(AIRTABLE_API_ENDPOINT, config);

    res.status(200).json(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

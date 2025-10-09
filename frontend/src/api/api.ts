import axios from "axios";

const ISSUANCE_API = "http://localhost:4001/issue";
const VERIFICATION_API = "http://localhost:4002/verify";

export const issueCredential = async (data: any) => {
 const response = await axios.post(ISSUANCE_API, data);

  return response.data;
};

export const verifyCredential = async (data: any) => {
  const response = await axios.post(VERIFICATION_API, data);
  return response.data;
};

import axios from "axios";

const ISSUANCE_API = "http://44.226.145.213:4001";
const VERIFICATION_API = "http://44.226.145.213:4002";


export const issueCredential = async (data: any) => {
 const response = await axios.post(ISSUANCE_API, data);

  return response.data;
};

export const verifyCredential = async (data: any) => {
  const response = await axios.post(VERIFICATION_API, data);
  return response.data;
};

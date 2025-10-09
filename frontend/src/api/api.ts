import axios from "axios";

const ISSUANCE_API = "https://kube-credential-issuance-19fc.onrender.com/issue";
const VERIFICATION_API = "https://kube-credential-verifycredentials.onrender.com/verify";

export const issueCredential = async (data: any) => {
 const response = await axios.post(ISSUANCE_API, data);

  return response.data;
};

export const verifyCredential = async (data: any) => {
  const response = await axios.post(VERIFICATION_API, data);
  return response.data;
};

import { GetDynamicsToken } from "../utils/Dynamics/Auth.js";

const getDyanmicsToken = async (req, res) => {
  const token = await GetDynamicsToken();
  res.json(token);
};

export { getDyanmicsToken };

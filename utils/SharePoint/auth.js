import axios from "axios";
import qs from "qs";

export const SPAuth = async () => {
  const { SP_CLIENT_ID, SP_CLIENT_SECRET, SP_TENANT_ID, SP_RESOURCE } =
    process.env;
  const url = `https://accounts.accesscontrol.windows.net/${SP_TENANT_ID}/tokens/OAuth/2`;
  let tokenData = null;

  var data = qs.stringify({
    grant_type: "client_credentials",
    client_id: `${SP_CLIENT_ID}@${SP_TENANT_ID}`,
    client_secret: SP_CLIENT_SECRET,
    resource: SP_RESOURCE,
  });
  var config = {
    method: "get",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      tokenData = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return tokenData;
};

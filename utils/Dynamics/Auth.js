"use strict";
import https from "https";
import axios from "axios";
import qs from "qs";

async function GetDynamicsToken() {
  let tokenData = null;
  var data = qs.stringify({
    client_id: "d2a32ae6-e85e-4b62-91a1-538062cdee0e",
    client_secret: "qgV7Q~qNJFK_jdmnWkIrFRCToSAS4fAiNpeRi",
    grant_type: "client_credentials",
    resource: "https://stephen.crm11.dynamics.com",
  });
  var config = {
    method: "get",
    url: "https://login.microsoftonline.com/5f0d9160-6b93-41c6-8db2-153e0d7f7960/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie:
        "fpc=Ao6FWL31ryRKh_UqGTpFn-uxuI2VAQAAAJr5NtkOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd",
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      tokenData = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return tokenData;
}

export { GetDynamicsToken };

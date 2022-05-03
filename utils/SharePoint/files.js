import axios from "axios";

export const UploadFile = async (token, file) => {
  let createdFile = null;
  var data = file.buffer;
  var config = {
    method: "post",
    url: `https://pobl.sharepoint.com/sites/RMExchange/_api/web/GetFolderByServerRelativeUrl('Documents/Postman')/Files/add(url='${file.originalname}',overwrite=true)`,
    headers: {
      "Content-Type": "application/json;odata=verbose",
      Accept: "application/json;odata=verbose",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      //   console.log(response.data);
      createdFile = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return createdFile;
};

import { SPAuth } from "../../utils/SharePoint/auth.js";
import { UploadFile } from "../../utils/SharePoint/files.js";

const uploadFile = async (req, res) => {
  const file = req.file;
  const data = req.body.data;

  // Get SP Access Token
  const tokenData = await SPAuth();

  // Upload File to SP
  const fileUpload = await UploadFile(tokenData.access_token, file);
  const { Name, ServerRelativeUrl, UniqueId } = fileUpload.d;

  return res.json({
    status: "OK",
    file: req.file.filename,
    data: JSON.parse(req.body.data),
    upload: {
      Name,
      url: `https://pobl.sharepoint.com/sites/RMExchange${ServerRelativeUrl}`,
      UniqueId,
    },
  });
};

export { uploadFile };

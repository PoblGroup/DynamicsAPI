import {
  GetPolicyDocumentById,
  GetPolicyDocumentFiles,
  GetPolicyDocuments,
  GetPolicyDocumentSharePointLocation,
  GetPolicyResponseById,
  GetPolicyResponses,
  updatePolicyResponse,
} from "../../utils/Dynamics/Policies.js";

const getPolicyResponses = async (req, res) => {
  const employeeId = req.query.employeeId;
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const responses = [];
    const policyResponses = await GetPolicyResponses(token, employeeId);

    if (policyResponses.value.length == 0) {
      return res.status(404).json({
        error: `No Policy Responses Found`,
      });
    }

    const documents = await GetPolicyDocuments(token);

    // Set response data
    policyResponses.value.map((r) => {
      let response = {
        id: r.pobl_policydocumentresponseid,
        name: r.pobl_responsename,
        createdOn: r.createdon,
        signed: r.pobl_responsesigned ? "Yes" : "No",
        document: { id: null, name: null, ref: null, signBy: null },
      };

      // Get Linked Document
      let responseDocument = documents.value.filter(
        (x) => x.pobl_policydocumentid == r._pobl_responsedocument_value
      );

      response.document.id = responseDocument[0].pobl_policydocumentid;
      response.document.name = responseDocument[0].pobl_documentname;
      response.document.ref = responseDocument[0].pobl_documentref;
      response.document.signBy = responseDocument[0].pobl_documentsignby;

      responses.push(response);
    });

    res.status(200).json({ data: responses });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getPolicyResponseById = async (req, res) => {
  const id = req.params.id;
  const token = req.headers["authorization"].split(" ")[1];

  try {
    let files = [];
    const policyResponse = await GetPolicyResponseById(token, id);

    if (!policyResponse) {
      return res.status(404).json({
        error: `No Policy Response Found with Id: ${id}`,
      });
    }

    const document = await GetPolicyDocumentById(
      token,
      policyResponse._pobl_responsedocument_value
    );

    const spLocation = await GetPolicyDocumentSharePointLocation(
      token,
      document.pobl_policydocumentid
    );

    if (spLocation != null) {
      files = await GetPolicyDocumentFiles(spLocation);
    }

    // Set response data
    let response = {
      id: policyResponse.pobl_policydocumentresponseid,
      name: policyResponse.pobl_responsename,
      createdOn: policyResponse.createdon,
      signed: policyResponse.pobl_responsesigned ? "Yes" : "No",
      document: document,
      files: files,
    };

    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: "Failed to get single response" });
  }
};

const getpolicyDocumentFiles = async (req, res) => {
  const folder = req.body.folder;
  const token = req.headers["authorization"].split(" ")[1];
  const files = await GetPolicyDocumentFiles(folder);
  res.json(files);
};

const confirmPolicyResponse = async (req, res) => {
  const id = req.params.id;
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const updatedPolicyResponse = await updatePolicyResponse(token, id);

    if (updatedPolicyResponse == true) {
      res.status(200).json({ message: `Policy Response Updated, Id: ${id}` });
    } else {
      res.status(500).json({ error: `Something went wrong` });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export {
  getPolicyResponses,
  getPolicyResponseById,
  getpolicyDocumentFiles,
  confirmPolicyResponse,
};

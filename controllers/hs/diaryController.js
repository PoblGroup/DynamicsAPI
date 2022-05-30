import {
  GetManagerDiaryTask,
  GetManagerDiaryTaskFiles,
  GetManagerDiaryTaskSharePointLocation,
  GetManagerEntries,
  GetManagerEntry,
  UpdateManagerEntry,
} from "../../utils/Dynamics/ManagerDiary.js";

const getDiaryEntries = async (req, res) => {
  const employeeId = req.query.employeeId;
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const entries = [];
    const managerEntries = await GetManagerEntries(token, employeeId);

    if (managerEntries.value.length == 0) {
      return res.status(404).json({
        error: `No Entries Found`,
      });
    }

    managerEntries.value.map((e) => {
      let mE = {
        id: e.pobl_managerdiaryentryid,
        taskName: e.pobl_diarytaskname,
        due: e.pobl_diaryentrydue,
        signed: e.pobl_diarytasksigned ? "Yes" : "No",
        custom: e.pobl_diarytaskcustom ? "Yes" : "No",
      };

      entries.push(mE);
    });

    res.status(200).json({ data: entries });
  } catch (error) {
    res.status(200).json({ error: error });
  }
};

const getDiaryEntryById = async (req, res) => {
  const id = req.params.id;
  const token = req.headers["authorization"].split(" ")[1];

  try {
    let files = [];
    const entry = await GetManagerEntry(token, id);

    if (!entry) {
      return res.status(404).json({
        error: `No Entry with Id: ${id}`,
      });
    }

    if (!entry._pobl_diaryhsetaskid_value)
      return res
        .status(404)
        .json({
          error: `No Diary Task Found. Please report issue to service desk.`,
        });

    const document = await GetManagerDiaryTask(
      token,
      entry._pobl_diaryhsetaskid_value
    );

    const spLocation = await GetManagerDiaryTaskSharePointLocation(
      token,
      document.pobl_managerdiarytaskid
    );

    if (spLocation != null) {
      files = await GetManagerDiaryTaskFiles(spLocation);
    }

    //Set entry data
    let diaryEntry = {
      id: entry.pobl_managerdiaryentryid,
      name: entry.pobl_diarytaskname,
      createdOn: entry.createdon,
      signed: entry.pobl_diarytasksigned ? "Yes" : "No",
      due: entry.pobl_diaryentrydue,
      document: document,
      files: files,
    };

    res.status(200).json({ data: diaryEntry });
  } catch (error) {
    res.status(400).json({ error: "Failed to get single entry" });
  }
};

const updateEntry = async (req, res) => {
  const modifiedEntry = {
    areasCovered: req.body.areasCovered,
    areasRemaining: req.body.areasRemaining,
    completionNotes: req.body.completionNotes,
    completion: req.body.completion,
    id: req.params.id,
  };

  const token = req.headers["authorization"].split(" ")[1];

  const updated = await UpdateManagerEntry(token, modifiedEntry);

  if (!updated)
    return res.status(500).json({ message: "Something went wrong" });

  res.status(200).json({
    updated: true,
    message: `Successfully Updated Entry!`,
  });
};

export { getDiaryEntries, getDiaryEntryById, updateEntry };

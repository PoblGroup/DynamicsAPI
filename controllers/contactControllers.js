"use strict";
import https from "https";
import {
  GetDyamicsContactById,
  GetDyamicsContacts,
} from "../utils/Dynamics/Contacts.js";

const getContacts = async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];

  try {
    const contacts = await GetDyamicsContacts(token);
    let contactData = [];
    contacts.value.map((c) => {
      var contact = {
        id: c.contactid,
        name: c.fullname,
      };
      contactData.push(contact);
    });
    res.json(contactData);
  } catch (error) {
    res.status(500).send();
  }
};

const getContactById = async (req, res) => {
  const id = req.params.id;
  const token = req.headers["authorization"].split(" ")[1];
  try {
    const contact = await GetDyamicsContactById(token, id);
    if (contact == null) {
      res.status(401).send("Contact not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).send();
  }
};

export { getContacts, getContactById };

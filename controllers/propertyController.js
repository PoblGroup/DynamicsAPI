
const getProperties = async (req, res) => {
    res.status(200).json({message: "Show List of Properties"})
}

const getPropertyById = async (req, res) => {
    const id = req.params.id;
    res.status(200).json({message: `Show Single Property Id: ${id}`})
  };
  

export { getProperties, getPropertyById };
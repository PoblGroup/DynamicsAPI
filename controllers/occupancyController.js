import { occupancies } from '../data/occupancies.js'

const getOccupancies = async (req, res) => {
    res.status(200).json(occupancies)
}

const getOccupancyById = async (req, res) => {
    const id = req.params.id;
    res.status(200).json({message: `Show Single Occupancy Id: ${id}`})
  };
  

export { getOccupancies, getOccupancyById };
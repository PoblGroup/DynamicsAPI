import { accounts, patches } from '../data/accounts.js'

const getAccounts = async (req, res) => {
    res.status(200).json(accounts)
}

const getAccountById = async (req, res) => {
    const id = req.params.id;
    try {
        const account = accounts.filter(x => x.id == id)[0];

        if(account) {
            // Get Patch Details
            account.patchDetails = patches.filter(p => p.id == account.patchId)
            res.status(200).json(account)
        } else {
            res.status(404).json({ message: 'Account not found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
};


export { getAccounts, getAccountById };
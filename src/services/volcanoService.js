import Volcano from "../models/Volcano.js";

const volcanoService = {
    create(volcanoData, userId) {
        // volcano model
        return Volcano.create({ ...volcanoData, owner: userId });
    },
    getAll(filter = {}) {
        const query = Volcano.find().lean();
        if (filter.name) {
            query.find({ name: { $regex:filter.name, $options: 'i'}})
        }
        if (filter.typeVolcano) {
            query.find({typeVolcano: filter.typeVolcano});  
        }
        return query;
    },
    getOne(volcanoId) {
        return Volcano.findById(volcanoId);
    },
    vote(volcanoId, userId) {
        /*
        const volcano = await Volcano.findById(volcanoId);
        volcanoId.voteList.push(userId);
        return volcano.save();
        */
        return Volcano.findByIdAndUpdate(volcanoId, { $push: { voteList: userId } });
    },
    remove(volcanoId) {
        return Volcano.findByIdAndDelete(volcanoId);
    },
    edit(volcanoId, volcanoData) {
        return Volcano.findByIdAndUpdate(volcanoId, volcanoData, {runValidators: true});
    },
};

export default volcanoService;
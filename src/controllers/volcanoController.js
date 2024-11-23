import { Router } from 'express';
import mongoose from 'mongoose';
import volcanoService from '../services/volcanoService.js';
import { getErrorMessage } from '../utils/errorUtils.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const volcanoController = Router();

volcanoController.get('/', async (req, res) => {
    const volcanoes = await volcanoService.getAll();
    res.render('volcano/catalog', { volcanoes, title: 'Catalog Page' });
});

volcanoController.get('/create', isAuth, (req, res) => {
    res.render('volcano/create', { title: 'Create Page' });
});

volcanoController.post('/create', isAuth, async (req, res) => {
    const volcanoData = req.body;
    const userId = req.user._id;

    try {
        await volcanoService.create(volcanoData, userId);
        res.redirect('/volcanoes');
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('volcano/create', { volcano: volcanoData, error, title: 'Create Page' });
    }
});

volcanoController.get('/search', async (req, res) => {
    const query = req.query;
    const volcanoes = await volcanoService.getAll(query).lean();
    
    res.render('volcano/search', {title: 'Search Page', volcanoes, query});
});

volcanoController.get('/:volcanoId/details', async (req, res) => {
    const volcano = await volcanoService.getOne(req.params.volcanoId).lean();
    const isOwner = volcano.owner.toString() == req.user?._id;
    const isVoted = volcano.voteList?.some(userId => userId == req.user?._id);
    
    //const voteCount = (Array.isArray(volcano.voteList) ? volcano.voteList.length : null);
    const voteCount = volcano.voteList?.length || 0;
    
    //console.log(req.user);
    //console.log(req.params);  

    res.render('volcano/details', { volcano, title: 'Details Page', isOwner, isVoted, voteCount });
})

volcanoController.get('/:volcanoId/vote', isAuth, async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const userId = req.user._id;
    try {
        await volcanoService.vote(volcanoId, userId);
        res.redirect(`/volcanoes/${volcanoId}/details`);
    } catch (error) {
        console.log(error);
    }
});

volcanoController.get('/:volcanoId/delete', async (req, res) => {
    try {
        await volcanoService.remove(req.params.volcanoId);
        res.redirect('/volcanoes');
    } catch (error) {
        console.log(error);
    }
});

volcanoController.get('/:volcanoId/edit', async (req, res) => {
    const volcano  = await volcanoService.getOne(req.params.volcanoId).lean();

    res.render('volcano/edit', { title: 'Edit Page', volcano});
});

volcanoController.post('/:volcanoId/edit', async (req, res) => {
        const volcanoData = req.body;
        const volcanoId = req.params.volcanoId;
        
    try {
        await volcanoService.edit(volcanoId, volcanoData);
        res.redirect(`/volcanoes/${volcanoId}/details`);
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('volcano/edit', { title: 'Edit Page', volcano: volcanoData, error});
    }
});



export default volcanoController;
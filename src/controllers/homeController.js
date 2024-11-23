import { Router } from 'express';

const homeController = Router();

homeController.get('/',  (req, res) => {
    res.render('home', {title: 'Home Page'});
    //res.render('home');
});
// TODO: only for test, remove next time
homeController.get('/authorized', (req, res) => {
    res.send(req.user);
});


export default homeController;

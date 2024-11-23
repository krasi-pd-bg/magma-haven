import { Router } from 'express';
import authService from '../services/authService.js';
import { AUTH_COOKIE_NAME } from '../constants.js';
import { getErrorMessage } from '../utils/errorUtils.js';
import { isAuth, isGuest } from '../middlewares/authMiddleware.js';

const authController = Router();

authController.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register Page' });
});

authController.post('/register', async (req, res) => {
    // get input
    const { username, email, password, rePassword } = req.body;
    // check rePassword in authService
    //call authService register function
    try {
        const token = await authService.register(username, email, password, rePassword);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
        // redirect to home page
        res.redirect('/');
    } catch (err) {
        // add error message
        const error = getErrorMessage(err);
        res.render('auth/register', { title: 'Register Page', username, email, error });
    }
});

authController.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login Page' });
});

authController.post('/login', async (req, res) => {
    // get login data
    const { email, password } = req.body;
    try {
        // use auth service login
        const token = await authService.login(email, password);
        // add token to cookie
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
        // redirect to home page
        res.redirect('/');
    } catch (err) {
        // TODO: send error message
        const error = getErrorMessage(err);
        res.render('auth/login', { title: 'Login Page', email, error });
    }
});

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/');
});


export default authController;
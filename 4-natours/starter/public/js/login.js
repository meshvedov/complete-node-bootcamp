/*eslint-disable*/
import axios from 'axios';
import { showAlert } from "./alerts";
import { async } from '../../../../../../../Users/mic/AppData/Local/Microsoft/TypeScript/3.6/node_modules/rxjs/internal/scheduler/async';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if(res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }   
    
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout'
        });

        if (res.data.status === 'success') location.reload(true);
    } catch (error) {
        showAlert('errror', 'Error logging out! Try again!')
    }
}
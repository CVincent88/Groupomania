import axios from 'axios';
// import store from './store/index';

const URL = 'http://localhost:5000/api/v1/users/'

 class userService {
    // Create new user
    static userSignup(userObject) {
        axios.post(URL + 'signup', {
            ...userObject
        })
        .then((response) => {
            if(response.status === 201){

                let data = JSON.parse(response.config.data)
                let newUser = {
                    emailAddress: data.emailAddress,
                    password: data.password
                }
                this.userLogin(newUser);

            } 
        })
        .catch(err =>{ console.log(err)})
    }

    static userLogin(userObject){
        axios.post(URL + 'login', {
            ...userObject
        })
        .then((response) => {
            if(response.status === 200){
                console.log(response);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
            }
        })
    }

}


export default userService;

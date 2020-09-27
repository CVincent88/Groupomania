<template>
    <div>
        <header class="connection-page-header">
            <div class="connection-page-header_logo">
                <router-link to="/">
                <img src="../assets/icon-left-font-monochrome-white.svg" :alt="this.$store.state.logo">
                </router-link>
            </div>
        </header>
        <div class="container">
            <div class="forms">
                <div class="login">
                    <h2 class="registered">Déjà inscrit ?</h2>

                    <div class="email">
                        <label for="email">Email: </label>
                        <input type="text" v-model="userObjectLogin.emailAddress" ref="loginEmail" @change="deleteClassError('loginEmail')">
                    </div>

                    <div class="password">
                        <label for="password">Mot de passe: </label>
                        <input type="password" v-model="userObjectLogin.password" ref="loginPassword" @change="deleteClassError('loginPassword')">
                    </div>

                    <button v-on:click="login(userObjectLogin.emailAddress, userObjectLogin.password)">Connexion</button>
                </div>
                <div ref="warning" class="warning">
                    <p>
                        - Les champs 'Prénom' et 'nom' ne peuvent pas contenir de caractères spéciaux. Les accents sont accéptés.<br>
                        - L'adress email doit être au format standard xxxx@xxxx.xx, ou xxxx.xxxx@xxxx.xx<br>
                        - Le mot de passe doit contenir au minimum 6 caractères et au maximum 15. Au moins une majuscule, une minuscule, un chiffre et pas d'espace. 
                    </p>
                </div>
                <div ref="warningPassword" class="warningPassword">
                    <p>Les mots de passe ne correspondent pas</p>
                </div>
                <div class="signup">
                    <h2 class="create-account">Créer un compte</h2>
                        <div class="signup_first-name">
                        <input type="text" placeholder="Prénom" v-model="userObjectSignup.firstName" ref="signupFirstName" @change="deleteClassError('signupFirstName')">
                    </div>

                    <div class="signup_last-name">
                        <input type="text" placeholder="Nom de famille" v-model="userObjectSignup.lastName" ref="signupLastName" @change="deleteClassError('signupLastName')">
                    </div>

                    <div class="signup_email">
                        <input type="text" placeholder="Adresse email" v-model="userObjectSignup.emailAddress" ref="signupEmail" @change="deleteClassError('signupEmail')">
                    </div>

                    <div class="signup_password">
                        <input type="password" placeholder="Mot de passe" v-model="userObjectSignup.password1" ref="signupPassword1" @change="deleteClassError('signupPassword1')">
                    </div>

                    <div class="signup_password_confirmation" >
                        <input type="password" placeholder="Confirmer le mot de passe" v-model="userObjectSignup.password2" ref="signupPassword2" @change="deleteClassError('signupPassword2')">
                    </div>

                    <button v-on:click="signup(userObjectSignup)">Inscription</button>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Footer from '@/components/Footer'
import axios from 'axios'

export default {
    name: 'Connexion',
    components: {
        Footer
    },
    data() {
        return {
            URL: 'http://localhost:5000/api/v1/users/',
            userObjectSignup: {
                emailAddress: '',
                password1: '',
                password2: '',
                firstName: '',
                lastName: ''
            },
            userObjectLogin: {
                emailAddress: '',
                password: ''
            }
        }
    },
    methods: {
        errorDisplay(statusCode){
            switch (statusCode) {
                case 432:
                    this.$refs.signupFirstName.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 433:
                    this.$refs.signupLastName.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 434:
                    this.$refs.signupEmail.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 435:
                    this.$refs.signupPassword1.classList.add('error');
                    this.$refs.signupPassword2.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 436:
                    this.$refs.signupFirstName.classList.add('error');
                    this.$refs.signupLastName.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 437:
                    this.$refs.signupFirstName.classList.add('error');
                    this.$refs.signupEmail.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 438:
                    this.$refs.signupFirstName.classList.add('error');
                    this.$refs.signupPassword1.classList.add('error');
                    this.$refs.signupPassword2.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 439:
                    this.$refs.signupFirstName.classList.add('error');
                    this.$refs.signupLastName.classList.add('error');
                    this.$refs.signupEmail.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 440:
                    this.$refs.signupFirstName.classList.add('error');
                    this.$refs.signupLastName.classList.add('error');
                    this.$refs.signupPassword1.classList.add('error');
                    this.$refs.signupPassword2.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 441:
                    this.$refs.signupFirstName.classList.add('error');
                    this.$refs.signupEmail.classList.add('error');
                    this.$refs.signupPassword1.classList.add('error');
                    this.$refs.signupPassword2.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 442:
                    this.$refs.signupLastName.classList.add('error');
                    this.$refs.signupEmail.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 443:
                    this.$refs.signupLastName.classList.add('error');
                    this.$refs.signupPassword1.classList.add('error');
                    this.$refs.signupPassword2.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 444:
                    this.$refs.signupLastName.classList.add('error');
                    this.$refs.signupEmail.classList.add('error');
                    this.$refs.signupPassword1.classList.add('error');
                    this.$refs.signupPassword2.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 445:
                    this.$refs.signupEmail.classList.add('error');
                    this.$refs.signupPassword1.classList.add('error');
                    this.$refs.signupPassword2.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                case 446:
                    this.$refs.signupFirstName.classList.add('error');
                    this.$refs.signupLastName.classList.add('error');
                    this.$refs.signupEmail.classList.add('error');
                    this.$refs.signupPassword1.classList.add('error');
                    this.$refs.signupPassword2.classList.add('error');
                    this.$refs.warning.classList.add('warning_shown');
                    break;
                default:
                    console.log('Switch error');
            }
        },

        login(email, password) {
            this.$store.dispatch("login", {
                    emailAddress: email,
                    password: password,
                    URL: this.URL,
            })
            .then(() => {
                this.$router.push("/Home")
            })
            .catch((err) => {
                if(err.status == 401 ){
                    this.$refs.loginPassword.classList.add('error');
                }else if(err.status == 404 || err.status === 400){
                    this.$refs.loginEmail.classList.add('error');
                }
            })
        },
        signup() {
            if (this.userObjectSignup.password1 != this.userObjectSignup.password2){
                this.$refs.signupPassword2.classList.add('error');
                this.$refs.warningPassword.classList.add('warningPassword_shown');
            }else{
                axios.post(this.URL + 'signup', {
                    emailAddress: this.userObjectSignup.emailAddress,
                    password: this.userObjectSignup.password2,
                    firstName: this.userObjectSignup.firstName,
                    lastName: this.userObjectSignup.lastName,
                })
                .then(() => {
                    this.login(this.userObjectSignup.emailAddress, this.userObjectSignup.password2)
                })
                .catch((err) => {
                    this.errorDisplay(err.response.status)
                })
            }
        },
        deleteClassError(element){
            if(element == 'signupEmail'){
                this.$refs.signupEmail.classList.remove('error');
                this.$refs.warning.classList.remove('warning_shown');
            }else if(element == 'signupFirstName'){
                this.$refs.signupFirstName.classList.remove('error');
                this.$refs.warning.classList.remove('warning_shown');
            }else if(element == 'signupLastName'){
                this.$refs.signupLastName.classList.remove('error');
                this.$refs.warning.classList.remove('warning_shown');
            }else if(element == 'signupPassword1'){
                this.$refs.signupPassword1.classList.remove('error');
                this.$refs.warning.classList.remove('warning_shown');
            }else if(element == 'signupPassword2'){
                this.$refs.signupPassword2.classList.remove('error');
                this.$refs.warning.classList.remove('warning_shown');
                this.$refs.warningPassword.classList.remove('warningPassword_shown');
            }else if(element == 'loginEmail'){
                this.$refs.loginEmail.classList.remove('error');
                this.$refs.warning.classList.remove('warning_shown');
            }else if(element == 'loginPassword'){
                this.$refs.loginPassword.classList.remove('error');
                this.$refs.warning.classList.remove('warning_shown');
            }
        }
    },
}
</script>

<style lang="scss" scoped>

.container{
    min-height: calc(100vh - (6.4rem + 4.2rem));
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.connection-page-header_logo{

    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #557D96;
    & a img{
        height: 5rem;
    }

}

input{
    height: 2.5rem;
    width: 17.5rem;
    border-radius: 2px 2px;
    border: 1px solid rgb(49, 49, 49);
    padding: 0 5px;
}

.forms{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    @media screen and(max-width: 500px){
        flex-direction: column;
    }

    & .login{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr auto 1fr;
        justify-items: center;
        align-items: center;
        font-size: 1.6rem;

        @media screen and(max-width: 650px){
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, .4fr);
        }

        & .registered{
            grid-row: 1 / 2;
            grid-column: 1 / 3;

            @media screen and(max-width: 650px){
                grid-row: 1 / 2;
                grid-column: 1 / 2;
            }
        }

        & .email{
            grid-row: 2 / 3;
            grid-column: 1 / 2;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin: 0 10px 15px 10px;

            @media screen and(max-width: 650px){
                grid-row: 2 / 3;
                grid-column: 1 / 2;
            }
        }

        & .password{
            grid-row: 2 / 3;
            grid-column: 2 / 3;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin: 0 10px 15px 10px;

            @media screen and(max-width: 650px){
                grid-row: 3 / 4;
                grid-column: 1 / 2;
            }
        }

        & button{
            grid-row: 3 / 4;
            grid-column: 1 / 3;
            background-color: rgb(40, 108, 209);
            color: #FFFFFF;
            border-radius: 5px 5px;
            border: 0;
            align-self: center;
            height: 30px;
            width: 175px;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;

            @media screen and(max-width: 650px){
                grid-row: 4 / 5;
                grid-column: 1 / 2;
            }
        }
    }

    & .signup{
        display: grid;
        grid-gap: .4rem;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr auto auto auto 1fr;
        justify-items: center;
        align-items: center;
        font-size: 1.6rem;

        @media screen and(max-width: 840px){
            grid-template-columns: 1fr;
            grid-template-rows: repeat(7, .2fr);
        }

            & input::placeholder{
                font-size: 1.2em;
            }
        

        & .create-account{
            grid-column: 1 / 3;
            grid-row: 1 / 2;

            @media screen and(max-width: 840px){
                grid-column: 1 / 2;
                grid-row: 1 / 2;
                padding-top: 2em;
            }

            @media screen and(max-width: 500px){
                border-top: 1px solid rgba(54, 54, 54, 0.849);
            }
        }

        &_first-name{
            grid-column: 1 / 2;
            grid-row: 2 / 3;

            @media screen and (max-width: 840px) {
                grid-column: 1 / 2;
                grid-row: 2 / 3;
            }
        }

        &_last-name{
            grid-column: 2 / 3;
            grid-row: 2 / 3;
            width: 100%;

            @media screen and (max-width: 840px) {
                grid-column: 1 / 2;
                grid-row: 3 / 4;
            }
        }

        &_email{
            grid-column: 1 / 3;
            grid-row: 3 / 4;
            justify-self: stretch;

            & input{
                width: 100%;
                box-sizing: border-box;
            }

            @media screen and (max-width: 840px) {
                grid-column: 1 / 2;
                grid-row: 4 / 5;
            }
        }

        &_password{
            grid-column: 1 / 2;
            grid-row: 4 / 5;

            @media screen and (max-width: 840px) {
                grid-column: 1 / 2;
                grid-row: 5 / 6;
            }
        }

        &_password_confirmation{
            grid-column: 2 / 3;
            grid-row: 4 / 5;

            & input::placeholder{
                font-size: 1.1em;
            }

            @media screen and (max-width: 840px) {
                grid-column: 1 / 2;
                grid-row: 6 / 7;
            }
        }

        & button{
            grid-column: 1 / 3;
            grid-row: 5 / 6;

            background-color: rgb(0, 126, 6);
            color: #FFFFFF;
            border-radius: 5px 5px;
            border: 0;
            align-self: center;
            height: 30px;
            width: 175px;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;

            @media screen and (max-width: 840px) {
                grid-column: 1 / 2;
                grid-row: 7 / 8 ;
                margin: 1em 0;
            }
        }
    }
    & .warning{
        background-color: rgba(255, 0, 0, 0.541);
        font-size: 1.6em;
        max-width:25%;
        padding: 1em;
        margin: 1em 0;
        display: none;

        &_shown{
            display: block !important;
        }
    }

    & .warningPassword{
        background-color: rgba(255, 0, 0, 0.541);
        font-size: 1.6em;
        max-width:25%;
        padding: 1em;
        margin: 1em 0;
        display: none;

        &_shown{
            display: block !important;
        }
    }
}

.error{
    border: 1px solid red;
    animation: wiggle .2s;
    animation-iteration-count: 2;
}

@keyframes wiggle{
    0% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(3px);
    }
    75% {
        transform: translateX(-3px);
    }
    100% {
        transform: translateX(0);
    }
}

</style>
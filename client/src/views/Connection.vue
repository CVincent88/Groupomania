<template>
    <div class="container">

        <div class="connection-page">
            <div class="connection-page_logo">
                <router-link to="/">
                <img src="../assets/icon-left-font-monochrome-white.svg" :alt="$store.state.logo">
                </router-link>
            </div>
        </div>

        <div class="forms">
            <div class="login">
                <h2 class="registered">Déjà inscrit ?</h2>

                <div class="email">
                    <label for="email">Email: </label>
                    <input type="text" v-model="userObjectLogin.emailAddress">
                </div>

                <div class="password">
                    <label for="password">Mot de passe: </label>
                    <input type="password" v-model="userObjectLogin.password">
                </div>

                <button v-on:click="login(userObjectLogin.emailAddress, userObjectLogin.password)">Connexion</button>
            </div>

            <div class="signup">
                <h2 class="create-account">Créer un compte</h2>
                    <div class="signup_first-name">
                    <input type="text" placeholder="Prénom" v-model="userObjectSignup.firstName">
                </div>

                <div class="signup_last-name">
                    <input type="text" placeholder="Nom de famille" v-model="userObjectSignup.lastName">
                </div>

                <div class="signup_email">
                    <input type="text" placeholder="Adresse email" v-model="userObjectSignup.emailAddress">
                </div>

                <div class="signup_password">
                    <input type="password" placeholder="Mot de passe" v-model="userObjectSignup.password1">
                </div>

                <div class="signup_password_confirmation" >
                    <input type="password" placeholder="Confirmer le mot de passe" v-model="userObjectSignup.password2">
                </div>

                <button v-on:click="signup(userObjectSignup)">Inscription</button>
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
            },
        }
    },
    methods: {
        login(email, password) {
            this.$store.dispatch("login", {
                emailAddress: email,
                password: password,
                URL: this.URL
            })
            .then(() => {
                // let userObject = {
                //     id: response.data.user.id,
                //     emailAddress: response.data.user.emailAddress,
                //     firstName: response.data.user.firstName,
                //     lastName: response.data.user.lastName,
                //     biography: response.data.user.biography,
                //     profileImage: response.data.user.profileImage,
                // }
                this.$router.push("/Home")
            });
        },
        signup() {
            if (this.userObjectSignup.password1 != this.userObjectSignup.password2){
                console.log('Attention, les mots de passe ne correspondent pas')
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
            }
        },
        verifyConformity(password1, password2) {
            if(password1 != password2){
                return false
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.container{
    min-height: 100vh;
    background-color: #B0D8FF;
    position: relative;
}

Footer{
    position: absolute;
    bottom: 0px;
}

.connection-page{
    height: 4.5em;
    width: 100%;

    &_logo{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #557D96;
        & a img{
            height: 50px;
        }
    }
}

input{
    height: 25px;
    width: 175px;
    border-radius: 2px 2px;
    border: 1px solid rgb(49, 49, 49);
    padding: 0 5px;
}

.forms{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    @media screen and (max-width: 425px) {
        flex-direction: column;
    }

    & .login{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr auto 1fr;
        justify-items: center;
        align-items: center;
        
        @media screen and (max-width: 820px) {
            grid-template-rows: 1fr auto auto 1fr;
        }

        & .registered{
            grid-row: 1 / 2;
            grid-column: 1 / 3;
        }

        & .email{
            grid-row: 2 / 3;
            grid-column: 1 / 2;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin: 0 10px 15px 10px;

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
            }
        }

        & .password{
            grid-row: 2 / 3;
            grid-column: 2 / 3;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin: 0 10px 15px 10px;

            @media screen and (max-width: 820px) {
                grid-row: 3 / 4;
                grid-column: 1 / 3;
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

            @media screen and (max-width: 820px) {
                grid-row: 4 / 5;
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

        @media screen and (max-width: 820px) {
            grid-template-rows: 1fr repeat(4, auto) 1fr;
        }


            & input::placeholder{
                font-size: 1.2em;
            }
        

        & .create-account{
            grid-column: 1 / 3;
            grid-row: 1 / 2;
        }

        &_first-name{
            grid-column: 1 / 2;
            grid-row: 2 / 3;

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
                grid-row: 2 / 3;
            }
        }

        &_last-name{
            grid-column: 2 / 3;
            grid-row: 2 / 3;
            width: 100%;

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
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

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
                grid-row: 4 / 5;
            }
        }

        &_password{
            grid-column: 1 / 2;
            grid-row: 4 / 5;

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
                grid-row: 5 / 6;
            }
        }

        &_password_confirmation{
            grid-column: 2 / 3;
            grid-row: 4 / 5;

            & input::placeholder{
                font-size: 1.1em;
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

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
                grid-row: 6 / 7 ;
            }
        }
    }
}

</style>
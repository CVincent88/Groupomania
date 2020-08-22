<template>
    <div class="container">

        <TopBanner/>

        <div class="forms">
            <div class="login">
                <h2 class="registered">Déjà inscrit ?</h2>

                <div class="email">
                <label for="email">Email: </label>
                <input type="text">
                </div>

                <div class="password">
                <label for="password">Mot de passe: </label>
                <input type="password">
                </div>

                <button>Connexion</button>
            </div>

            <div class="signup">
                <h2 class="create-account">Créer un compte</h2>
                <div class="signup_first-name">
                <input type="text" placeholder="Prénom">
                </div>

                <div class="signup_last-name">
                <input type="text" placeholder="Nom de famille">
                </div>

                <div class="signup_email">
                <input type="text" placeholder="Adresse email">
                </div>

                <div class="signup_password">
                <input type="password" placeholder="Mot de passe">
                </div>

                <button>Inscription</button>
            </div>
        
        </div>
    </div>
</template>

<script>
import TopBanner from '../components/TopBanner.vue'

export default {
    name: 'Connexion',
    components: {
        TopBanner
    }

}
</script>

<style lang="scss" scoped>

.container{
    min-height: 100vh;
    background-color: #E9EBEE;
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
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr auto auto 1fr;
        justify-items: center;
        align-items: center;

        @media screen and (max-width: 820px) {
            grid-template-rows: 1fr repeat(4, auto) 1fr;
        }

        & input{
            margin: 4px;

            &::placeholder{
                font-size: 1.2em;
            }
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

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
                grid-row: 3 / 4;
            }
        }

        &_email{
            grid-column: 1 / 2;
            grid-row: 3 / 4;

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
                grid-row: 4 / 5;
            }
        }

        &_password{
            grid-column: 2 / 3;
            grid-row: 3 / 4;

            @media screen and (max-width: 820px) {
                grid-column: 1 / 3;
                grid-row: 5 / 6;
            }
        }

        & button{
            grid-column: 1 / 3;
            grid-row: 4 / 5;

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
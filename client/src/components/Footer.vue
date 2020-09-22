<template>
    <div>
        <div class="container">
            <div class="logo">
                <img src="../assets/icon.svg" alt="Icone Groupomania">
                <span>Groupomania</span>
            </div>

            <div class="links">
                <span>Mentions légales</span>
                <span>|</span>
                <span>Contact</span>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Footer'
}
</script>

<style lang="scss" scoped>

.container{
    display: flex;
    background-color: #557D96;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 1em 0;
    font-size: 1.6rem;

    @media screen and(max-width: 540px  ){
        flex-direction: column;
        margin-top: 1em;
    }

    & .logo{
        line-height: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;  
        color: #FFFFFF;
        text-decoration: none;
        transition: color .3s;
        margin: 0 2em;
        cursor: default;

        @media screen and(max-width: 540px  ){
            margin: .5em 0;
        }        

        &:hover{
        color: #ff5c67;
        }

        & img{
            height: 1.5em;
        }

    }

    & .links{
        margin: 0 2em;

        & span{
            margin: .7em;
        }

        @media screen and(max-width: 540px  ){
            margin-bottom: .5em;
        }
    }
}

</style>
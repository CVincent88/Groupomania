<template>
    <div>
        <div class="container">
            <router-link to="/Home" class="homelink">
                <img src="../assets/icon.svg" alt="Icone Groupomania">
                <h1>Groupomania</h1>
            </router-link>

            <div class="link">
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
    height: 4.5em;
    width: 100%;
    align-items: center;
    justify-content: space-between;




    & .homelink{
        line-height: 0;
        display: flex;
        justify-content: center;
        color: #FFFFFF;
        text-decoration: none;
        transition: color .3s;
        margin: 2em;

        &:hover{
        color: #ff5c67;
        }

        & img{
            height: 1.5em;
        }

        & h1{
            line-height: 0.3em;
            font-size: 1em;
        }

    }

    & .link{
        margin: 2em;

        & span{
            margin: 1em;
        }
    }
}

</style>
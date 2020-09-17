<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App',
    beforeMount() {
        if(!localStorage.getItem('token') && this.$route.path != '/'){
            this.$router.push("/")
        }
    }
}
</script>

<style lang="scss" >



html, body {
    margin: 0px !important;
    padding: 0px !important;
    box-sizing: border-box;
    background-color: #b0d8ff;
    // font-size: 10px;
}

body{
    margin: 0;
    padding: 0;
    min-height: 100vh;

    &::-webkit-scrollbar {
        width: .4em;
    }

    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    &::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
    }
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>

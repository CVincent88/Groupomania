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
}

body{
    margin: 0;
    padding: 0;
}

body::-webkit-scrollbar {
    width: .4em;
}

body::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

body::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
        color: #42b983;
        }
    }
}
</style>

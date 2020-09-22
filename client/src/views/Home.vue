<template>
<div class="home" >
    <TopBanner />
    <div class="wrapper">
        <div class="container">
            <div class="information">
                <div class="information_user">
                    <img :src="require(`../../../backend/images/${this.profilePicture}`)" alt="Profile picture">                    <router-link :to="{
                    name: 'ProfilePage', 
                    params: { profileToLoad: this.userObject.id }}" 
                    class="information_user_name">{{ userObject.firstName }} {{ userObject.lastName }}</router-link>
                </div>
                <div class="information_news">
                    <h2 class="title">Actus Groupomania</h2>
                    <ul>
                        <li>news 1</li>
                        <li>news 2</li>
                        <li>news 3</li>
                        <li>news 4</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="publication">
            <CreatePost />
            <PostThread :posts="this.$store.state.posts" />
        </div>
    </div>
    <Footer />
</div>
</template>


<script>
// @ is an alias to /src
import TopBanner from '@/components/TopBanner.vue'
import CreatePost from '@/components/posts/CreatePost.vue'
import PostThread from '@/components/posts/PostThread.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

export default {
    name: 'Home',
    components: {
        TopBanner,
        CreatePost,
        PostThread,
        Footer,
    },
    data() {
        return {
            userObject: this.$store.state.userObject,
            profilePicture: ''
        }
    },
    beforeMount() {
        axios.get(this.$store.state.URL + 'users/' + this.userObject.id, {
            headers: {
                'Authorization': this.$store.state.token
            },
        })
        .then((res) => {
            this.myName = res.data.firstName + ' ' + res.data.lastName
            this.profilePicture = res.data.profileImage.split('images/')[1];
            console.log(this.profilePicture)
        })
    }
}
</script>


<style lang="scss" scoped>

.wrapper {
    display: flex;
    justify-content: center;
    width: 95%;
    margin: 2.5rem auto;
    min-height: calc(100vh - (4rem + 4.3rem + 2.5rem + 2.5rem));
    font-size: 1.6rem;

    @media screen and(max-width: 768px){
        flex-direction: column;
    }

    & .container{
        display: flex;
        justify-content: center;
        margin: 0 1.5rem;
        min-height: 100%;

        & .information{
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;

            @media screen and(max-width: 768px){
                position: relative;
            }

            &_user{
                display: flex;
                flex-direction: column;

                & img{
                    max-height: 20rem;
                    max-width: 20rem;
                }

                &_name{
                    margin-top: 10px;
                    text-decoration: none;
                    color: black;

                    &:hover{
                        color: blue;
                    }
                }
            }

            &_news{
                border: 1px solid black;
                background-color: #557d96;
                padding: 10px;
                margin-top: 15px;
                text-align: start;

                & .title{
                    text-align: center;
                    color: #FFFFFF;
                }

                & ul li{
                    color: #FFFFFF;
                }
            }
        }
    }

    & .publication{
        margin: 0 15px;
    }
}

.wrapper > * {
    flex-basis: 400px;
    flex-grow: 1;
}

.loading {
    text-align: center;
    position: absolute;
    color: #ffffff;
    z-index: 9;
    background: rgb(107, 107, 209);
    padding: 8px 18px;
    border-radius: 5px;
    left: calc(50% - 45px);
    top: calc(50% - 18px);
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s
}
.fade-enter, .fade-leave-to {
    opacity: 0
}
</style>
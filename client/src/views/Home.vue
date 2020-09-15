<template>
<div class="home" id="app">
    <TopBanner />
    <div class="wrapper">
        <div class="information">
            <div class="information_user">
                <img src="../../public/images/default_profile_picture.jpg" alt="Profile picture">
                <router-link :to="{
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
        <div class="publication">
            <CreatePost class="test"/>
            <PostThread class="test2"/>
        </div>
    </div>
</div>
</template>


<script>
// @ is an alias to /src
import TopBanner from '@/components/TopBanner.vue'
import PostThread from '@/components/posts/PostThread.vue'
import CreatePost from '@/components/posts/CreatePost.vue'
import axios from 'axios'

export default {
    name: 'Home',
    components: {
        TopBanner,
        PostThread,
        CreatePost
    },
    data() {
        return {
            test: 'test',
            userObject: JSON.parse(localStorage.getItem('userObject'))
        }
    },
    beforeMount() {
        axios.get(this.$store.state.URL + 'users/' + localStorage.getItem('myUserId'), {
            headers: {
                'Authorization': this.$store.state.token
            },
        })
        .then((res) => {
            this.myName = res.data.firstName + ' ' + res.data.lastName
        })
    }
}
</script>


<style lang="scss" scoped>

.wrapper {
    display: grid;
    align-items: center;
    grid-template-rows: 1fr auto;
    grid-template-columns: 1fr 1fr;
    width: 95%;
    margin: 20px auto;

    & .information{
        grid-column: 1 / 2;
        grid-row: 1 / 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: fixed;
        width: 50%;
        margin: auto;

        &_user{
            display: flex;
            flex-direction: column;

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
            width: 80%;
            margin: 30px;
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

    & .publication{
        grid-column: 2 / 3;

        & .test{
            grid-row: 1 / 2;
        }
    
        & .test2{
            grid-row: 2 / 3;
        }
    }
}

.wrapper > * {
    flex-basis: 400px;
    flex-grow: 1;
}




</style>
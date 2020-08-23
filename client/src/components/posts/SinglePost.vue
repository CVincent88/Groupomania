<template>
<div class="singlePost">
    <div class="user">
        <img class="profile-picture" src="../../../public/images/default_profile_picture.jpg" alt="Default profile picture">
        <span class="user_username">{{ `${post.author.firstName} ${post.author.lastName}` }}</span>
    </div>
    <div class="post-content-box">
        <p class="post-content">{{ post.content }}</p>
    </div>
    <div class="users-reactions">
        <div class="likes">
            <button class="like-button reaction-button">J'aime</button>
            <span class="like-number reaction-number">{{ post.like }}1</span>
        </div>
        <span>|</span>
        <div class="dislikes">
            <button class="dislike-button reaction-button">Je n'aime pas</button>
            <span class="dislike-number reaction-number">{{ post.dislike }}1</span>
        </div>
    </div>
</div>
</template>


<script>

export default {
    name: 'SinglePost',
    props: {
        post: Object
    }
}
</script>

<style lang="scss" scoped>

.user{
    display: flex;
    align-items: center;
    text-align: start;

    & .profile-picture{
        width: 30px;
        height: 30px;
    }

    &_username{
        margin: 0 10px;
    }
}

.post-content-box{
    text-align: start;
}

.users-reactions{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

</style>
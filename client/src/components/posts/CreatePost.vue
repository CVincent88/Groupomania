<template>
<div class="post-creator">
    <input type="text" name="post" id="post" placeholder="Que souaitez-vous publier ?">
    <button>Publier</button>
</div>
</template>


<script>

export default {
    name: 'CreatePost',

}
</script>

<style lang="scss" scoped>

.post-creator{
    display: flex;
    flex-direction: column;
    margin: 20px 8px;
    padding: 10px;
    background-color: #425561;
    border-radius: 10px 10px;
    box-shadow: 2px 2px 10px rgba(195, 209, 216, .7);
    align-items: center;

    & input{
        width: 70%;
        height: 50px;
        &:focus{
            outline: 1px solid #347BE7;
        }
    }

    & button{
        margin-top: 15px;
        border: none;
        border-radius: 4px 4px;
        outline: 0;
        background-color: #347BE7;
        width: 70%;

    }
}

</style>
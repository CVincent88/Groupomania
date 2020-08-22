<template>
    <div class="home">
        <div v-if="!$store.state.user.userAuthenticated">
            <Connection/>
        </div>

        <div v-else>
            <TopBanner/>
            <img alt="Vue logo" src="../assets/icon.png">
        </div>

    </div>
</template>

<script>
// @ is an alias to /src
import TopBanner from '@/components/TopBanner.vue'
import Connection from '@/views/Connection.vue'

export default {
    name: 'Home',
    components: {
        TopBanner,
        Connection
    },

}
</script>

<template>
    <mils-list v-if="mils" :mils="mils" />
    <span v-else>Загрузка...</span>
</template>

<script>
import axios from 'axios'
import MilsList from '@/components/MilsList.vue'

export default {
    components: {MilsList},
    data() {
        return {
            mils: null
        }
    },
    async created() {
        let resp = await axios.get('./milestones.json')
        resp.data.Routes.forEach(r => {
            r.Milestones = r.Milestones.map(m=> resp.data.Milestones.find(z => z.OsmId === m))
        });
        resp.data.Routes.sort((a,b)=>a.Ref.localeCompare(b.Ref))
        this.mils = resp.data
    },
}
</script>

<style scoped>

</style>
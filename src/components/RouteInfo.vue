<template>
    <div :class="['route', {active: active}]">
        <div class="route-short-info" @click="activate">
            <div class="route-ref">{{route.Ref}}</div>
            <div class="route-counter">{{route.Milestones.length}}</div>
            <div class="route-name">{{route.Name || '&nbsp'}}</div>
        </div>
        <div v-if="active" class="route-name">
            <div class="route-miles">
                <div v-for="(rmil, i) of forward" :key="rmil.OsmId" 
                    :class="['route-mile', checkNeighbors(i, false)]"
                    @click="$emit('selectedMile', rmil)">
                    {{rmil.Distance}}
                </div>
            </div>
            <div class="route-miles">
                <div v-for="(rmil, i) of backward" :key="-1*rmil.OsmId"
                    :class="['route-mile', checkNeighbors(i, true)]"
                    @click="$emit('selectedMile', rmil)">
                    {{rmil.DistanceBack}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        route: Object,
        active: Boolean
    },
    data() {
        return {
            states: {
                active: false,
            }
        }
    },
    computed: {
        forward() {
            return this.route.Milestones.filter(x => x.Distance !== null)
                .sort((a, b) => a.Distance - b.Distance)
        },
        backward() {
            return this.route.Milestones.filter(x => x.DistanceBack !== null)
                .sort((a, b) => a.DistanceBack - b.DistanceBack)
        }
    },
    methods: {
        activate() {
            this.$emit('selected', {
                id: this.route.OsmId * (this.route.Relation ? -1 : 1),
                mils: this.route.Milestones
            })
        },
        checkNeighbors(i, back) {
            let side = back ? 'backward' : 'forward'
            let left =  this.checkNeighbor(this[side][i], this[side][i-1], back)
            let right = this.checkNeighbor(this[side][i], this[side][i+1], back)
            return {
                'left-none':  !left && right,
                'right-none': left && !right,
                'both-none': !left && !right,
            }
        },
        checkNeighbor(a, b, back) {
            let distance = back ? 'DistanceBack' : 'Distance'
            if (a && b) 
                return Math.abs(a[distance] - b[distance]) === 1
            else
                return false
        },
    },
}
</script>

<style scoped>
.route-ref {
    float: left;
    width: 100px;
    overflow: hidden;
    clear: left;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
}
.route-name {
    margin-left: 110px;
}
.route-counter {
    float: right;
    background: #ffe7cc;
    border-radius: 5px;
    padding: 0 5px;
    text-align: center;
}
.route-miles {
    margin-bottom: 10px;
}

.route-mile {
    display: inline-block;
    width: 50px;
    text-align: center;
    margin: 1px 0;
    background: #ccefff;
}
.route-mile:hover {
    background: #aae4ff;
    cursor: pointer;
}
.left-none {
    border-radius: 10px 0 0 10px;
}
.right-none {
    border-radius: 0 10px 10px 0;
}
.both-none {
    border-radius: 10px;
}

.route-short-info {
    padding: 5px;
    cursor: pointer;
}
.route {
    margin: 0 5px 0 5px;
    outline: none;
}
.active {
    margin: 10px 5px;
    padding: 10px 0 ;
    border-radius: 5px;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
    background: #fff;
    outline: none;
}
</style>
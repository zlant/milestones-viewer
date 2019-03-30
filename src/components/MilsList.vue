<template>
    <div class="container">
        <div v-if="mils" class="list">
            <route-info v-for="(route, i) of mils.Routes" :key="route.OsmId" 
                :active="currenRoute === route.OsmId * (route.Relation ? -1 : 1)"
                :tabindex="i"
                :route="route" 
                @selected="showRoute"
                @selectedMile="showMilestone" />
        </div>
        <l-map class="map" :bounds="bounds" :zoom.sync="zoom" ref="map">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker v-if="currenRoute" v-for="marker of simpleMils" :key="marker.Lat" 
                :lat-lng="marker" 
                :icon="createIcon(marker.distance, marker.forward)"
            ></l-marker>
        </l-map>
    </div>
</template>

<script>
import axios from 'axios'
import RouteInfo from '@/components/RouteInfo.vue';
import {simple} from './simple'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

import {LMap,LTileLayer, LMarker} from 'vue2-leaflet';
import "leaflet/dist/leaflet.css";

export default {
    components: {
        RouteInfo,
        LMap,
        LTileLayer, 
        LMarker
    },
    props: {
        mils: {
            type: Object,
            default: null
        },
    },
    data() {
        return {
            routeMils: [],
            bounds: null,
            currenRoute: null,

            zoom: 1,
            simple: 0,
            
            url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }
    },
    computed: {
        simpleMils() {
            if (this.simple) {
                let sorted = this.routeMils.sort((a, b) => a.distance - b.distance)
                let forward = simple(sorted.filter(x => x.forward), this.simple)
                let backward = simple(sorted.filter(x => !x.forward), this.simple)
                return forward.concat(backward)
            } else
                return this.routeMils
        }
    },
    watch: {
        zoom(newValue, oldValue) {
            if (newValue >= 11)
                this.simple = 0
            else if (newValue >= 9)
                this.simple = 5
            else if (newValue >= 8)
                this.simple = 10
            else if (newValue >= 7)
                this.simple = 20
            else if (newValue >= 6)
                this.simple = 30
            else if (newValue >= 5)
                this.simple = 40
            else
                this.simple = 50
        }
    },
    methods: {
        showRoute({id, mils}) {
            this.currenRoute = id
            this.routeMils = mils.map(x =>{ return {
                lat: x.Lat,
                lng: x.Lon,
                distance: x.Distance !== null ? x.Distance : x.DistanceBack,
                forward: x.Distance !== null,
            }})
            this.bounds = L.latLngBounds(this.routeMils);
            this.$nextTick(() => this.zoom = this.$refs.map.mapObject.getZoom())
        },
        showMilestone(milestone){
            this.zoom = Math.max(10, this.zoom)
            this.$refs.map.mapObject.setView(new L.LatLng(milestone.Lat, milestone.Lon), this.zoom);

        },
        createIcon(text, forward) {
            return L.divIcon({ 
                className: 'icon '+ (forward ? 'icon-forward' : 'icon-backward'),
                iconSize: new L.Point(30, 17),
                html: text,
            })
        }
    },
}
</script>

<style scoped>
.container {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
.list {
    position: relative;
    overflow-x: hidden;
    height: 50%;
    width: 100%;
    background: #f6f6f6;
}
.map {
    position: relative;
    height: 50%;
    width: 100%;
}
@media only screen and (min-width: 1024px) {
    .list {
        position: relative;
        float: left;
        overflow-x: hidden;
        height: 100%;
        width: 50%;
    }
    .map {
        position: relative;
        float: right;
        width: 50%;
        height: 100%;
    }
}
</style>
<style>
.icon {
	border-radius: 2px;
    text-align: center;
}
.icon-forward {
	background: #0d69e1;
    color: white;
	border: 1px solid white;
}
.icon-backward {
	background: white;
    color: #0d69e1;
	border: 1px solid #0d69e1;
}
</style>

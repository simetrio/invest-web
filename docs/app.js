const EventHandling = {
    data() {
        return {
            message: "",
            result: [],
        }
    },
    methods: {
        reverseMessage() {
            this.result = [{name:"one"}, {name:"two"}, {name:"three"}, {name:"four"}]
                .filter(x => x.name.indexOf(this.message) !== -1);
        }
    }
}

Vue.createApp(EventHandling).mount("#root")

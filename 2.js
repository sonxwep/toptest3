const MainApp = {
    data() {
        return {
            currentUser: null
        }
    },
    created() {
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        } else {
            window.location.href = 'index.html';
        }
    },
    methods: {
        logout() {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    }
}
const app = Vue.createApp(MainApp);
app.mount('#app');

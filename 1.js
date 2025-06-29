const App = {
    data() {
        return {
            username: '',
            password: '',
            message: '',
            isLoginMode: true,
            currentUser: null,
            courses: [],
            searchQuery: '',
            selectedAge: '',
            selectedSubject: '',
            isLoading: false,
            error: null,
            favorites: JSON.parse(localStorage.getItem('favorites')) || []
        }
    },
    computed: {
        filteredCourses() {
            let filtered = this.courses;
            
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(course => 
                    course.subject.toLowerCase().includes(query)
                );
            }
            
            if (this.selectedAge) {
                filtered = filtered.filter(course => course.age === this.selectedAge);
            }
            
            if (this.selectedSubject) {
                filtered = filtered.filter(course => course.subject === this.selectedSubject);
            }
            
            return filtered;
        },
        uniqueSubjects() {
            return [...new Set(this.courses.map(course => course.subject))];
        }
    },
    methods: {
        register() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.username === this.username);
            
            if (userExists) {
                this.message = 'Пользователь с таким логином уже существует';
                return;
            }
            
            users.push({
                username: this.username,
                password: this.password
            });

            localStorage.setItem('users', JSON.stringify(users));

            this.username = '';
            this.password = '';
            this.message = 'Регистрация успешна!';
            this.isLoginMode = true;

            setTimeout(() => {
                this.message = '';
            }, 3000);
        },
        login() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => 
                user.username === this.username && 
                user.password === this.password
            );
            
            if (user) {
                this.message = 'Вход выполнен успешно!';
                
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUser = user;
                
                setTimeout(() => {
                    window.location.href = 'main.html';
                }, 400);
            } else {
                this.message = 'Неверный логин или пароль';
            }
        },
        logout() {
            sessionStorage.removeItem('currentUser');
            this.currentUser = null;
            window.location.href = 'index.html';
        },
        async fetchCourses() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await fetch('api.json');
                const data = await response.json();
                this.courses = data;
            } catch (err) {
                this.error = 'Ошибка загрузки данных';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        toggleFavorite(courseId) {
            const course = this.courses.find(c => c.id === courseId);
            if (!course) return;
            
            const index = this.favorites.findIndex(fav => fav.id === courseId);
            if (index === -1) {
                this.favorites.push({
                    id: course.id,
                    subject: course.subject,
                    age: course.age
                });
            } else {
                this.favorites.splice(index, 1);
            }
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        },
        
        isFavorite(courseId) {
            return this.favorites.some(fav => fav.id === courseId);
        },
        
        resetFilters() {
            this.searchQuery = '';
            this.selectedAge = '';
            this.selectedSubject = '';
        }
    },
    mounted() {
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        } else if (window.location.pathname.endsWith('main.html')) {
            window.location.href = 'index.html';
        }
        
        this.fetchCourses();
    }
}

const app = Vue.createApp(App);
app.mount('#app');
<template>
  <div>
    <div class="mm-open" v-if="nav_open"><div @click.prevent="nav_open = !nav_open" class="mm-fullscreen-bg d-block"></div></div>
    <nav :class="`panel-menu${nav_open ? ' mmitemopen' : ''}`" id="mobile-menu">
      <div class="mmpanels">
        <div class="mmpanel mmopened mmcurrent" id="mm0">
          <ul>
            <li class="mm-close-parent">
              <a @click.prevent="nav_open = !nav_open" href="" data-target="#close" class="mm-close">
                Close
                <div class="tt-icon">
                  <svg>
                    <use xlink:href="#icon-cancel"></use>
                  </svg>
                </div>
              </a>
            </li>

            <li @click="nav_open = !nav_open"><NuxtLink :to="{name: 'trending'}"><span>Trending</span></NuxtLink></li>
            <li @click="nav_open = !nav_open"><NuxtLink :to="{name: 'following'}"><span>Following</span></NuxtLink></li>
            <li @click="nav_open = !nav_open"><NuxtLink :to="{name: 'category'}"><span>Categories</span></NuxtLink></li>
            <li @click="nav_open = !nav_open"><NuxtLink :to="{name: 'tags'}"><span>Tags</span></NuxtLink></li>
            <!-- <li><a href="#mm1" data-target="#mm1" class="mm-next-level"><span>Pages</span></a> -->

            </li>
          </ul>
        </div>
        <!-- <div class="mmpanel mmhidden" id="mm1">
          <ul>
            <li><a href="#" data-target="#" class="mm-prev-level">Back</a></li>
            <li><a href="page-single-user.html" class="mm-original-link"><span>More</span></a></li>
            <li class="active"><a href="index.html">Home</a></li>
          </ul>
        </div> -->
      </div>
    </nav>
    <header id="tt-header">
      <div class="container">
        <div class="row tt-row no-gutters" style="position-relative">
          <div class="col-auto">
            <!-- toggle mobile menu -->
            <a @click.prevent="nav_open = !nav_open" class="toggle-mobile-menu" href="#">
              <svg class="tt-icon">
                <use xlink:href="#icon-menu_icon"></use>
              </svg>
            </a>
            <!-- /toggle mobile menu -->
            <!-- logo -->
            <div class="tt-logo">
              <NuxtLink to="/">
                <svg class="logo">
                  <use xlink:href="#logo"></use>
                </svg>
              </NuxtLink>
            </div>
            <!-- /logo -->
            <!-- desctop menu -->
            <div class="tt-desktop-menu">
              <nav>
                <ul>
                  <li><NuxtLink :to="{name: 'trending'}"><span>Trending</span></NuxtLink></li>
                  <li><NuxtLink :to="{name: 'category'}"><span>Categories</span></NuxtLink></li>
                  <li><NuxtLink :to="{name: 'tags'}"><span>Tags</span></NuxtLink></li>
                  <li>
                    <a href="#"><span>More</span></a>
                    <ul>
                      <li><NuxtLink :to="{name: 'following'}">Following</NuxtLink></li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
            <!-- /desctop menu -->
            <!-- tt-search -->
            <div class="tt-search">
              <!-- toggle -->
              <button @click.prevent="$router.push({name: 'search-query'})" class="tt-search-toggle">
                <svg class="tt-icon">
                  <use xlink:href="#icon-search"></use>
                </svg>
              </button>
              <!-- /toggle -->
              <form @submit.prevent="search()" class="search-wrapper">
                <div class="search-form">
                  <input v-model.trim="query" @keyup="liveSearch()" type="text" class="tt-search__input" name="search" placeholder="Search" autocomplete="off" required>
                  <button class="tt-search__btn" type="submit">
                    <svg class="tt-icon">
                      <use xlink:href="#icon-search"></use>
                    </svg>
                  </button>
                  <button class="tt-search__close">
                    <svg class="tt-icon">
                      <use xlink:href="#cancel"></use>
                    </svg>
                  </button>
                </div>
                <div class="search-results" v-if="showResult" style="width:unset;">
                  <div class="tt-search-scroll scroll" v-if="liveSearches.length !== 0">
                    <ul>
                      <li v-for="(search, index) in liveSearches" :key="index">
                        <NuxtLink :to="!search.reply_id ? {name: 'topic-id', params: {id: search.id }} : {name: 'topic-id', params: {id: search.id }, query: {reply: search.reply_id}, hash: '#reply'}">
                          <h6 class="tt-title" style="white-space: normal;">{{ search.title }}</h6>
                          <div class="tt-description" v-html="search.body.substring(0, 22)"></div>
                        </NuxtLink>
                      </li>
                    </ul>
                    
                    <div class="tt-row-btn py-0">
                      <button type="button" class="btn-icon js-topiclist-showmore">
                        <svg :class="`tt-icon${loader}`">
                          <use xlink:href="#icon-load_lore_icon"></use>
                        </svg>
                      </button>
                      <div v-observe-visibility="visibilityChange"></div>
                    </div>
                  </div>
                  <div class="p-1 text-center" v-else>Not Found</div>
                  <button @click.prevent="search()" type="button" class="tt-view-all">Go Search Page</button>
                </div>
              </form>
            </div>
            <!-- /tt-search -->
          </div>
          <div class="col-auto ml-auto">
            <div v-if="!authenticated" class="tt-account-btn">
              <NuxtLink to="/login" class="btn btn-primary">Log in</NuxtLink>
              <NuxtLink to="/register" class="btn btn-secondary">Sign up</NuxtLink>
            </div>
            <div v-else>
              <div class="tt-user-info d-flex justify-content-center">
                <a @click.prevent="getNotifications()" href="" class="tt-btn-icon">
                  <i class="tt-icon" style="position: relative;"><svg><use xlink:href="#icon-notification"></use></svg></i>
                  <span v-if="notifications_count > 0" class="notification-button w3-indigo">{{notifications_count}}</span>
                </a>
                <div class="tt-col-avatar tt-size-md w3-dropdown-hover">
                  <img :src="user.avatar" alt="" class="w3-round-xxlarge">
                  <div class="w3-dropdown-content w3-bar-block w3-border">
                    <NuxtLink :to="{name: 'user-id', params: {id: user.id}}" class="w3-bar-item w3-button">Profile</NuxtLink>
                    <a href="/logout" @click.prevent="logout" class="w3-bar-item w3-button">Logout</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="notification-results" v-if="authenticated && showNotification">
          <div class="tt-notification-scroll scroll" v-if="notifications.length !== 0">
            <ul>
              <li v-for="(notification, index) in notifications" :key="index" :class="!notification.read_at ? 'list-select' : ''">
                
                  <h6 class="tt-title" style="white-space: normal;">
                    <svg class="tt-icon-2">
                      <use v-if="notification.type === 'App\\Notifications\\CreateReplyNotification'" xlink:href="#icon-reply"></use>
                      <use v-if="notification.type === 'App\\Notifications\\ReactionReplyNotification' || notification.type === 'App\\Notifications\\ReactionTopicNotification'" :xlink:href="`#icon-${notification.data.reaction_type}`"></use>
                      <use v-if="notification.type === 'App\\Notifications\\FollowNotification'" xlink:href="#icon-view"></use>
                    </svg>
                    <NuxtLink :to="{name: 'user-id', params: {id: notification.data.user.id}}">{{ notification.data.user.name }}</NuxtLink>
                    <NuxtLink :to="{name: 'topic-id', params: {id: notification.notifiable_id }, query: {reply: notification.data.reply_id}, hash: '#reply'}" v-if="notification.type === 'App\\Notifications\\CreateReplyNotification'" class="text-underline">reply on your topic</NuxtLink>
                    <NuxtLink :to="{name: 'topic-id', params: {id: notification.notifiable_id }, query: {reply: notification.data.reply_id}, hash: '#reply'}" v-if="notification.type === 'App\\Notifications\\ReactionReplyNotification'" class="text-underline">{{notification.data.reaction_type}} on your reply</NuxtLink>
                    <NuxtLink :to="{name: 'topic-id', params: {id: notification.notifiable_id }}" v-if="notification.type === 'App\\Notifications\\ReactionTopicNotification'" class="text-underline">{{notification.data.reaction_type}} on your topic</NuxtLink>
                    <NuxtLink :to="{name: 'user-id', params: {id: notification.data.user.id}}" v-if="notification.type === 'App\\Notifications\\FollowNotification'" class="text-underline">Follow you</NuxtLink>
                  </h6>
                
              </li>
            </ul>
            
            <div class="tt-row-btn py-0">
              <button type="button" class="btn-icon js-topiclist-showmore">
                <svg :class="`tt-icon${loader}`">
                  <use xlink:href="#icon-load_lore_icon"></use>
                </svg>
              </button>
              <div v-observe-visibility="moreNotifications"></div>
            </div>
          </div>
          <div class="p-1 text-center" v-else>Not Found</div>
          <button @click.prevent="deleteNotifications()" type="button" class="tt-view-all">Clear Notification</button>
        </div>
      </div>
    </header>
    <div @click="showResult = false" v-if="showResult" class="modal-filter" style="opacity: 1;"></div>
    <div @click="showNotification = !showNotification" v-if="showNotification" class="modal-filter" style="opacity: 1;"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      liveSearches: [],
      showResult: false,
      notifications: [],
      notifications_count: 0,
      showNotification: false,
      loader: '',
      page: 1,
      notifyPage: 1,
      dropdown: false,

      nav_open: false,
    }
  },

  computed: {
    async notificationCount () {
      if (!this.authenticated) {
        return
      }
      try{
        let data = await this.$axios.$get(`/notifications/count`);
        this.notifications_count = data
      }catch(e){
        return
      }
    }
  },

  methods: {
    logout(){
      this.$auth.logout()
    },

    search(){
      if (this.query) {
        this.$router.push({name: 'search-query', params: {query: this.query}})
      }
    },

    async liveSearch() {
      if (this.query.length > 3) {
        let data = await this.$axios.$get(`/search/live?query=${this.query}`);
        this.liveSearches = data
        this.showResult = true
        this.page = 1
      }else{
        this.showResult = false
      }
    },
    async visibilityChange(isVisibale){
      if (!isVisibale) {
        return;
      }
      this.loader = ' animate-flicker';
      // return
      ++this.page;
      let result = await this.$axios.$get(`/search/live?query=${this.query}&page=${this.page}`);
      this.liveSearches = [...this.liveSearches, ...result];
      this.loader = '';
    },

    async getNotifications() {
      if (this.showNotification) {
        return this.showNotification = false
      }
      let data = await this.$axios.$get(`/notifications`);
      this.notifications = data
      this.showNotification = true
      this.notifyPage = 1
      this.notifications_count = 0
    },

    async moreNotifications(isVisibale){
      if (!isVisibale) {
        return;
      }
      this.loader = ' animate-flicker';
      // return
      ++this.notifyPage;
      let data = await this.$axios.$get(`/notifications?page=${this.notifyPage}`);
      this.notifications = [...this.notifications, ...data];
      this.loader = '';
    },

    async deleteNotifications(){
      let data = await this.$axios.$delete(`/notifications`);
      this.notifications = []
    }

  },

  mounted(){
    this.notificationCount
  },
  
  watch: {
    '$route': async function () {
      if (!this.$auth.loggedIn) {
        return
      }
      // return
      try{
        let data = await this.$axios.$get(`/notifications/count`);
        this.notifications_count = data
      }catch(e){
        return
      }
    }
  }
}
</script>

<style lang="css">
</style>
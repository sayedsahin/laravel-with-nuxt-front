<template>
	<main id="tt-pageContent">
		<div class="container">
			<div class="tt-catSingle-title">
				<div class="d-block d-sm-flex tt-innerwrapper tt-row">
					<div class="tt-col-left">
						<ul class="tt-list-badge">
							<li><span class="tt-color01 tt-badge">{{ category.name }}</span></li>
						</ul>
					</div>
					<div class="ml-left tt-col-right">
						<div class="tt-col-item">
							<h2 class="tt-value">Topics - {{ category.count_topic }}</h2>
						</div>
						<div class="tt-col-item">
							<a @click.prevent="toggleReaction()" href="" class="tt-btn-icon">
								<i class="tt-icon"><svg :class="category.reacted ? 'active-fill' : ''"><use xlink:href="#icon-favorite"></use></svg></i>
							</a>
						</div>
						<div class="d-block d-sm-inline-block tt-col-item">
							<div class="tt-search">
								<form @submit.prevent="search()" class="d-block search-wrapper">
									<div class="search-form">
										<input v-model.trim="category_search" type="text" class="tt-search__input" :placeholder="`Search in ${category.name}`" required>
										<button class="tt-search__btn" type="submit">
											<svg class="tt-icon">
												<use xlink:href="#icon-search"></use>
											</svg>
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div class="tt-innerwrapper">
					{{ category.description }}
				</div>
				<!-- <div class="tt-innerwrapper">
					<h6 class="tt-title">Similar TAGS</h6>
					<ul class="tt-list-badge">
						<li><a href="#"><span class="tt-badge">world politics</span></a></li>
					</ul>
				</div> -->
			</div>
			<div class="tt-topic-list" v-if="category.topics.length !== 0">
				<div class="tt-list-header">
					<div class="tt-col-topic">Topic</div>
					<div class="tt-col-category">Category</div>
					<div class="tt-col-value hide-mobile">Likes</div>
					<div class="tt-col-value hide-mobile">Replies</div>
					<div class="tt-col-value hide-mobile">Views</div>
					<div class="tt-col-value">Activity</div>
				</div>

				<Topics v-for="topic in category.topics" :key="topic.id" :topic="topic" />
				<div class="tt-row-btn">
					<button type="button" class="btn-icon js-topiclist-showmore">
						<svg :class="`tt-icon${loader}`">
							<use xlink:href="#icon-load_lore_icon"></use>
						</svg>
					</button>
					<div v-observe-visibility="visibilityChange"></div>
				</div>
			</div>
			<NotFound :error="'Category Topics Not Found'" v-else />
		</div>
	</main>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  name: 'index',

  data () {
    return {
    	loader: '',
    	page: 1,
    	category_search: ''
    }
  },

  head() {
    return{
      title: this.category.name+' category - topics'
    }
  },

  async asyncData({ store, params }) { 
    await store.dispatch('category/getCategory', params.slug);
  },

  computed: {
    ...mapGetters ({
      category: 'category/category',
    })
  },

  methods: {
	  async visibilityChange(isVisibale, { $store }){
      if (!isVisibale) {
        return;
      }
      this.loader = ' animate-flicker';
      ++this.page;
      await this.$store.dispatch('category/getMoreCategory', {
      	slug: this.$route.params.slug,
      	page: this.page 
      });
      this.loader = '';
    },
	
		async toggleReaction() {

	  	if (!this.$auth.loggedIn) {
		    return this.$router.push('/login')
		  }

	    let data = await this.$axios.$post(`/category/${this.$route.params.slug}/reaction`);
	    let reacted = data ? true : false;
	    this.$store.commit('category/REACTED_CATEGORY', reacted)
	    return;
	  },

	  search() {
	  	if (this.category_search) {
		  	this.$router.push({name: 'category-slug-query', params: {query: this.category_search}})
		  }
	  }
  },
}
</script>
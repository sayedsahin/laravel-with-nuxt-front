<template>
  <div class="tt-item">
    <div class="tt-single-topic">
      <div class="tt-item-header">
        <div class="tt-item-info info-top">
          <div class="tt-avatar-icon">
            <NuxtLink :to="{ name: 'user-id', params: {id: topic.user.id} }">
              <img :src="topic.user.avatar" alt="" class="w3-round-xxlarge" width="40px">
            </NuxtLink>
          </div>
          <div class="tt-avatar-title">
            <a href="#">{{ topic.user.name }}</a>
          </div>
          <a href="#" class="tt-info-time">
            <i class="tt-icon"><svg><use xlink:href="#icon-time"></use></svg></i>
            <Time :timestamp="topic.created_at" />
          </a>
        </div>
        <h3 class="tt-item-title">
          <a href="#">{{ topic.title }}</a>
          
        </h3>
        <div class="tt-item-tag">
          <ul class="tt-list-badge">
            <li><NuxtLink :to="{ name: 'category-slug', params: { slug: topic.category.slug }}"><span :class="`${topic.category.color} tt-badge`">{{ topic.category.name }}</span></NuxtLink></li>

            <li v-for="(tag, index) in topic.tags" :key="index"><NuxtLink :to="{ name: 'tags-name', params: { name: tag.name }}"><span class="tt-badge">{{ tag.name }}</span></NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="tt-item-description" v-html="topic.body"></div>
      <TopicReaction :reaction="topic.reaction" :reacted="topic.reacted" :id="topic.id"/>
      <div class="mt-2 f-right" v-if="authenticated && user.id === topic.user.id">
        <NuxtLink :to="{ name: 'topic-id-edit', params: { id: topic.id } }" class="tt-badge">Edit</NuxtLink>
        <button @click.prevent="deleteTopic(topic.id)" class="tt-badge"><svg v-if="spin" style="width: 11px;" class="w3-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M296 48c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm-40 376c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm248-168c0-22.091-17.909-40-40-40s-40 17.909-40 40 17.909 40 40 40 40-17.909 40-40zm-416 0c0-22.091-17.909-40-40-40S8 233.909 8 256s17.909 40 40 40 40-17.909 40-40zm20.922-187.078c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40c0-22.092-17.909-40-40-40zm294.156 294.156c-22.091 0-40 17.909-40 40s17.909 40 40 40c22.092 0 40-17.909 40-40s-17.908-40-40-40zm-294.156 0c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40z"/>&nbsp;</svg>Delete</button>
      </div>
    </div>
  </div>
</template>
<script>
export default{
	props: {
	  topic: {
	    type: Object,
	    required: true,
	  }
	},
  data () {
    return {
      spin:false,
      title: this.topic.title
    };
  },

	computed: {
    // tags () {
    //   let tag = this.topic.tags;
    //   return tag.split(',').map(item => item.trim());
    // }
    
  },

  methods: {
    async deleteTopic(id) {
      if (confirm('Do you really want to delete?')) {
        this.spin = true
        try{
          await this.$axios.$delete(`topic/${id}`)
          this.$router.back()
        }catch(e){
          return
        }
      }
    }
  },

}
</script>
<style lang="css">
 .f-right{float: right;}
 .f-left{float: left;}
 .heroicon{height: 1rem; width: 1rem; color: #666f74;}
</style>
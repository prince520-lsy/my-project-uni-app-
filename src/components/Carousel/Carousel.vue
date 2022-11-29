<template>
    <swiper
      class="carousel"
      :style="{ height: height }"
      autoplay
      indicator-dots
      circular
    >
      <swiper-item v-for="item in banners" :key="item.id">
        <image :src="item.imgUrl"></image>
      </swiper-item>
    </swiper>
  </template>
  
  <script>
  export default {
    props: ["banners", "height"],
  };
  </script>
  
  <style scoped>
  .carousel {
    height: 100%;
  }
  </style>
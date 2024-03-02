<script setup>
import { NAnchor, NAnchorLink } from "naive-ui";
import handleScroll from "../../hooks/handleScroll";
</script>

<template>
  <el-container>
    <el-scrollbar height="640px" noresize>
      <el-aside width="55rem">
        <h2>这是标题1</h2>
        <div
          style="width: 100%; height: 300px; background-color: pink"
          id="h2_1"
        >
          hhhhhhhhhhhhhhh
        </div>
        <h2>这是标题2</h2>
        <div
          style="width: 100%; height: 300px; background-color: pink"
          id="h2_2"
        >
          hhhhhhhhhhhhhhh
        </div>
        <h3>这是标题2子标题1</h3>
        <div
          style="width: 100%; height: 300px; background-color: pink"
          id="h3_1"
        >
          hhhhhhhhhhhhhhh
        </div>
        <h2>这是标题4</h2>
        <div
          style="width: 100%; height: 300px; background-color: pink"
          id="h2_3"
        >
          hhhhhhhhhhhhhhh
        </div>
        <h2>这是标题5</h2>
        <div
          style="width: 100%; height: 300px; background-color: pink"
          id="h2_4"
        >
          hhhhhhhhhhhhhhh
        </div>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <div style="width: 100%; height: 300px; background-color: pink" id="h2_6"> 
          hhhhhhhhhhhhhhh
        </div>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2 id="h2_5">这是标题6</h2>
        <h2>这是标题6</h2>
        <div
          style="width: 100%; height: 300px; background-color: pink"
          id="h2_7"
        >
          hhhhhhhhhhhhhhh
        </div>
        <h2 id="h2_10">这是标题10</h2>
      </el-aside>
    </el-scrollbar>
    <el-main>
      <n-anchor
        :show-rail="true"
        :show-background="false"
        :affix="true"
        position="fixed"
        :trigger-top="150"
      >
        <n-anchor-link
          title="标题一"
          href="#h2_1"
          style="font-size: 15px"
          @click.prevent="handleScroll('h2_1')"
        />
        <n-anchor-link
          title="标题二"
          href="#h2_2"
          @click.prevent="handleScroll('h2_2')"
          style="font-size: 15px"
        >
          <n-anchor-link
            title="标题二子标题一"
            href="#h3_1"
            @click.prevent="handleScroll('h3_1')"
            style="font-size: 15px"
          />
        </n-anchor-link>
        <n-anchor-link
          title="标题四"
          href="#h2_4"
          @click.prevent="handleScroll('h2_4')"
          style="font-size: 15px"
        />
        <n-anchor-link
          title="标题五"
          href="#h2_5"
          @click.prevent="handleScroll('h2_5')"
          style="font-size: 15px"
        />
        <n-anchor-link
          title="标题七"
          href="#h2_6"
          @click.prevent="handleScroll('h2_10')"
          style="font-size: 15px"
        />
      </n-anchor>
    </el-main>
  </el-container>
</template>

<style scoped>
</style>
<!-- switch开关-->
<template>
  <div>
    <!-- 方式一 -->
    <div
      class="switch-box"
      :style="{
        '--width': width_c + 'px',
        '--height': height_c + 'px',
        '--primary-color': activeColor
      }"
    >
      <input
        id="switchButton"
        type="checkbox"
        class="switch"
        v-model="switchValue"
        @change="change"
      />
      <label for="switchButton">
        <span class="close"></span>
        <span class="open"></span>
        <span
          class="inset-text inset-text--open"
          v-show="switchValue"
          ref="openRef"
        >
          <slot name="open"></slot>
        </span>
        <span
          class="inset-text inset-text--close"
          v-show="!switchValue"
          ref="closeRef"
        >
          <slot name="close"></slot>
        </span>
      </label>
    </div>
    <!-- 方式2 -->
    <div class="hr-switch"
      :style="{
        '--height': height + 'px',
        '--primary-color': activeColor
      }"
     v-if="false">
      <input
        id="switchBtn"
        type="checkbox"
        class="switch"
        v-model="switchValue"
        @change="change"
      />
      <label for="switchBtn" class="switch-label">
        <span class="scroll-ball"></span>
        <span class="text">
          <slot name="open" v-if="switchValue"></slot>
          <slot name="close" v-else></slot>
        </span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: [String, Number],
      default: 0
    },
    height: {
      type: [String, Number],
      default: 0
    },
    activeColor: {
      type: String,
      default: "#ff7e45"
    },
    value: {
      type: [String, Number, Boolean],
      default: null
    }
  },
  model: {
    prop: "value", // 绑定的值，通过父组件传递
    event: "update" // 自定义事件名
  },
  data() {
    return {
      switchValue: this.value,
      width_c: this.width,
      height_c: this.height
    };
  },
  mounted() {
    this.initStyle();
  },
  methods: {
    initStyle() {
      let with1 = this.$refs["openRef"].offsetWidth;
      let with2 = this.$refs["closeRef"].offsetWidth;
      this.height_c = this.height || 28;
      this.width_c =
        this.width || Math.max(with1, with2) + (this.height_c - 4) * 2;
    },
    change() {
      this.$emit("update", this.switchValue);
    }
  }
};
</script>

<style lang="scss" scoped>
/* CSS代码 */
.hr-switch {
  --height: 30px;
  --primary-color: #ff7e45;
  display: inline-block;
  height: var(--height);
  user-select: none;
  #switchBtn{
    display: none;
    &:checked~.switch-label{
      flex-direction: row-reverse;
      box-shadow: 0px 0px 0px 30px var(--primary-color) inset;
      .text{
        color: #fff;
      }
    }
  }
  .switch-label{
    width: 100%;
    height: 100%;
    display:flex;
    border-radius: 50px;
    box-shadow: 0px 0px 2px #aaa;
    position: relative;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    transition: all 0.5s;
    padding: 1px;
    background: #fee;
    cursor: pointer;
    .scroll-ball{
      width: calc(var(--height) - 2px);
      height: calc(var(--height) - 2px);
      background: #fff;
      border-radius: 100%;
      box-shadow: 0px 0px 5px #ccc;
      flex-shrink: 0;
    }
    .text{
      white-space: nowrap;
      display: inline-block;
      padding: 0 14px;
      font-size: 14px;
    }
  }
}
.switch-box {
  --width: 86px;
  --height: 28px;
  --primary-color: #ff7e45;
  display: inline-block;
  width: var(--width);
  font-size: 14px;
  overflow: hidden;
  user-select: none;
  .switch {
    /* 隐藏checkbox默认样式 */
    display: none;
    &:checked ~ label {
      .close {
        transform: translateX(
          calc(var(--width) / 2 - 2px - var(--close-with) / 2)
        );
      }
      .open {
        box-shadow: 0px 0px 0px var(--height) var(--primary-color) inset;
      }
    }
  }
  label {
    /* 通过label扩大点击热区 */
    --close-with: calc(var(--height) - 4px);
    position: relative;
    display: block;
    margin: 1px;
    height: var(--height);
    cursor: pointer;
    .close {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: calc(0px - var(--close-with) / 2);
      margin-left: calc(0px - var(--close-with) / 2);
      width: var(--close-with);
      height: var(--close-with);
      border-radius: 100%;
      background-color: #fff;
      box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      transform: translateX(
        calc(2px + var(--close-with) / 2 - var(--width) / 2)
      );
    }
    .open {
      display: block;
      border-radius: var(--height);
      height: var(--height);
      background-color: #dcdfe6;
      transition: all 0.5s ease;
    }
    .inset-text {
      position: absolute;
      white-space: nowrap;
      top: 16%;
      transition: all 0.3s ease;
      &--close {
        right: calc(var(--close-with) / 2);
        animation: closeAnimate 0.5s;
      }
      &--open {
        left: calc(var(--close-with) / 2);
        color: #fff;
        animation: openAnimate 0.5s;
      }
    }
    @keyframes closeAnimate {
      0% {
        transform: translateX(-18px);
      }
      100% {
        transform: translateX(0px);
      }
    }
    @keyframes openAnimate {
      0% {
        transform: translateX(18px);
      }
      100% {
        transform: translateX(0px);
      }
    }
  }
}
</style>


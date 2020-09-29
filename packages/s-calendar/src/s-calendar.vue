<!--
 * @Description: 简单平铺日记
 -->
<template>
  <div class='black-box hr-calendar'>
    <div class="hr-calendar-handler">
      <div class="hr-calendar-handler__left">
        <span class="handle-btn" @click="changeMonth(-1)"></span>
        <!-- <span @click="today">今天</span> -->
      </div>
      <div class="hr-calendar-handler__center" >
        {{year}} 年 {{month}} 月
      </div>
      <div class="hr-calendar-handler__right">
        <span class="handle-btn handle-btn--right" @click="changeMonth(1)"></span>
      </div>
    </div>
    <!-- 日期表格 -->
    <div class="hr-calendar-view">
      <div class="view-head">
        <div class="view-head__grid" v-for="(week, i) in weeks" :key="i" >{{week}}</div>
      </div>
      <div class="view-box">
        <div class="view-box__grid" v-for="(row, index) in days" :key="index" :class="{'no-current': row.type !== 'cur'}">
          <div class="grid-cell" @click='handlerClick(row)' >
            <span 
              class="grid-cell__day"
              :class="{'no-current': row.type !== 'cur', 'today': isNow(row), 'active': isActive(row)}"
            >{{row.day}}</span>
            <slot :row="row" :index="index"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SCalendar',
  data () {
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      days: [
        // {          
        //   year: '',  // 年
        //   month: '', // 月
        //   day: j,    // 日
        //   type: 'next'  // 类型 当月 上月 下月
        // }
      ],
      weeks: ['日', '一', '二', '三', '四', '五', '六' ],
      dataInfo: '',
      activeDate: ''
    }
  },
  created () {
    this.init()
  },
  computed:{
  },
  methods: {
    // 初始化 当月数据
    init () {
      let now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth() + 1
      this.pushDays()
      this.days.map(item => {
        if(this.isNow(item)){
          this.$emit('cellHandler', item)
        }
      })
    },
    // 得到当前年这个月份有多少天
    getDays (y, m) {
      return new Date(y, m, 0).getDate()
    },
    // 得到当前年，这个月的一号是周几
    getWeek (year, month) {
      let now = new Date()
      now.setFullYear(year)
      now.setMonth(month - 1)
      now.setDate(1)
      return now.getDay()
    },
    //将这个月多少天加入数组days
    pushDays () {
      this.days = []
      let year = this.year
      let month = this.month
      let days = this.getDays(year, month)
      let week = this.getWeek(year, month)
      // 一. 加入当月天数
      for (let i = 1; i <= days; i++) {
        let obj = {
          year: year,
          month: month,
          day: i,
          type: 'cur',
        }
        this.days.push(obj)
      }
      // 二. 将上个月要显示的天数加入days
      var lastMonthDays = this.getDays(year, month - 1)
      let preMonth = month - 1
      let preYear = year
      if (preMonth < 1) { // 当小于1月时 重置为12 年份减1
        preMonth = 12
        preYear = preYear - 1
      }
      // 以星期天开始 用week 以星期一开始用 week - 1
      for (let k = 0; k < week; k++) {
        let obj = {
          year: preYear,
          month: preMonth,
          day: lastMonthDays - k,
          type: 'last',
        }
        this.days.unshift(obj)
      }
      // 三. 将下个月要显示的天数加入days
      let len = this.days.length
      let nextMonth = month + 1
      let nextYear = year
      if (nextMonth > 12) { // 当大于12月时 重置为1 年份加1
        nextMonth = 1
        nextYear = preYear + 1
      }
      let n = len % 7 ? 7 - len % 7 : 0
      for (let j = 1; j <= n; j++) {
        let obj = {
          year: nextYear,
          month: nextMonth,
          day: j,
          type: 'next',
        }
        this.days.push(obj)
      }
    },
    // 日期点击事件
    handlerClick (item) {
      // 当点击区域为上个月或下个月的日期时
      this.$emit('cellHandler', item)
      if (item.type === 'last') {
        this.changeMonth(-1)
      } else if (item.type === 'next') {
        this.changeMonth(1)
      } else {
        this.changeMonth(0)
      }
      let {year, month, day} = item
      let date = `${year}-${month}-${day}`
      this.activeDate = date
    },
    // 切换月份
    changeMonth(step){
      this.month += step
      if (this.month > 12) {
        this.month = 1
        this.year += step
      }
      if (this.month < 1) {
        this.month = 12
        this.year += step
      }
      this.pushDays()
    },
    // 是否今天
    isNow (item) {
      let now = new Date()
      let {year, month, day} = item
      return (
        now.getFullYear() === year &&
        now.getMonth() + 1 === month &&
        now.getDate() === day
      )
    },
    // 是否聚焦
    isActive (item) {
      let {year, month, day} = item
      let date = `${year}-${month}-${day}`
      return this.activeDate === date
    },
    // 回到今天
    today () {
      this.activeDate = ''
      this.init()
    }
  }
}
</script>

<style lang='scss' scoped>
$active-color: #ff7e45;
$disable-color: hsl(22, 7%, 78%);
$line-color: hsl(60, 9%, 90%);
$light-color: #ffe5da;
$red: #FF4D4F;
$blue: #1890FF;
$bg-gray: #f8f8f8;
$ft-gray: #8c8c8c;
$disabled: #bfbfbf;
.hr-calendar{
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction: column;
  user-select: none;
  &-handler{
    height: 50px;
    width: 100%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-bottom: 12px;
    &__left{
      display:flex;
      align-items: center;
      span{
        margin-left: 10px;
      }
    }
    &__center{
      font-weight: 600;
      font-size: 16px;
    }
    &__right{
      span{
        margin-right: 10px;
      }
    }
    // 左右切换按钮
    .handle-btn{
      display: inline-block;
      width: 32px;
      height: 32px;
      border-radius: 100%;
      text-align: center;
      line-height: 32px;
      color: #fff;
      background:$bg-gray;
      overflow: hidden;
      position: relative;
      &:hover{
        background: #eee;
      }
      &::before{
        content:'';
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -4px;
        margin-top: -5px;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        border-left: 2px solid $ft-gray;
        border-bottom: 2px solid $ft-gray;
        transform-origin: center center;
        transform: rotate(45deg);
      }
      &--right{
        transform: rotate(180deg);
      }
    }
  }
  // 日期表格
  &-view{
    width: 100%;
    .view-head{
      display: flex;
      margin-bottom: 12px;
      &__grid{
        width: 14.2%;
        line-height: 30px;
        font-size: 16px;
        color: $disable-color;
        text-align: center;
      }
    }
    .view-box{
      display: flex;
      flex-wrap: wrap;
      &__grid{ // 格子
        position: relative;
        width: 14.2%;
        .grid-cell{
          height: 60px;
          cursor: pointer;
          text-align: center;
          transition:all .5s;
          display: flex;
          flex-direction: column;
          // justify-content: center;
          align-items: center;
          // 日期
          &__day{
            font-size: 18px;
            line-height: 32px;
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            text-align: center;
            &.today {
              background: $light-color;
            }
            &.active{
              background: $active-color;
              color: #fff;
            }
            &.no-current{
              color: $disable-color;
              opacity: 0.8;
              font-weight: 400;
            }
            &:hover{
              background: $active-color;
              color: #fff;
            }
          }
          // 标识
          &__mask{
            display: inline-block;
            &.danger{
              background: $red;
            }
            &.info{
              background: $blue;
            }
          }
          &__disabled{
            color: $disabled;
          }
          &__tip{
            position:absolute;
            top: 6px;
            right: 6px;
            color: $disable-color;
          }
        }
        &.no-current{
          opacity: 0.5;
        }
      }
    }
  }
}
</style>

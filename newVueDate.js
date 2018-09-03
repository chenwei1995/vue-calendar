var calendar = Vue.extend({
  template: '<div class="inputCalendar">'
  +'<div class="iconCalendar" :style="style">'
    +'<input type="text" readonly v-model="date" @click="calFlag = !calFlag"/>'
    +'<span :class="icon"></span>'
  +'</div>'
  +'<div class="calendar-container" v-if="calFlag">'
    +'<div class="operation-cal">'
      +'<div class="year-cal">'
        +'<div class="year-select" @click="yearCk">{{yearNum}}</div>'
        +'<ul class="year-set" v-if="yearFlag">'
          +'<li v-for="item in yearli" @click="changeYr(item)">{{item}}</li>'
        +'</ul>'
      +'</div>'
      +'<div class="month-cal">'
        +'<div class="month-select" @click="monthCk">{{monthNum}}</div>'
        +'<ul class="month-set" v-if="monthFlag">'
          +'<li v-for="item in month" @click="changeMn(item)">{{item}}</li>'
        +'</ul>'
      +'</div>'
      +'<div class="now-seted" @click="backDate">返回今天</div>'
    +'</div>'
    +'<div class="date-cal-container">'
      +'<ul class="date-week">'
        +'<li v-for="item in week">{{item}}</li>'
      +'</ul>'
      +'<ul class="date-day">'
        +'<li v-for="item in updateli"></li>'
        +'<li v-for="item in dateli" :class="{calActive:item==dateNum}" @click="setYmd(item)">{{item}}</li>'
      +'</ul>'
    +'</div>'
  +'</div>'
  +'</div>',
  props: {
    date: [String, Object],
    icon: [String],
    style: [Object]
  },
  data: function () {
    return {
      week: ['一', '二', '三', '四', '五', '六', '日'],
      month: ['01','02','03','04','05','06','07','08','09','10','11','12'],
      yearFlag: false,
      monthFlag: false,
      yearNum: this.date ? this.date.split('-')[0] : null || new Date().getFullYear(),
      monthNum: this.date ? this.date.split('-')[1] : null || toDou(new Date().getMonth()+1),
      dateNum: this.date ? this.date.split('-')[2] : null || new Date().getDate(),
      calFlag: false
    }
  },
  computed: {
    yearli () {
      var result = [];
      var nowYear = new Date().getFullYear();
      var nowYear = nowYear - 15;
      for (var i = 0; i < 100; i++) {
        nowYear++;
        result.push(nowYear)
      }
      return result;
    },
    dateli () {
      var result;
      var y, m; //y年份， m月份
      if (!this.yearNum) {
        y = new Date().getFullYear();
      }
      if (!this.monthNum) {
        m = new Date().getMonth();
      }
      if (this.yearNum) {
        y = this.yearNum;
      }
      if (this.monthNum) {
        m = Number(this.monthNum)-1;
      }
      result = mGetDate(y, m);
      return result
    },
    updateli () {
      var result;
      var y, m; //y年份， m月份
      if (!this.yearNum) {
        y = new Date().getFullYear();
      }
      if (!this.monthNum) {
        m = new Date().getMonth();
      }
      if (this.yearNum) {
        y = this.yearNum;
      }
      if (this.monthNum) {
        m = Number(this.monthNum)-1;
      }
      var date = getWeekDay(y, m);
      if (date==0) {date=7};
      result = date-1;
      return result
    }
  },
  watch: {

  },
  methods: {
    yearCk () {
      this.yearFlag = !this.yearFlag;
      this.monthFlag = false;
    },
    monthCk () {
      this.monthFlag = !this.monthFlag;
      this.yearFlag = false;
    },
    changeYr (val) {
      this.yearNum = val;
      this.yearFlag = false;
    },
    changeMn (val) {
      this.monthNum = val;
      this.monthFlag = false;
    },
    backDate () {
      this.yearNum = new Date().getFullYear();
      this.monthNum = toDou(new Date().getMonth()+1);
      this.dateNum = new Date().getDate()
    },
    setYmd (val) {
      this.dateNum = val;
      var newValue = this.yearNum +'-'+this.monthNum+'-'+toDou(this.dateNum)
      this.$emit('update:date', newValue)
      this.calFlag = false;
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.calFlag = false;
      }
    })
  }
})

Vue.component('web-calendar', calendar);

function toDou(n) {
  if (!n) return;
  return Number(n) < 10 ? '0' + n : '' + n;
}
//获得每月天数
function mGetDate(year, month) {
  var d = new Date(year, month+1, 0);
  return d.getDate();
}
//获取每月一号星期几
function getWeekDay(year, month) {
  var odatef = new Date();
  odatef.setFullYear(year,month,1);
  return odatef.getDay();
}

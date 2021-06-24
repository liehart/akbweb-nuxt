<template>
  <div>
    <div>
      <h1 class="text-4xl font-medium tracking-normal">
        {{ getGreetings }}, {{ $auth.user.user.name.split(' ')[0] }}!
      </h1>
      <p>Selamat datang di Dashboard pengelolaan Restoran Atma Korean BBQ</p>
    </div>
    <div v-if="loading">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
    <div v-else>
      <div class="mt-5 grid grid-cols-4 gap-6">
        <div class="p-5 col-span-1 bg-white rounded-md shadow">
          <h2>Reservasi Hari Ini</h2>
          <div class="flex justify-center items-center gap-4">
            <div>
              <p class="font-bold text-5xl text-gray-700">
                {{ statistics.reservation.today }}
              </p>
            </div>
            <div v-if="statistics.reservation.diff > 0" class="flex text-green-500">
              {{ statistics.reservation.diff }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 my-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <div v-else-if="statistics.reservation.diff < 0" class="flex text-red-500">
              {{ statistics.reservation.diff }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 my-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div class="p-5 col-span-1 bg-white rounded-md shadow">
          <h2>Reservasi Hari Ini</h2>
          <div class="flex justify-center items-center gap-4">
            <div>
              <p class="font-bold text-5xl text-gray-700">
                {{ statistics.reservation.today }}
              </p>
            </div>
            <div v-if="statistics.reservation.diff > 0" class="flex text-green-500">
              {{ statistics.reservation.diff }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 my-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <div v-else-if="statistics.reservation.diff < 0" class="flex text-red-500">
              {{ statistics.reservation.diff }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 my-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div class="p-5 col-span-1 bg-white rounded-md shadow">
          <h2>Menu Terlaris Bulan Ini</h2>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: true,
      loadingAPI: true,
      statistics: []
    }
  },
  async fetch () {
    await this.$axios.$get('statistic').then((res) => {
      this.loading = false
      this.loadingAPI = false
      this.statistics = res.data
    })
  },
  head () {
    return {
      title: 'Dashboard | Atma Korean BBQ'
    }
  },
  computed: {
    getGreetings () {
      const d = new Date().getHours()
      if (d <= 10) {
        return 'Selamat Pagi'
      }
      if (d <= 18) {
        return 'Selamat Sore'
      }
      if (d <= 24) {
        return 'Selamat Malam'
      }
      return 'Selamat Datang'
    }
  }
}
</script>

<style>
.spinner {
  margin: 100px auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #333;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
}
</style>

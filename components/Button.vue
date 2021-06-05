<template>
  <button class="button" :class="getVariant" :disabled="disabled" @click="$emit('click')">
    <div v-if="icon && !loading">
      <slot name="icon" />
    </div>
    <div v-if="!loading && label.length > 0">
      {{ label }}
    </div>
    <div v-if="loading">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    label: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getVariant () {
      if (this.disabled) {
        return 'disabled'
      } else {
        return this.variant
      }
    }
  }
}
</script>

<style scoped>
.disabled {
  @apply text-sm font-medium text-white bg-blue-600 cursor-default bg-opacity-50
}
.button {
  @apply transition duration-300 h-full inline-flex items-center px-4 py-2
  rounded-md focus:outline-none gap-2 whitespace-nowrap justify-center flex
}
.primary {
  @apply text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
  focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-blue-50
}
.secondary {
  @apply text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200
}
.spinner {
  width: 20px;
  height: 20px;

  position: relative;
  margin: auto 20px;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% {
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
    }
}
</style>

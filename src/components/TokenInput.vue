<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="8" class="pa-4">
          <v-form @submit.prevent="handleSubmit">
            <v-card-text>
              <v-text-field
                v-model="tokenInput"
                label="Tuleap API Token"
                type="password"
                placeholder="Enter your Tuleap API token"
                required
                prepend-icon="mdi-key"
                variant="outlined"
                :error-messages="error"
              />
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                type="submit" 
                :loading="loading"
                :disabled="loading"
                color="primary"
                variant="elevated"
                size="large"
              >
                <v-icon start>mdi-login</v-icon>
                {{ loading ? 'Validating...' : 'Save Token' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const { setToken } = useAuth()
const router = useRouter()

const tokenInput = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!tokenInput.value.trim()) {
    error.value = 'Token is required'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Mock authentication - accept any non-empty string as valid token
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call delay
    
    if (tokenInput.value.trim().length > 0) {
      setToken(tokenInput.value)
      router.push('/')
    } else {
      error.value = 'Token cannot be empty'
    }
  } catch (err: any) {
    error.value = 'Failed to validate token. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>


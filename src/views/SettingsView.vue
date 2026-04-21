<template>
  <div class="antialiased flex h-screen overflow-hidden bg-surface-container-low text-on-surface">
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen min-w-0">
      <TopNav :user="user" />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-surface rounded-tl-[32px] p-8 md:p-12 lg:p-16 shadow-[-8px_-8px_32px_rgba(27,28,24,0.02)]">
        <div class="max-w-4xl mx-auto space-y-16">
          <div>
            <h2 class="text-4xl font-headline font-medium text-on-surface mb-2">User Settings</h2>
            <p class="text-secondary font-body">Manage your profile, security, and preferences.</p>
          </div>
          
          <!-- 1. Profile Header -->
          <section class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_48px_rgba(27,28,24,0.04)]">
            <h3 class="text-2xl font-headline font-medium text-on-surface mb-8">Profile Details</h3>
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div class="relative group cursor-pointer shrink-0">
                <img :src="user.avatar" alt="Profile Preview" class="w-32 h-32 rounded-full object-cover shadow-[0_8px_32px_rgba(27,28,24,0.08)]" />
                <div class="absolute inset-0 bg-on-surface/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <span class="material-symbols-outlined text-surface-container-lowest">photo_camera</span>
                </div>
              </div>
              <div class="flex-1 space-y-6 w-full">
                <p class="text-sm text-secondary font-body">Upload a new avatar. Larger images will be resized automatically. Maximum upload size is 2 MB.</p>
                <button class="bg-surface-container-highest text-on-surface font-label font-medium px-6 py-3 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer">
                  Upload New Photo
                </button>
              </div>
            </div>
          </section>
          
          <!-- 2. Account Information -->
          <section class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_48px_rgba(27,28,24,0.04)]">
            <h3 class="text-2xl font-headline font-medium text-on-surface mb-8">Account Information</h3>
            <form class="space-y-6" @submit.prevent="saveProfile">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-label font-medium text-on-surface-variant" for="fullName">Full Name</label>
                  <input v-model="user.name" class="w-full bg-surface-container border-transparent focus:border-outline-variant focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-0" id="fullName" type="text" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-label font-medium text-on-surface-variant" for="emailAddress">Email Address</label>
                  <input v-model="user.email" class="w-full bg-surface-container border-transparent focus:border-outline-variant focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-0" id="emailAddress" type="email" />
                </div>
              </div>
              <div class="pt-4 flex justify-end">
                <button class="bg-primary text-on-primary font-label font-medium px-8 py-3 rounded-full hover:bg-surface-tint shadow-[0_4px_16px_rgba(154,64,33,0.2)] transition-all hover:shadow-[0_8px_24px_rgba(154,64,33,0.3)] cursor-pointer" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </section>
          
          <!-- 3. Security -->
          <section class="bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_48px_rgba(27,28,24,0.04)]">
            <div class="flex items-center gap-3 mb-8">
              <span class="material-symbols-outlined text-primary">lock</span>
              <h3 class="text-2xl font-headline font-medium text-on-surface">Security</h3>
            </div>
            <form class="space-y-6 max-w-lg" @submit.prevent="updatePassword">
              <div class="space-y-2">
                <label class="block text-sm font-label font-medium text-on-surface-variant" for="currentPassword">Current Password</label>
                <input v-model="passwords.current" class="w-full bg-surface-container border-transparent focus:border-outline-variant focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-0" id="currentPassword" type="password" />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-label font-medium text-on-surface-variant" for="newPassword">New Password</label>
                <input v-model="passwords.new" class="w-full bg-surface-container border-transparent focus:border-outline-variant focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-0" id="newPassword" type="password" />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-label font-medium text-on-surface-variant" for="confirmPassword">Confirm New Password</label>
                <input v-model="passwords.confirm" class="w-full bg-surface-container border-transparent focus:border-outline-variant focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-0" id="confirmPassword" type="password" />
              </div>
              <div class="pt-4">
                <button class="bg-surface-container-highest text-on-surface font-label font-medium px-8 py-3 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer" type="submit">
                  Update Password
                </button>
              </div>
            </form>
          </section>
          
          <!-- 4. Danger Zone -->
          <section class="bg-error-container/30 rounded-lg p-8 shadow-[0_8px_48px_rgba(186,26,26,0.02)]">
            <h3 class="text-2xl font-headline font-medium text-error mb-4">Danger Zone</h3>
            <p class="text-on-surface-variant font-body mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button class="bg-error text-on-error font-label font-medium px-6 py-3 rounded-full hover:bg-error/90 transition-colors cursor-pointer" type="button" @click="deleteAccount">
              Delete Account
            </button>
          </section>
        </div>
        
        <div class="h-12"></div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';

const user = ref({
  name: 'Alex R.',
  email: 'alex.r@saku.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-SmdQuPjxurPGiziBZ_OAuu8FsccYWqCEv1mhjkkODFl9iwFmC7zrYJziLaEp1N64yAdIEa3JPbRImJPSbLcB-s3c6Z7dcBx0nnRItuIag82xFsFa8OlsiwB-Ggc7Sl9fhBBA4oq6WG2Mem3Asf-AyIfExECopk5uHw6f34vmkLvZ0FLW7PSXqFxc8TIQl1Qu87PWI469p-bpwrJ9xsNJ1JUczu8Hed64If1hFOteIQ6HindX83GlzriVsZsykSUZdGAa3D3qP8I'
});

const passwords = ref({
  current: '',
  new: '',
  confirm: ''
});

const saveProfile = () => {
  console.log('Saving profile', user.value);
};

const updatePassword = () => {
  console.log('Updating password', passwords.value);
};

const deleteAccount = () => {
  if (confirm('Are you absolutely sure you want to delete your account?')) {
    console.log('Deleting account...');
  }
};
</script>

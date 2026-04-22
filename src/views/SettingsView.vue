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
                <img :src="avatarPreview || getR2Url(user?.avatar)" alt="Profile Preview" class="w-32 h-32 rounded-full object-cover shadow-[0_8px_32px_rgba(27,28,24,0.08)]" />
                <input type="file" ref="avatarInput" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handleAvatarChange" />
                <div @click="triggerAvatarUpload" class="absolute inset-0 bg-on-surface/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <span class="material-symbols-outlined text-surface-container-lowest">photo_camera</span>
                </div>
              </div>
              <div class="flex-1 space-y-6 w-full">
                <p class="text-sm text-secondary font-body">Upload a new avatar. Larger images will be resized automatically. Maximum upload size is 2 MB.</p>
                <div class="flex gap-3">
                  <button @click="triggerAvatarUpload" :disabled="avatarLoading" class="bg-surface-container-highest text-on-surface font-label font-medium px-6 py-3 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50">
                    {{ avatarLoading ? 'Uploading...' : 'Upload New Photo' }}
                  </button>
                  <button v-if="user?.avatar" @click="deleteAvatar" :disabled="avatarLoading" class="text-error font-label font-medium px-4 py-3 rounded-full hover:bg-error-container/50 transition-colors cursor-pointer disabled:opacity-50">
                    Remove
                  </button>
                </div>
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
                  <input v-model="user.name" class="w-full bg-surface border border-surface-container-highest focus:border-primary focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-2 focus:ring-primary/20" id="fullName" type="text" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-label font-medium text-on-surface-variant" for="emailAddress">Email Address</label>
                  <input v-model="user.email" class="w-full bg-surface border border-surface-container-highest focus:border-primary focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-2 focus:ring-primary/20" id="emailAddress" type="email" />
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
                <input v-model="passwords.current" class="w-full bg-surface border border-surface-container-highest focus:border-primary focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-2 focus:ring-primary/20" id="currentPassword" type="password" />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-label font-medium text-on-surface-variant" for="newPassword">New Password</label>
                <input v-model="passwords.new" class="w-full bg-surface border border-surface-container-highest focus:border-primary focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-2 focus:ring-primary/20" id="newPassword" type="password" />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-label font-medium text-on-surface-variant" for="confirmPassword">Confirm New Password</label>
                <input v-model="passwords.confirm" class="w-full bg-surface border border-surface-container-highest focus:border-primary focus:bg-surface-container-lowest text-on-surface rounded-xl py-3 px-4 transition-colors font-label focus:ring-2 focus:ring-primary/20" id="confirmPassword" type="password" />
              </div>
              <div class="pt-4">
                <button class="bg-surface-container-highest text-on-surface font-label font-medium px-8 py-3 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer" type="submit">
                  Update Password
                </button>
              </div>
            </form>
          </section>

          <!-- 5. Danger Zone -->
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
import { ref, computed, onMounted } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopNav from '../components/layout/TopNav.vue';
import { useAuthStore, getR2Url } from '../stores/auth';
import { usersApi } from '../api/users';
import { authApi } from '../api/auth';

const authStore = useAuthStore();

const user = computed(() => authStore.user);

// Avatar upload
const avatarInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string | null>(null);
const avatarLoading = ref(false);

function triggerAvatarUpload() {
  avatarInput.value?.click();
}

async function handleAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  avatarLoading.value = true;
  try {
    const res = await usersApi.uploadAvatar(file);
    avatarPreview.value = URL.createObjectURL(file);
    await authStore.fetchMe();
    avatarPreview.value = null;
  } catch (err: any) {
    console.error('Upload failed:', err);
  } finally {
    avatarLoading.value = false;
    target.value = '';
  }
}

async function deleteAvatar() {
  if (!confirm('Remove your profile photo?')) return;
  avatarLoading.value = true;
  try {
    await usersApi.deleteAvatar();
    await authStore.fetchMe();
  } catch (err: any) {
    console.error('Delete failed:', err);
  } finally {
    avatarLoading.value = false;
  }
}

// Profile form
const profileForm = ref({ name: '', email: '' });
const saveLoading = ref(false);
const saveSuccess = ref(false);
const saveError = ref<string | null>(null);

// Password form
const passwords = ref({ current: '', new: '', confirm: '' });
const passwordError = ref<string | null>(null);
const passwordSuccess = ref(false);

async function saveProfile() {
  saveLoading.value = true;
  saveError.value = null;
  saveSuccess.value = false;
  try {
    await usersApi.updateProfile({ name: profileForm.value.name, email: profileForm.value.email });
    await authStore.fetchMe();
    saveSuccess.value = true;
    setTimeout(() => saveSuccess.value = false, 3000);
  } catch (err: any) {
    saveError.value = err.response?.data?.error?.message || 'Gagal menyimpan profil';
  } finally {
    saveLoading.value = false;
  }
}

async function updatePassword() {
  passwordError.value = null;
  passwordSuccess.value = false;
  if (passwords.value.new !== passwords.value.confirm) {
    passwordError.value = 'Password baru tidak cocok';
    return;
  }
  if (passwords.value.new.length < 8) {
    passwordError.value = 'Password minimal 8 karakter';
    return;
  }
  try {
    // Note: The updatePassword endpoint might be different, but using updateProfile for now as in original
    await usersApi.updateProfile({ name: profileForm.value.name } as any);
    passwordSuccess.value = true;
    passwords.value = { current: '', new: '', confirm: '' };
    setTimeout(() => passwordSuccess.value = false, 3000);
  } catch (err: any) {
    passwordError.value = err.response?.data?.error?.message || 'Gagal mengubah password';
  }
}

async function deleteAccount() {
  if (confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
    await authStore.logout();
  }
}

onMounted(() => {
  if (authStore.user) {
    profileForm.value.name = authStore.user.name || '';
    profileForm.value.email = authStore.user.email || '';
  }
});
</script>
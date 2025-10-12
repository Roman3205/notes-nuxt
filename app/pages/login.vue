<template>
  <div class="h-screen flex dark:bg-zinc-900 bg-zinc-50">
    <div class="dark:bg-black bg-zinc-100 w-[516px] p-8 px-10 flex flex-col justify-center">
        <Logo />
        <div class="flex flex-col flex-1 justify-center">
            <h1 class="dark:text-white text-lg font-bold">
                Log in to your account
            </h1>
            <p class="dark:text-white text-sm">
                Don`t have an account?  
                <NuxtLink to="/register" class="text-yellow-500 font-bold underline">Sign Up</NuxtLink>
                for one
            </p>
            <UForm :schema="schema" :state="state" @submit="onSubmit" class="mt-8 flex-col flex gap-6">
                <UFormField label="Email Address" name="email" :ui="{label: 'dark:text-white'}">
                    <UInput v-model="state.email" type="email" placeholder="you@example.com" :ui="{base: 'dark:text-white dark:bg-zinc-700'}" class="w-full"/>
                </UFormField>
                <UFormField label="Password" name="password" :ui="{label: 'dark:text-white'}">
                    <UInput v-model="state.password" type="password" placeholder="**********" :ui="{base: 'dark:text-white dark:bg-zinc-700'}" class="w-full"/>
                </UFormField>
                <UButton :loading="blockButton" :disabled="blockButton" type="submit" trailing-icon="i-lucide-arrow-right" class="cursor-pointer rounded-lg w-full bg-amber-400 hover:bg-amber-600 active:bg-amber-600 text-black flex justify-center mt-4" size="xl">Log In</UButton>
            </UForm>
        </div>
        <UColorModeButton class="duration-500 transition w-fit hover:opacity-85" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import userSchema from '~~/schemas/userSchema'

definePageMeta({
    middleware: 'already-auth'
})

const state = reactive<{
    email: string;
    password: string
}>({
    email: '',
    password: ''
})

const schema = userSchema
const blockButton = ref<boolean>(false)
const toast = useToast()
const onSubmit = async (event: FormSubmitEvent<z.output<typeof schema>>) => {
    try {
        blockButton.value = true
        await $fetch('/api/login', {
            method: 'POST',
            body: event.data,
        })
        toast.add({ title: 'Success', description: 'You have been logged into your account', color: 'success' })
        return navigateTo('/')
    } catch (error: any) {

        return toast.add({ title: 'Error', description: error.response?._data?.message, color: 'error'})
    } finally {
        blockButton.value = false
    }
}
</script>

<style>

</style>
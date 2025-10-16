<template>
  <div class="h-screen   dark:bg-zinc-900 bg-zinc-50 flex ">
    <div class="dark:bg-black bg-zinc-100 w-[360px] py-8 px-7 flex flex-col overflow-scroll">
        <div class="flex justify-between items-center">
            <Logo />
            <UColorModeButton class="duration-500  transition w-fit mt-1 hover:opacity-85 cursor-pointer" />
        </div>
        <div>
            <p class="text-xs font-bold dark:text-[#C2C5C5] text-gray-500 mt-12">Today</p>
            <p class="p-2 mt-4 dark:text-[#F4F4F5]" v-if="todaysNotes?.length === 0">No notes</p>
            <div class="p-2 mt-4 flex flex-col">
                <div v-for="note in todaysNotes" :key="note.id" class="rounded-lg mt-2 p-3 cursor-pointer duration-300 transition hover:opacity-80" :class="{
                    'bg-[#ae923f] text-white': note.id === selectedNote?.id
                }" @click="selectNote(note)">
                    <h3 class="text-sm font-bold dark:text-[#F4F4F5] truncate">
                        {{ note.text.substring(0,50) }}
                    </h3>
                    <div class="leading-16 flex gap-2">
                        <span class="text-xs w-1/2 dark:text-[#F4F4F5] truncate">{{ getDate(note.updatedAt) }}</span>
                        <span class="text-xs dark:text-[#C2C5C5] truncate" v-if="note.text.length > 50" :class="{
                            'text-[#F4F4F5]': note.id === selectedNote?.id
                        }">{{ note.text.substring(50,100) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <p class="text-xs font-bold dark:text-[#C2C5C5] text-gray-500  mt-12">Yesterday</p>
            <p class="p-2 mt-4 dark:text-[#F4F4F5]" v-if="yesterdaysNotes?.length === 0">No notes</p>
            <div class="p-2 mt-4 flex flex-col">
                <div v-for="note in yesterdaysNotes" :key="note.id" class="rounded-lg mt-2 p-3 cursor-pointer duration-300 transition hover:opacity-80" :class="{
                    'bg-[#ae923f] text-white': note.id === selectedNote?.id
                }" @click="selectNote(note)">
                    <h3 class="text-sm font-bold dark:text-[#F4F4F5] truncate" >
                        {{ note.text.substring(0,50) }}
                    </h3>
                    <div class="leading-16 flex gap-2">
                        <span class="text-xs w-1/2 dark:text-[#F4F4F5] truncate">{{ getDate(note.updatedAt) }}</span>
                        <span class="text-xs dark:text-[#C2C5C5] truncate" v-if="note.text.length > 50" :class="{
                            'text-[#F4F4F5]': note.id === selectedNote?.id
                        }">{{ note.text.substring(50,100) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <p class="text-xs font-bold dark:text-[#C2C5C5] text-gray-500  mt-12">Prev 30 Days</p>
            <p class="p-2 mt-4 dark:text-[#F4F4F5]" v-if="earlierNotes?.length === 0">No notes</p>
            <div class="p-2 mt-4 flex flex-col">
                <div v-for="note in earlierNotes" :key="note.id" class="rounded-lg mt-2 p-3 cursor-pointer duration-300 transition hover:opacity-80" :class="{
                    'bg-[#ae923f] text-white': note.id === selectedNote?.id
                }" @click="selectNote(note)">
                    <h3 class="text-sm font-bold dark:text-[#F4F4F5] truncate">
                        {{ note.text.substring(0,50) }}
                    </h3>
                    <div class="leading-16 flex gap-2">
                        <span class="text-xs w-1/2 dark:text-[#F4F4F5] truncate">{{ getDate(note.updatedAt) }}</span>
                        <span class="text-xs dark:text-[#C2C5C5] truncate" v-if="note.text.length > 50" :class="{
                            'text-[#F4F4F5]': note.id === selectedNote?.id
                        }">{{ note.text.substring(50,100) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
   <div class="flex flex-col w-full p-9 overflow-y-auto">
        <div class="flex justify-between w-full items-center">
            <UButton @click="createNewNote" leading-icon="i-lucide-notebook-pen" class="dark:text-[#c2c2c5] text-gray-700 font-bold bg-transparent active:bg-transparent hover:bg-transparent cursor-pointer transition duration-300 hover:opacity-85">Create Note</UButton>
            <UIcon v-if="selectedNote" @click="deleteNote" name="i-lucide-trash-2" class="dark:text-[#c2c2c5] cursor-pointer transition duration-300 hover:opacity-85" />
        </div>
        <div class="max-w-[530px] mx-auto  flex-1 w-full mt-5">
            <p v-if="selectedNote" class="dark:text-[#929292] font-semibold">{{ getPublishedDate(selectedNote.updatedAt) }}</p>
            <UTextarea :disabled="!selectedNote" ref="textareaRef" v-model="updatedNote" name="note" id="note" :autoresize="true" variant="soft" :ui="{base: 'focus:bg-transparent text-justify w-full text-md p-0 hover:bg-transparent bg-transparent'}" class="dark:text-[#d4d4d4] font-sans my-4 mb-20 w-full focus:outline-none bg-transparent" @input="inputText" />
        </div>
        <UButton @click="logout" class="duration-500 transition w-fit text-xs hover:opacity-80 cursor-pointer self-end bg-amber-600 text-white active:bg-amber-600 hover:bg-amber-600" trailing-icon="i-lucide-log-out">Log out</UButton>
   </div>
  </div>
</template>

<script lang="ts" setup>

import type { Note } from '@prisma/client'
import { useDebounceFn } from '@vueuse/core'
definePageMeta({
    middleware: 'auth'
})

const {data: notes, error} = await useFetch<Note[]| []>('/api/notes', {deep: true})
const toast = useToast()
const selectedNote = ref<Note | undefined>(undefined)
const updatedNote = ref<string>('')
const textareaRef = ref(null)
const blockSelect = ref<boolean>(false)

if (!notes.value) {
    toast.add({ title: 'Error', description: error.value?.message, color: 'error'})
}

const logout = async () => {
    const cookie = useCookie('app')
    cookie.value = null
    toast.add({ title: 'Success', description: 'You have successfully logged out', color: 'success'})
    return navigateTo('/login')
}

const getDate = (date: Date) => {
    return new Date(date).toDateString() === new Date().toDateString() ? 'Today' : new Date(date).toLocaleDateString()
}

const selectNote = (note: Note) => {
    if(!blockSelect.value) {
        selectedNote.value = note
        updatedNote.value = selectedNote.value.text
        textareaRef.value.textareaRef.focus()
    }
}

const createNewNote = async () => {
    try {
        if (blockSelect.value) {
            return
        }
        
        const res = await $fetch<Note>(`/api/notes`, {
            method: 'POST'
        })

        notes.value.unshift(res)
        selectedNote.value = notes.value[0]
        updatedNote.value = ''
        textareaRef.value.textareaRef.focus()

        toast.add({ title: 'Success', description: 'New note has been created', color: 'success'})
        blockSelect.value = false
    } catch (error: any) {
        toast.add({ title: 'Error', description: error.response?._data.message, color: 'error'})
        blockSelect.value = false
    }
}

const inputText = () => {
    if (!selectedNote.value || !notes.value) {
        return
    }
    blockSelect.value = true
    debouncedFn()
    selectedNote.value.text = updatedNote.value
}

const debouncedFn = useDebounceFn(async () => {
    await updateNote()
}, 2000)

const updateNote = async () => {
    try {
        if (!selectedNote.value || !notes.value) {
            return
        }
        await $fetch(`/api/notes/${selectedNote.value.id}`, {
            method: 'patch',
            body: {
                updatedNote: updatedNote.value
            }
        })
        const ind = notes.value.findIndex((note) => note.id === selectedNote.value.id)
        selectedNote.value.updatedAt = new Date()
        notes.value[ind].updatedAt = new Date()
        notes.value[ind].text = updatedNote.value
        notes.value = notes.value.sort((a:Note,b:Note) => new Date(b.updatedAt) - new Date(a.updatedAt))
        blockSelect.value = false
    } catch (error: any) {
        toast.add({ title: 'Error', description: error.response?._data.message, color: 'error'})
        blockSelect.value = false
    }
}

const deleteNote = async () => {
    try {
        if (!selectedNote.value || !notes.value || blockSelect.value) {
            return
        }
        await $fetch(`/api/notes/${selectedNote.value.id}`, {
            method: 'delete'
        })
        const ind = notes.value?.findIndex((note) => note.id === selectedNote.value.id)
        notes.value.splice(ind, 1)
        if (notes.value.length > 0) {
            selectNote(notes.value[0])
        } else {
            updatedNote.value = ''
            selectedNote.value = undefined
        }
        toast.add({ title: 'Success', description: 'The notes was deleted', color: 'success'})
        blockSelect.value = false
    } catch (error: any) {
        toast.add({ title: 'Error', description: error.response?._data.message, color: 'error'})
        blockSelect.value = false
    }
}

const todaysNotes = computed(() => {
    return notes.value?.filter((note: Note) => {
    const noteDate = new Date(note.updatedAt)
    return noteDate.toDateString() === new Date().toDateString()
}).sort((a:Note,b:Note) => new Date(b.updatedAt) - new Date(a.updatedAt))
})

const yesterdaysNotes = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate()-1)
    return notes.value?.filter((note: Note) => {
    const noteDate = new Date(note.updatedAt)
    return noteDate.toDateString() === yesterday.toDateString()
}).sort((a:Note,b:Note) => new Date(b.updatedAt) - new Date(a.updatedAt))
})

const earlierNotes = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate()-1)
    return notes.value?.filter((note: Note) => {
    const noteDate = new Date(note.updatedAt)
    return noteDate.toDateString() !== yesterday.toDateString() && noteDate < yesterday
}).sort((a:Note,b:Note) => new Date(b.updatedAt) - new Date(a.updatedAt))
})

const getPublishedDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
}

if (notes.value && notes.value.length > 0) {
    selectedNote.value = notes.value.sort((a:Note,b:Note) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
    updatedNote.value = selectedNote.value?.text as string
} else {
    createNewNote()
}

onMounted( async () => {
    textareaRef.value.textareaRef.focus()
})

</script>

<style>

</style>
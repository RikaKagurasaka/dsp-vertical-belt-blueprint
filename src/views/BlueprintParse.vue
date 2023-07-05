<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {fromStr, toStr} from "../blueprint/parser.ts";
import ItemIcon from "../components/ItemIcon.vue";
import {itemsMap} from "../data";
import {itemIconId, recipeIconId} from "../data/icons.ts";
import {VAceEditor} from "vue3-ace-editor/index";

const blueprintStr = ref("")
const parsed = computed(() => {
    try {
        return fromStr(blueprintStr.value)
    } catch {
        return null
    }
})

const selectedBuildingIndex = ref(-1)
const findBuilding = (value: number) => parsed.value?.buildings!.find((v) => v.index === value)
const selected = computed(() => findBuilding(selectedBuildingIndex.value))
const editingJson = ref('')

watch(selectedBuildingIndex, () => {
    //@ts-ignore
    editingJson.value = JSON.stringify(selected.value, undefined, 4)
})

watch(blueprintStr, () => {
    if (!parsed || !selected) {
        selectedBuildingIndex.value = -1
        editingJson.value = ''
    }
})

const isCodeEditing = ref(false)
// language=javascript
const code = ref(`export default function (buildings) {
    for (let b of buildings) {
        if (2001 <= b.itemId && b.itemId <= 2003) {
            let {x, y, z} = b.localOffset[0]
            z += 1
            b.localOffset[0] = {x, y, z}
            b.localOffset[1] = {x, y, z}
        }
    }
    return buildings
}
`)
const transformedBlueprint = ref('')
watch([blueprintStr, parsed, code, isCodeEditing], async () => {
    try {
        const url = URL.createObjectURL(new Blob([code.value], {type: "text/javascript"}))
        const func = await import(url).then(v => v.default)
        URL.revokeObjectURL(url)
        let buildings = JSON.parse(JSON.stringify(parsed.value!.buildings))
        buildings = func(buildings) || []
        transformedBlueprint.value = toStr({
            ...parsed.value!,
            buildings
        })
    } catch (e) {
        transformedBlueprint.value = e as any
    }
})

function submitEdition() {
    let bp = parsed.value!
    bp.buildings[selectedBuildingIndex.value] = JSON.parse(editingJson.value)
    blueprintStr.value = toStr(bp)
}

function clone() {
    let bp = parsed.value!
    let b = JSON.parse(JSON.stringify(selected.value))
    b.index = bp.buildings.reduce((p, c) => Math.max(p, c.index), 0) + 1
    bp.buildings.push(b)
    blueprintStr.value = toStr(bp)
}

function remove() {
    let bp = parsed.value!
    bp.buildings = bp.buildings.filter(w => w.index != selectedBuildingIndex.value)

    for (let i = 0; i < bp.buildings.length; i++) {
        if (bp.buildings[i].inputObjIdx === selectedBuildingIndex.value)
            bp.buildings[i].inputObjIdx = -1
        if (bp.buildings[i].outputObjIdx === selectedBuildingIndex.value)
            bp.buildings[i].outputObjIdx = -1
        if (bp.buildings[i].inputObjIdx > selectedBuildingIndex.value)
            bp.buildings[i].inputObjIdx--
        if (bp.buildings[i].outputObjIdx > selectedBuildingIndex.value)
            bp.buildings[i].outputObjIdx--
        if (bp.buildings[i].index > selectedBuildingIndex.value)
            bp.buildings[i].index--

    }
    blueprintStr.value = toStr(bp)
}
</script>

<template>
    <div class="grid grid-cols-3 p-4 gap-4" style="grid-template-rows: 40vh 50vh">
        <fieldset>
            <legend>戴森球蓝图分析工具</legend>
            <textarea name="blueprint" class="w-full h-32 my-1" v-model="blueprintStr"
                      placeholder="在这里粘贴蓝图"></textarea>
            <textarea name="blueprint" class="w-full h-32 my-1" :value="parsed?JSON.stringify(parsed):''"
                      placeholder="这里是输出的JSON"
                      readonly></textarea>
        </fieldset>
        <template v-if="parsed">
            <fieldset style="grid-column: 1/2;grid-row: 2/3;" class="overflow-y-auto">
                <legend>建筑列表（共{{ parsed.buildings.length }}个）</legend>
                <input type="checkbox" v-model="isCodeEditing"><label class="mx-1">批量编辑</label>
                <div class="grid h-fit" style="grid-template-columns: repeat(auto-fill,3.25rem)">
                    <div v-for="b in parsed.buildings" class="w-12 h-12 m-1 hover:bg-gray-500 cursor-pointer"
                         :class="{'bg-gray-700':selectedBuildingIndex==b.index}"
                         @click="selectedBuildingIndex=b.index"
                    >
                        <ItemIcon :icon-id="itemIconId(b.itemId)"/>
                    </div>
                </div>
            </fieldset>
            <template v-if="selected ">
                <fieldset style="grid-column: 2/3;" :style="{
                    gridRow: isCodeEditing?'2/3':'1/3'
                }" class="overflow-y-auto">
                    <legend>{{ itemsMap.get(selected.itemId)?.name }}
                        <ItemIcon class="w-8 h-8 inline ml-2" :icon-id="itemIconId(selected.itemId)"/>
                        @ {{ selected.index }}
                    </legend>
                    <div class="w-full flex flex-col h-full" style="font-family: Consolas">
                        <div>
                            <label>index: </label>
                            <span>{{ selected.index }}</span>
                        </div>
                        <div>
                            <label>itemId: </label>
                            <span>{{ selected.itemId }}</span>
                            <ItemIcon class="w-8 h-8 inline ml-4" :icon-id="itemIconId(selected.itemId)"/>
                        </div>
                        <div :class="{omitted:itemsMap.get(selected.itemId)!.models.length<=1}">
                            <label>modelIndex: </label>
                            <span>{{ selected.modelIndex }}</span>
                        </div>


                        <hr>
                        <div>
                            <div class="flex">
                                <label>localOffset[0]: </label>
                                <span class="text-red-200 mx-4">{{ selected.localOffset[0].x.toFixed(2) }}</span>
                                <span class="text-green-200 mx-4">{{ selected.localOffset[0].y.toFixed(2) }}</span>
                                <span class="text-blue-200 mx-4">{{ selected.localOffset[0].z.toFixed(2) }}</span>
                            </div>
                        </div>
                        <div>
                            <div class="flex">
                                <label>localOffset[1]: </label>
                                <span class="text-red-200 mx-4">{{ selected.localOffset[1].x.toFixed(2) }}</span>
                                <span class="text-green-200 mx-4">{{ selected.localOffset[1].y.toFixed(2) }}</span>
                                <span class="text-blue-200 mx-4">{{ selected.localOffset[1].z.toFixed(2) }}</span>
                            </div>
                        </div>
                        <div>
                            <div class="flex">
                                <label>yaw: </label>
                                <span class="text-red-200 mx-4">{{ selected.yaw[0].toFixed(2) }}</span>
                                <span class="text-green-200 mx-4">{{ selected.yaw[1].toFixed(2) }}</span>
                            </div>
                        </div>
                        <hr/>

                        <div :class="{omitted:selected.inputObjIdx==-1}">
                            <label>inputObjIdx: </label>
                            <span>{{ selected.inputObjIdx }}</span>
                            <ItemIcon class="w-8 h-8 inline ml-4 hover:bg-gray-500 cursor-pointer"
                                      :icon-id="itemIconId(findBuilding(selected.inputObjIdx)!.itemId)"
                                      v-if="selected.inputObjIdx!=-1" @click="selectedBuildingIndex = selected.inputObjIdx"
                            />
                        </div>
                        <div :class="{omitted:selected.inputFromSlot==0}">
                            <label>inputFromSlot: </label>
                            <span>{{ selected.inputFromSlot }}</span>
                        </div>
                        <div :class="{omitted:selected.inputToSlot==0}">
                            <label>inputToSlot: </label>
                            <span>{{ selected.inputToSlot }}</span>
                        </div>
                        <div :class="{omitted:selected.inputOffset==0}">
                            <label>inputOffset: </label>
                            <span>{{ selected.inputOffset }}</span>
                        </div>
                        <hr/>

                        <div :class="{omitted:selected.outputObjIdx==-1}">
                            <label>outputObjIdx: </label>
                            <span>{{ selected.outputObjIdx }}</span>
                            <ItemIcon class="w-8 h-8 inline ml-4 hover:bg-gray-500 cursor-pointer"
                                      :icon-id="itemIconId(findBuilding(selected.outputObjIdx)!.itemId)"
                                      v-if="selected.outputObjIdx!=-1" @click="selectedBuildingIndex = selected.outputObjIdx"
                            />
                        </div>
                        <div :class="{omitted:selected.outputFromSlot==0}">
                            <label>outputFromSlot: </label>
                            <span>{{ selected.outputFromSlot }}</span>
                        </div>
                        <div :class="{omitted:selected.outputToSlot==0}">
                            <label>outputToSlot: </label>
                            <span>{{ selected.outputToSlot }}</span>
                        </div>
                        <div :class="{omitted:selected.outputOffset==0}">
                            <label>outputOffset: </label>
                            <span>{{ selected.outputOffset }}</span>
                        </div>

                        <hr/>

                        <div :class="{omitted:selected.recipeId==0}">
                            <label>recipeId: </label>
                            <span>{{ selected.recipeId }}</span>
                            <ItemIcon class="w-8 h-8 inline ml-4" v-if="selected.recipeId!=0"
                                      :icon-id="recipeIconId(selected.recipeId)"/>
                        </div>
                        <div :class="{omitted:selected.filterId==0}">
                            <label>filterId: </label>
                            <span>{{ selected.filterId }}</span>
                            <ItemIcon class="w-8 h-8 inline ml-4" v-if="selected.filterId!=0"
                                      :icon-id="itemIconId(selected.filterId)"/>
                        </div>
                        <div :class="{omitted:!selected.parameters}">
                            <label>parameters: </label>
                            <span>{{ selected.parameters }}</span>
                        </div>
                        <hr class="flex-1"/>
                        <div class="flex justify-around" v-if="!isCodeEditing">
                            <button type="button" class="flex-1" @click="clone">克隆</button>
                            <button type="button" class="flex-1 border-red-400 text-red-400" @click="remove">删除</button>
                        </div>
                    </div>
                </fieldset>
                <fieldset style="grid-column: 3/4;grid-row: 1/3;" class="flex flex-col" v-if="!isCodeEditing">
                    <legend>建筑编辑</legend>
                    <!--                    <AceEditor id="editor_build_json" v-model:value="editingJson" mode="json" class="flex-1"/>-->
                    <v-ace-editor v-model:value="editingJson" mode="json" theme="one_dark" class="flex-1"/>
                    <button type="button" @click="submitEdition">提交</button>
                </fieldset>
            </template>
            <template v-if="isCodeEditing">
                <fieldset style="grid-column: 2/4;grid-row: 1/2;" class="overflow-y-auto">
                    <legend>批量编辑</legend>
                    <v-ace-editor v-model:value="code" mode="javascript" theme="one_dark" class="w-full h-full"/>
                </fieldset>
                <fieldset style="grid-column: 3/4;grid-row: 2/3;" class="overflow-y-auto">
                    <legend>编辑结果</legend>
                    <textarea class="w-full h-full" :value="transformedBlueprint" readonly/>
                </fieldset>
            </template>
        </template>
    </div>
</template>

<style scoped>
textarea {
    font-family: Consolas;
}

fieldset {
    @apply mt-4 p-4 border border-dashed border-opacity-30 rounded-md
}

.grid > label {
    @apply justify-self-end pr-4
}

hr {
    grid-column: 1/3;
    @apply border-none h-4
}

.omitted {
    @apply text-gray-500
}
</style>
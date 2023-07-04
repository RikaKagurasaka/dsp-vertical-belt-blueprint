<script setup lang="ts">
import {ref} from "vue";
import {generate} from "./VerticalBelt.ts";
import ItemIcon from "../components/ItemIcon.vue";
import {itemIconId} from "../data/icons.ts";

const rawConfig = ref({
    name: '传送带',
    gameVersion: '0.9.27.15466',
    time: new Date(),
    from: 0,
    to: 5,
    inputOffset: [-1, 0],
    outputOffset: [1, 0],
    itemId: 2003,
    stepDirection: 0,
    stepLength: 7200,
    stepOffset: [1 / 3600, 0],
    stepDensity: 2,
    reversed: false
})

const copyBtnText = ref('复制蓝图')

function copyBlueprint() {
    let config = {
        ...rawConfig.value,
        time: new Date()
    }
    if (config.stepLength != 0)
        config.stepOffset = [
            Math.cos(config.stepDirection / 180 * 3.14) * (1 / config.stepLength),
            Math.sin(config.stepDirection / 180 * 3.14) * (1 / config.stepLength),
        ]
    else
        config.stepOffset = [0, 0]
    const result = generate(config)
    navigator.clipboard.writeText(result)
        .then(() => {
            copyBtnText.value = '已复制'
            setTimeout(() => {
                copyBtnText.value = '复制蓝图'
            }, 1000)
        })
        .catch((e) => {
            copyBtnText.value = '发生异常！'
            console.error(e)
            setTimeout(() => {
                copyBtnText.value = '复制蓝图'
            }, 1000)
        })
}


// const beltIcons = computedAsync(async () => {
//     return (await Promise.all([1, 2, 3].map(async v => import((`../assets/item_recipe/belt-${v}.png`)).then(p => p.default))))
// })
const arrows = (i: number, j: number) => `↖↑↗←x→↙↓↘`[(j - 1) * 3 + i - 1]
</script>

<template>
    <fieldset class="mt-4 p-4 border border-dashed border-opacity-30 rounded-md container">
        <legend>戴森球竖直传送带蓝图工具</legend>
        <form class="grid grid-cols-2 align-middle items-center">
            <label>蓝图名</label>
            <input v-model="rawConfig.name"/>
            <label>游戏版本</label>
            <input disabled v-model="rawConfig.gameVersion" tabindex="-1" class="bg-transparent"/>
            <label>传送带起点高度</label>
            <input name="from" type="number" min="0" v-model.number="rawConfig.from"/>
            <label>传送带终点高度</label>
            <input name="to" type="number" min="0" v-model.number="rawConfig.to"/>
            <label>输入方向</label>
            <div class="grid grid-cols-3 grid-rows-3 justify-self-center">
                <template v-for="j in 3">
                    <template v-for="i in 3">
                        <div class="w-8 h-8 bg-slate-700 border-gray-100 flex justify-center content-center cursor-pointer"
                             @click="rawConfig.inputOffset=[i-2,j-2]"
                             :class="[rawConfig.inputOffset[0]==i-2 && rawConfig.inputOffset[1]==j-2 ?'border':'']"
                        >
                            <span>{{ arrows(4 - i, 4 - j) }}</span>
                        </div>
                    </template>
                </template>
            </div>
            <label>输出方向</label>
            <div class="grid grid-cols-3 grid-rows-3 justify-self-center">
                <template v-for="j in 3">
                    <template v-for="i in 3">
                        <div class="w-8 h-8 bg-slate-700 border-gray-100 flex justify-center content-center cursor-pointer"
                             @click="rawConfig.outputOffset=[i-2,j-2]"
                             :class="[rawConfig.outputOffset[0]==i-2 && rawConfig.outputOffset[1]==j-2 ?'border':'']"
                        >
                            <span>{{ arrows(i, j) }}</span>
                        </div>
                    </template>
                </template>
            </div>

            <label>传送带类型</label>
            <div class="grid grid-cols-3 justify-self-center">
                <div class=" h-10 bg-slate-700 border-gray-100 flex justify-center content-center cursor-pointer gap-4"
                     @click="rawConfig.itemId=2000+i"
                     :class="[rawConfig.itemId==2000+i ?'border':'']"
                     v-for="i in 3"
                >
                    <ItemIcon :icon-id="itemIconId(2000+i)"/>
                </div>
            </div>
            <label>传送带单位偏移方向</label>
            <div>
                <input type="number" v-model.number="rawConfig.stepDirection"/>
                <span>度</span>
                <abbr title="这一项描述的是传送带竖直部分法线向量的反方向在水平面上的投影方向，或者说就是传送带竖直部分的面向。以+X方向为0度，逆时针为正。基本只有美观作用，不影响实际使用。">?</abbr>
            </div>
            <label>传送带单位偏移距离</label>
            <div class="flex items-center">
                <span class="whitespace-nowrap">1 /&nbsp;</span>
                <input type="number" v-model.number="rawConfig.stepLength" class="flex-1 w-0"/>
                <span>格</span>
                <abbr title="这一项描述的是传送带竖直部分每上升一格，水平相距多远。换句话说就是传送带上升斜率的倒数。斜率越大传送带看起来越竖直，但过大可能会导致传送带十分抽象。默认值为7200。特别地，设置为0可以创建完全竖直但拧麻花的传送带。">?</abbr>
            </div>
            <label>传送带密度</label>
            <div>
                <input type="number" v-model.number="rawConfig.stepDensity"/>
                <abbr title="这一项描述的是传送带竖直部分每上升一格，需要用多少传送带。设置为2比较好看，但会消耗更多的传送带，设置为1比较节省传送带。默认值为2。">?</abbr>
            </div>
            <label>是否反向</label>
            <div>
                <input type="checkbox" class="w-auto" v-model="rawConfig.reversed">
            </div>
        </form>
        <button type="button"  @click="copyBlueprint">{{ copyBtnText }}
        </button>
        <div class="text-xs text-right">

        </div>
    </fieldset>
</template>

<style scoped>

</style>
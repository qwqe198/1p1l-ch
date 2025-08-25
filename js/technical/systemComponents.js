var systemComponents = {
    // 标签按钮组件
    'tab-buttons': {
        props: ['layer', 'data', 'name'],
        template: `
            <div class="upgRow">
                <div v-for="tab in Object.keys(data)">
                    <button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
                    v-bind:style="[{'border-color': tmp[layer].color}, (subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + (data[tab].glowColor || defaultGlow)} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
                        v-on:click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{tab}}</button>
                </div>
            </div>
        `
    },

    // 树节点组件
    'tree-node': {
        props: ['layer', 'abb', 'size', 'prev'],
        template: `
        <button v-if="nodeShown(layer)"
            v-bind:id="layer"
            v-on:click="function() {
                if (shiftDown && options.forceTooltips) player[layer].forceTooltip = !player[layer].forceTooltip
                else if(tmp[layer].isLayer) {
                    if (tmp[layer].leftTab) {
                        showNavTab(layer, prev)
                        showTab('none')
                    }
                    else
                        showTab(layer, prev)
                }
                else {run(layers[layer].onClick, layers[layer])}
            }"
            v-bind:class="{
                treeNode: tmp[layer].isLayer,
                treeButton: !tmp[layer].isLayer,
                smallNode: size == 'small',
                [layer]: true,
                tooltipBox: true,
                forceTooltip: player[layer].forceTooltip,
                ghost: tmp[layer].layerShown == 'ghost',
                hidden: !tmp[layer].layerShown,
                locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
                notify: tmp[layer].notify && player[layer].unlocked,
                resetNotify: tmp[layer].prestigeNotify,
                can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
                front: !tmp.scrolled,
            }"
            v-bind:style="constructNodeStyle(layer)">
            <span class="nodeLabel" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
            <tooltip
            v-if="tmp[layer].tooltip != ''"
            :text="(tmp[layer].isLayer) ? (
                player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
                : (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : '达到 ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' 解锁 (你有 ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
            )
            : (
                tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : '我是一个按钮!')
                : (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : '我是一个按钮!')
            )"></tooltip>
            <node-mark :layer='layer' :data='tmp[layer].marked'></node-mark></span>
        </button>
        `
    },

    // 层标签组件
    'layer-tab': {
        props: ['layer', 'back', 'spacing', 'embedded'],
        template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
        <div v-if="back"><button v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="goBack(layer)">←</button></div>
        <div v-if="!tmp[layer].tabFormat">
            <div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
            <infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></infobox>
            <main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
            <div v-if="tmp[layer].type !== 'none'">
                <prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
            </div>
            <resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
            <milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
            <div v-if="Array.isArray(tmp[layer].midsection)">
                <column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
            </div>
            <clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
            <buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
            <upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
            <challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
            <achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
            <br><br>
        </div>
        <div v-if="tmp[layer].tabFormat">
            <div v-if="Array.isArray(tmp[layer].tabFormat)"><div v-if="spacing" v-bind:style="{'height': spacing}"></div>
                <column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
            </div>
            <div v-else>
                <div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
                    <tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
                </div>
                <layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
                <column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'"></column>
            </div>
        </div></div>
            `
    },

    // 覆盖头部组件
    'overlay-head': {
        template: `            
        <div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
        <span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
            <br>开发速度: {{format(player.devSpeed)}}倍<br>
        </span>
        <span v-if="player.offTime !== undefined"  class="overlayThing">
            <br>离线时间: {{formatTime(player.offTime.remain)}}<br>
        </span>
        <br>
        <span v-if="player.points.lt('1e1000')"  class="overlayThing">你有 </span>
        <h2  class="overlayThing" id="points">{{format(player.points,4)}}</h2>
        <span v-if="player.points.lt('1e1e6')"  class="overlayThing"> {{modInfo.pointsName}}</span>
        <br>
        <span v-if="canGenPoints()"  class="overlayThing">({{tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen(),4)}}/秒)</span>
        <div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
    </div>
    `
    },

    // 信息标签组件
    'info-tab': {
        template: `
        <div>
        <h2>{{modInfo.name}}</h2>
        <br>
        <h3>{{VERSION.withName}}</h3>
        <span v-if="modInfo.author">
            <br>
            作者: {{modInfo.author}}    
        </span>
        <br>
        模组树 <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda
        <br>
        声望树由 Jacorb 和 Aarex 制作
        <br><br>
        <div class="link" onclick="showTab('changelog-tab')">更新日志</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">模组树Discord</a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">主声望树服务器</a><br>
        <br><br>
        游戏时间: {{ formatTime(player.timePlayed) }}<br><br>
        <h3>快捷键</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span></div>
    `
    },

    // 选项标签组件
    'options-tab': {
        template: `
        <table>
            <tr>
                <td><button class="opt" onclick="save()">保存</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">自动保存: {{ options.autosave?"开":"关" }}</button></td>
                <td><button class="opt" onclick="hardReset()">硬重置</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="exportSave()">导出到剪贴板</button></td>
                <td><button class="opt" onclick="importSave()">导入</button></td>
                <td><button class="opt" onclick="toggleOpt('offlineProd')">离线生产: {{ options.offlineProd?"开":"关" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="switchTheme()">主题: {{ getThemeName() }}</button></td>
                <td><button class="opt" onclick="adjustMSDisp()">显示里程碑: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
                <td><button class="opt" onclick="toggleOpt('hqTree')">高质量树: {{ options.hqTree?"开":"关" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="toggleOpt('hideChallenges')">已完成挑战: {{ options.hideChallenges?"隐藏":"显示" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('forceOneTab'); needsCanvasUpdate = true">单标签模式: {{ options.forceOneTab?"总是":"自动" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('forceTooltips'); needsCanvasUpdate = true">Shift点击切换提示: {{ options.forceTooltips?"开":"关" }}</button></td>
                </tr> 
        </table>`
    },

    // 返回按钮组件
    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },

    // 工具提示组件
    'tooltip' : {
        props: ['text'],
        template: `<div class="tooltip" v-html="text"></div>
        `
    },

    // 节点标记组件
    'node-mark': {
        props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
        template: `<div v-if='data'>
            <div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
            <img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data"></div>
        </div>
        `
    },

    // 粒子组件
    'particle': {
        props: ['data', 'index'],
        template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
            v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
        </div>
        <svg version="2" v-if="data.color">
        <mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
        </mask>
        </svg>
        </div>
        `
    },

    // 背景组件
    'bg': {
        props: ['layer'],
        template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
        `
    }
}
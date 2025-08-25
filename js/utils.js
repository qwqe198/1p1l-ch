// ************ 主要功能相关 ************

function respecBuyables(layer) {
    if (!layers[layer].buyables) return
    if (!layers[layer].buyables.respec) return
    if (!player[layer].noRespecConfirm && !confirm(tmp[layer].buyables.respecMessage || "确定要重置吗？这将强制你进行\"" + (tmp[layer].name ? tmp[layer].name : layer) + "\"重置！")) return
    run(layers[layer].buyables.respec, layers[layer].buyables)
    updateBuyableTemp(layer)
    document.activeElement.blur()
}

function canAffordUpgrade(layer, id) {
    let upg = tmp[layer].upgrades[id]
    if(tmp[layer].deactivated) return false
    if (tmp[layer].upgrades[id].canAfford === false) return false
    let cost = tmp[layer].upgrades[id].cost
    if (cost !== undefined) 
        return canAffordPurchase(layer, upg, cost)

    return true
}

function canBuyBuyable(layer, id) {
    let b = temp[layer].buyables[id]
    return (b.unlocked && run(b.canAfford, b) && player[layer].buyables[id].lt(b.purchaseLimit) && !tmp[layer].deactivated)
}

function canAffordPurchase(layer, thing, cost) {
    if (thing.currencyInternalName) {
        let name = thing.currencyInternalName
        if (thing.currencyLocation) {
            return !(thing.currencyLocation[name].lt(cost))
        }
        else if (thing.currencyLayer) {
            let lr = thing.currencyLayer
            return !(player[lr][name].lt(cost))
        }
        else {
            return !(player[name].lt(cost))
        }
    }
    else {
        return !(player[layer].points.lt(cost))
    }
}

function buyUpgrade(layer, id) {
    buyUpg(layer, id)
}

function buyUpg(layer, id) {
    if (!tmp[layer].upgrades || !tmp[layer].upgrades[id]) return
    let upg = tmp[layer].upgrades[id]
    if (!player[layer].unlocked || player[layer].deactivated) return
    if (!tmp[layer].upgrades[id].unlocked) return
    if (player[layer].upgrades.includes(id)) return
    if (upg.canAfford === false) return
    let pay = layers[layer].upgrades[id].pay
    if (pay !== undefined)
        run(pay, layers[layer].upgrades[id])
    else {
        let cost = tmp[layer].upgrades[id].cost

        if (upg.currencyInternalName) {
            let name = upg.currencyInternalName
            if (upg.currencyLocation) {
                if (upg.currencyLocation[name].lt(cost)) return
                upg.currencyLocation[name] = upg.currencyLocation[name].sub(cost)
            }
            else if (upg.currencyLayer) {
                let lr = upg.currencyLayer
                if (player[lr][name].lt(cost)) return
                player[lr][name] = player[lr][name].sub(cost)
            }
            else {
                if (player[name].lt(cost)) return
                player[name] = player[name].sub(cost)
            }
        }
        else {
            if (player[layer].points.lt(cost)) return
            player[layer].points = player[layer].points.sub(cost)
        }
    }
    player[layer].upgrades.push(id);
    if (upg.onPurchase != undefined)
        run(upg.onPurchase, upg)
    needCanvasUpdate = true
}

function buyMaxBuyable(layer, id) {
    if (!player[layer].unlocked) return
    if (!tmp[layer].buyables[id].unlocked) return
    if (!tmp[layer].buyables[id].canBuy) return
    if (!layers[layer].buyables[id].buyMax) return

    run(layers[layer].buyables[id].buyMax, layers[layer].buyables[id])
    updateBuyableTemp(layer)
}

function buyBuyable(layer, id) {
    if (!player[layer].unlocked) return
    if (!tmp[layer].buyables[id].unlocked) return
    if (!tmp[layer].buyables[id].canBuy) return

    run(layers[layer].buyables[id].buy, layers[layer].buyables[id])
    updateBuyableTemp(layer)
}

function clickClickable(layer, id) {
    if (!player[layer].unlocked || tmp[layer].deactivated) return
    if (!tmp[layer].clickables[id].unlocked) return
    if (!tmp[layer].clickables[id].canClick) return

    run(layers[layer].clickables[id].onClick, layers[layer].clickables[id])
    updateClickableTemp(layer)
}

function clickGrid(layer, id) {
    if (!player[layer].unlocked  || tmp[layer].deactivated) return
    if (!run(layers[layer].grid.getUnlocked, layers[layer].grid, id)) return
    if (!gridRun(layer, 'getCanClick', player[layer].grid[id], id)) return

    gridRun(layer, 'onClick', player[layer].grid[id], id)
}

// 判断玩家是否在挑战中
function inChallenge(layer, id) {
    let challenge = player[layer].activeChallenge
    if (!challenge) return false
    id = toNumber(id)
    if (challenge == id) return true

    if (layers[layer].challenges[challenge].countsAs)
        return tmp[layer].challenges[challenge].countsAs.includes(id) || false
    return false
}

// ************ 杂项功能 ************

var onTreeTab = true

function showTab(name, prev) {
    if (LAYERS.includes(name) && !layerunlocked(name)) return
    if (player.tab !== name) clearParticles(function(p) {return p.layer === player.tab})
    if (tmp[name] && player.tab === name && isPlainObject(tmp[name].tabFormat)) {
        player.subtabs[name].mainTabs = Object.keys(layers[name].tabFormat)[0]
    }
    var toTreeTab = name == "none"
    player.tab = name
    if (tmp[name] && (tmp[name].row !== "side") && (tmp[name].row !== "otherside")) player.lastSafeTab = name
    updateTabFormats()
    needCanvasUpdate = true
    document.activeElement.blur()
}

function showNavTab(name, prev) {
    console.log(prev)
    if (LAYERS.includes(name) && !layerunlocked(name)) return
    if (player.navTab !== name) clearParticles(function(p) {return p.layer === player.navTab})
    if (tmp[name] && tmp[name].previousTab !== undefined) prev = tmp[name].previousTab
    var toTreeTab = name == "tree-tab"
    console.log(name + prev)
    if (name!== "none" && prev && !tmp[prev]?.leftTab == !tmp[name]?.leftTab) player[name].prevTab = prev
    else if (player[name])
        player[name].prevTab = ""
    player.navTab = name
    updateTabFormats()
    needCanvasUpdate = true
}

function goBack(layer) {
    let nextTab = "none"

    if (player[layer].prevTab) nextTab = player[layer].prevTab
    if (player.navTab === "none" && (tmp[layer]?.row == "side" || tmp[layer].row == "otherside")) nextTab = player.lastSafeTab

    if (tmp[layer].leftTab) showNavTab(nextTab, layer)
    else showTab(nextTab, layer)
}

function layOver(obj1, obj2) {
    for (let x in obj2) {
        if (obj2[x] instanceof Decimal) obj1[x] = new Decimal(obj2[x])
        else if (obj2[x] instanceof Object) layOver(obj1[x], obj2[x]);
        else obj1[x] = obj2[x];
    }
}

function prestigeNotify(layer) {
    if (layers[layer].prestigeNotify) return layers[layer].prestigeNotify()
    
    if (isPlainObject(tmp[layer].tabFormat)) {
        for (subtab in tmp[layer].tabFormat){
            if (subtabResetNotify(layer, 'mainTabs', subtab))
                return true
        }
    }
    for (family in tmp[layer].microtabs) {
        for (subtab in tmp[layer].microtabs[family]){
            if (subtabResetNotify(layer, family, subtab))
                return true
        }
    }
    if (tmp[layer].autoPrestige || tmp[layer].passiveGeneration) return false
    else if (tmp[layer].type == "static") return tmp[layer].canReset
    else if (tmp[layer].type == "normal") return (tmp[layer].canReset && (tmp[layer].resetGain.gte(player[layer].points.div(10))))
    else return false
}

function notifyLayer(name) {
    if (player.tab == name || !layerunlocked(name)) return
    player.notify[name] = 1
}

function subtabShouldNotify(layer, family, id) {
    let subtab = {}
    if (family == "mainTabs") subtab = tmp[layer].tabFormat[id]
    else subtab = tmp[layer].microtabs[family][id]
    if (!subtab.unlocked) return false
    if (subtab.embedLayer) return tmp[subtab.embedLayer].notify
    else return subtab.shouldNotify
}

function subtabResetNotify(layer, family, id) {
    let subtab = {}
    if (family == "mainTabs") subtab = tmp[layer].tabFormat[id]
    else subtab = tmp[layer].microtabs[family][id]
    if (subtab.embedLayer) return tmp[subtab.embedLayer].prestigeNotify
    else return subtab.prestigeNotify
}

function nodeShown(layer) {
    return layerShown(layer)
}

function layerunlocked(layer) {
    if (tmp[layer] && tmp[layer].type == "none") return (player[layer].unlocked)
    return LAYERS.includes(layer) && (player[layer].unlocked || (tmp[layer].canReset && tmp[layer].layerShown))
}

function keepGoing() {
    player.keepGoing = true;
    needCanvasUpdate = true;
}

function toNumber(x) {
    if (x.mag !== undefined) return x.toNumber()
    if (x + 0 !== x) return parseFloat(x)
    return x
}

function updateMilestones(layer) {
    if (tmp[layer].deactivated) return
    for (id in layers[layer].milestones) {
        if (!(hasMilestone(layer, id)) && layers[layer].milestones[id].done()) {
            player[layer].milestones.push(id)
            if (layers[layer].milestones[id].onComplete) layers[layer].milestones[id].onComplete()
            if (tmp[layer].milestonePopups || tmp[layer].milestonePopups === undefined) doPopup("milestone", tmp[layer].milestones[id].requirementDescription, "里程碑达成!", 3, tmp[layer].color);
            player[layer].lastMilestone = id
        }
    }
}

function updateAchievements(layer) {
    if (tmp[layer].deactivated) return
    for (id in layers[layer].achievements) {
        if (isPlainObject(layers[layer].achievements[id]) && !(hasAchievement(layer, id)) && layers[layer].achievements[id].done()) {
            player[layer].achievements.push(id)
            if (layers[layer].achievements[id].onComplete) layers[layer].achievements[id].onComplete()
            if (tmp[layer].achievementPopups || tmp[layer].achievementPopups === undefined) doPopup("achievement", tmp[layer].achievements[id].name, "成就达成!", 3, tmp[layer].color);
        }
    }
}

function addTime(diff, layer) {
    let data = player
    let time = data.timePlayed
    if (layer) {
        data = data[layer]
        time = data.time
    }

    // 内存泄漏修复
    if (time + 0 !== time) {
        console.log("检测到内存泄漏。尝试修复...")
        time = toNumber(time)
        if (isNaN(time) || time == 0) {
            console.log("无法修复! 重置中...")
            time = layer ? player.timePlayed : 0
            if (!layer) player.timePlayedReset = true
        }
    }
    time += toNumber(diff)

    if (layer) data.time = time
    else data.timePlayed = time
}

shiftDown = false
ctrlDown = false

document.onkeydown = function (e) {
    if (player === undefined) return;
    shiftDown = e.shiftKey
    ctrlDown = e.ctrlKey
    if (tmp.gameEnded && !player.keepGoing) return;
    let key = e.key
    if (ctrlDown) key = "ctrl+" + key
    if (onFocused) return
    if (ctrlDown && hotkeys[key]) e.preventDefault()
    if (hotkeys[key]) {
        let k = hotkeys[key]
        if (player[k.layer].unlocked && tmp[k.layer].hotkeys[k.id].unlocked)
            k.onPress()
    }
}

document.onkeyup = function (e) {
    shiftDown = e.shiftKey
    ctrlDown = e.ctrlKey
}

var onFocused = false
function focused(x) {
    onFocused = x
}

function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
};

function isPlainObject(obj) {
    return (!!obj) && (obj.constructor === Object)
}

document.title = modInfo.name

// 将字符串值转换为应有的类型
function toValue(value, oldValue) {
    if (oldValue instanceof Decimal) {
        value = new Decimal (value)
        if (checkDecimalNaN(value)) return decimalZero
        return value
    }
    if (!isNaN(oldValue)) 
        return parseFloat(value) || 0
    return value
}

// 弹窗相关变量
var activePopups = [];
var popupID = 0;

// 显示弹窗的函数
function doPopup(type = "none", text = "这是一个测试弹窗。", title = "", timer = 3, color = "") {
    switch (type) {
        case "achievement":
            popupTitle = "成就达成!";
            popupType = "achievement-popup"
            break;
        case "challenge":
            popupTitle = "挑战完成";
            popupType = "challenge-popup"
            break;
        default:
            popupTitle = "发生了什么?";
            popupType = "default-popup"
            break;
    }
    if (title != "") popupTitle = title;
    popupMessage = text;
    popupTimer = timer;

    activePopups.push({ "time": popupTimer, "type": popupType, "title": popupTitle, "message": (popupMessage + "\n"), "id": popupID, "color": color })
    popupID++;
}

// 调整弹窗显示时间的函数
function adjustPopupTime(diff) {
    for (popup in activePopups) {
        activePopups[popup].time -= diff;
        if (activePopups[popup]["time"] < 0) {
            activePopups.splice(popup, 1); // 当时间为0时移除弹窗
        }
    }
}

function run(func, target, args = null) {
    if (isFunction(func)) {
        let bound = func.bind(target)
        return bound(args)
    }
    else
        return func;
}

function gridRun(layer, func, data, id) {
    if (isFunction(layers[layer].grid[func])) {
        let bound = layers[layer].grid[func].bind(layers[layer].grid)
        return bound(data, id)
    }
    else
        return layers[layer].grid[func];
}
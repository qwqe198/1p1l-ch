addLayer("p", {
    name: "声望", 
    symbol: "P", 
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#31aeb0",
    requires: new Decimal(1), 
    resource: "声望点数", 
    baseResource: "点数", 
    baseAmount() {return player.points}, 
    type: "normal", 
    exponent(){
        let eff=new Decimal(0);
        eff=eff.add(layers.e.buyables[11].effect()[1]).add(challengeEffect("h",11));
        if(!hasMilestone("h",17))eff=eff.add(challengeEffect("h",21));
        let muleff = new Decimal(1);
        if(hasMilestone("h",17))muleff=muleff.mul(challengeEffect("h",21));
        let ret=new Decimal(4).add(eff).mul(muleff);
        if(player.ma.points.gte(1)){
            if(hasMilestone("sp",13))eff = eff.add(player.sp.points.add(1).log10());
            return eff.add(100).mul(player.points.pow(2).div(40).add(1)).mul(muleff);
        }
        if(hasMilestone("sp",11)){
            if(hasMilestone("sp",13))eff = eff.add(player.sp.points.add(1).log10());
            ret=new Decimal(10).add(eff).mul(player.points.pow(2).div(50).max(1)).mul(muleff);
        }else if(hasMilestone("h",5)){
            let ret2=eff.mul(player.points.pow(2).div(50)).mul(muleff);
            ret=ret.max(ret2);
        }
        return ret;
    },
    gainMult() { 
        if(inChallenge("h",21))return new Decimal(0);
        mult = new Decimal(1)
        if(hasUpgrade("b",11))mult=mult.mul(upgradeEffect("b",11));
        if(hasUpgrade("g",11))mult=mult.mul(upgradeEffect("g",11));
        if(hasUpgrade("p",21))mult=mult.mul(2);
        if(hasUpgrade("p",23))mult=mult.mul(upgradeEffect("p",23));
        if(hasUpgrade("p",41))mult=mult.mul(upgradeEffect("p",41));
        if(hasUpgrade("b",31))mult=mult.mul(upgradeEffect("b",31));
        if(hasUpgrade("e",12))mult=mult.mul(upgradeEffect("e",12));
        if(hasUpgrade("g",25))mult=mult.mul(upgradeEffect("g",25));
        if(hasUpgrade("t",25))mult=mult.mul(upgradeEffect("t",25));
        if(hasUpgrade("sp",12))mult=mult.mul(upgradeEffect("sp",12));
        mult=mult.mul(layers.t.powerEff());
        mult=mult.mul(layers.s.buyables[12].effect());
        return mult
    },
    gainExp() { 
        let exp = new Decimal(1)
        if (hasUpgrade("p", 31)) exp = exp.times(1.05);
        return exp;
    },
    row: 0,
    hotkeys: [
        {key: "p", description: "P: 重置获取声望点数", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        rows: 4,
        cols: 4,
        11: {
            title: "开始",
            description: "基于声望点数生成点数",
            cost() { return new Decimal(1); },
        },
        12: {
            title: "声望提升",
            description: "声望点数提升点数生成",
            cost() { return new Decimal(1); },
            effect() {
                if(inChallenge("ne",11))return new Decimal(1);
                let eff = player.p.points.plus(3).pow(0.5);
                if (hasUpgrade("g", 14)) eff = eff.pow(1.5);
                if (hasUpgrade("g", 24)) eff = eff.pow(4/3);
                return eff;
            },
            unlocked() { return hasUpgrade("p", 11) },
            effectDisplay() { return format(tmp.p.upgrades[12].effect)+"倍" },
        },
        13: {
            title: "自我协同",
            description: "点数提升自身的生成",
            cost() { return new Decimal(500); },
            effect() { 
                let eff = player.points.plus(1);
                if (hasUpgrade("g", 15)) eff = eff.pow(upgradeEffect("g", 15));
                if (hasUpgrade("p", 33)) eff = eff.pow(upgradeEffect("p", 33));
                if (hasUpgrade("sp",13)) eff = eff.pow(3);
                if(player.ma.points.gte(1)) return eff.pow(player.points.div(20).max(1));
                return eff;
            },
            unlocked() { return hasUpgrade("p", 12) },
            effectDisplay() { return format(tmp.p.upgrades[13].effect)+"倍" },
        },
        14: {
            title: "声望强度",
            description: "<b>列领导者</b>效果更强",
            cost() { return new Decimal("1e30000"); },
            unlocked() { return hasMilestone("sp", 6) && hasUpgrade("p", 13) },
        },
        21: {
            title: "更多声望",
            description() { return "声望点数获取翻倍" },
            cost() { return new Decimal(10000); },
            unlocked() { return hasUpgrade("p", 13) },
        },
        22: {
            title: "升级力量",
            description: "基于已购买的声望升级提升点数生成速度",
            cost() { return new Decimal(1e11); },
            effect() {
                let eff = Decimal.pow(hasUpgrade("p",32)?3:1.5, player.p.upgrades.length);
                if(hasUpgrade("sp",31))eff = eff.pow(player.sp.upgrades.length**3);
                if(hasUpgrade("sp",32))eff = eff.pow(7);
                return eff;
            },
            unlocked() { return hasUpgrade("p", 21) },
            effectDisplay() { return format(tmp.p.upgrades[22].effect)+"倍" },
        },
        23: {
            title: "反向声望提升",
            description: "声望点数获取基于你的点数提升",
            cost() { return new Decimal(1e26); },
            effect() {
                let eff = player.points.plus(1);
                if (hasUpgrade("g", 23)) eff = eff.pow(upgradeEffect("g", 23));
                if (hasUpgrade("p", 33)) eff = eff.pow(upgradeEffect("p", 33));
                if (hasUpgrade("sp",23)) eff = eff.pow(3);
                if(player.ma.points.gte(1)) return eff.pow(player.points.div(20).max(1));
                return eff;
            },
            unlocked() { return hasUpgrade("p", 22) },
            effectDisplay() { return format(tmp.p.upgrades[23].effect)+"倍" },
        },
        24: {
            title: "等离子能量",
            description: "Tachoclinal Plasma效果使用更好的公式",
            cost() { return new Decimal("1e40000") },
            unlocked() { return hasUpgrade("p", 14) },
        },
        31: {
            title: "我们需要更多声望",
            description: "声望点数获取提升为1.05次方",
            cost() { return new Decimal(1e29); },
            unlocked() { return hasUpgrade("p", 23) },
        },
        32: {
            title: "仍然无用",
            description: "<b>升级力量</b>效果更强",
            cost() { return new Decimal(1e33); },
            unlocked() { return hasUpgrade("p", 31) },
        },
        33: {
            title: "列领导者",
            description: "基于总声望点数使以上两个升级更强",
            effect() { return player.p.total.plus(1).log10().plus(1).log10().div(hasUpgrade("p",14)?(hasUpgrade("sp",14)?0.9:1):5).mul(player.ma.points.gte(1)?(player.points.div(20).max(1)):1).mul(hasUpgrade("sp",33)?upgradeEffect("sp",33):1).plus(1) },
            cost() { return new Decimal(1e53); },
            unlocked() { return hasUpgrade("p", 32) },
            effectDisplay() { return "^"+format(tmp.p.upgrades[33].effect) },
        },
        34: {
            title: "太阳潜能",
            description: "太阳性乘算太阳性获取指数",
            cost() { return new Decimal("1e102400"); },
            unlocked() { return hasUpgrade("p", 24) },
            effect() { return player.o.points.plus(1).log10().plus(1).log10().plus(1).log10().mul(hasUpgrade("sp",34)?upgradeEffect("sp",34):1).plus(1) },
            effectDisplay() { return format(tmp.p.upgrades[34].effect)+"倍" },
        },
        41: {
            title: "声望递归",
            description: "声望点数提升自身的获取",
            cost() { return new Decimal("1e38000"); },
            unlocked() { return hasMilestone("sp", 6) && hasUpgrade("p", 31) },
            effect() { 
                let eff = Decimal.pow(10, player.p.points.plus(1).log10().pow(hasUpgrade("sp",41)?0.7:0.6));
                return eff;
            },
            effectDisplay() { return format(tmp.p.upgrades[41].effect)+"倍" },
        },
        42: {
            title: "空间感知",
            description: "空间建筑更便宜",
            cost() { return new Decimal("1e60000"); },
            unlocked() { return hasUpgrade("p", 41) },
        },
        43: {
            title: "更多折扣",
            description: "助推器更便宜",
            cost() { return new Decimal("1e190000"); },
            unlocked() { return hasUpgrade("p", 42) },
        },
        44: {
            title: "拼写词典",
            description: "第2-4个法术更强",
            cost() { return new Decimal("1e300000"); },
            unlocked() { return player.ma.points.gte(1) },
        },
    },
    layerShown(){return true},
    
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("t", 1)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
    },
    passiveGeneration() { return (hasMilestone("t", 2)?1:0) },
    marked: function(){return player.ma.points.gte(1)}
})


addLayer("b", {
    name: "助推器", 
    symbol: "B", 
    position: 0,
    color: "#6e64c4",
    requires() { 
if(hasMilestone("c",0))return new Decimal(1);
        if(player.ma.points.gte(2))return new Decimal(2).sub(player.points.sub(20).max(0).div(10).min(1));
        if(player.ma.points.gte(1))return new Decimal(2).sub(player.points.sub(20).max(0).div(20).min(1));
        return new Decimal(2)
    },
    resource: "助推器", 
    baseResource: "点数", 
    baseAmount() {return player.points},
    type: "static",
    branches: ["p"],
    exponent() {
        if(player.h.challenges[12]>=23)return Math.max(1.23/Math.sqrt(player.h.challenges[12]),0.25);
        if(player.h.challenges[12]>=20.92)return Math.max(1.225/Math.sqrt(player.h.challenges[12]),0.257);
        if(player.h.challenges[12]>=19.4)return Math.max(1.211/Math.sqrt(player.h.challenges[12]),0.268);
        if(player.h.challenges[12]>=18.1)return Math.max(5.08/player.h.challenges[12],0.275);
        if(player.h.challenges[12]>=16)return 5/Math.min(player.h.challenges[12],17.8);
        if(player.h.challenges[12]>=9)return 4.5/Math.min(player.h.challenges[12],14);
        return 0.5
    },
    base() { 
            if(hasMilestone("c",0))return 1.2;
        let ret=1.3;
        if(hasUpgrade("b",23))ret-=0.01;
        if(hasMilestone("h",2))ret-=0.02;
        if(hasMilestone("h",20))ret-=0.005;
        if(hasMilestone("h",40))ret-=0.005;
        if(hasMilestone("sp",8))ret-=0.01;
        if(hasUpgrade("q",33))ret-=0.005;
        if(hasUpgrade("p",43))ret-=0.01;
        return ret;
    },
    gainMult() { 
        let mult = new Decimal(1);
        return mult;
    },
    canBuyMax() { return player.t.unlocked },
    row: 1,
    hotkeys: [
    {key: "b", description: "B: 重置获取助推器", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.p.unlocked},
    automate() {},
    autoPrestige() { return hasMilestone("s",1) },
    resetsNothing() { return hasMilestone("s",1) },
    addToBase() {
        let base = new Decimal(0);
        if (hasUpgrade("b", 12)&&!hasMilestone("h",9)) base = base.plus(upgradeEffect("b", 12));
        if (hasUpgrade("b", 13)&&!hasMilestone("h",9)) base = base.plus(upgradeEffect("b", 13));
        if (hasUpgrade("t", 11)&&!hasMilestone("q",34)) base = base.plus(upgradeEffect("t", 11));
        if (hasUpgrade("e", 11)&&!hasUpgrade("e", 14)) base = base.plus(upgradeEffect("e", 11).b);
        if (player.e.unlocked) base = base.plus(layers.e.buyables[11].effect()[0]);
        if (hasUpgrade("s",14)&&!hasMilestone("hs",1)) base = base.plus(buyableEffect("s", 13));
        if(!hasMilestone("h",15))base = base.add(challengeEffect("h",12));
        return base;
    },
    effectBase() {
        let base = new Decimal(2);
        
        base = base.plus(tmp.b.addToBase);
        
        if (player.sb.unlocked) base = base.times(tmp.sb.effect);
        if (hasUpgrade("b", 12)&&hasMilestone("h",9)) base = base.times(upgradeEffect("b", 12));
        if (hasUpgrade("b", 13)&&hasMilestone("h",9)) base = base.times(upgradeEffect("b", 13));
        if (hasUpgrade("t", 11)&&hasMilestone("q",34)) base = base.plus(upgradeEffect("t", 11));
        if (hasUpgrade("e", 11)&&hasUpgrade("e", 14)) base = base.times(upgradeEffect("e", 11).b);
        if (hasUpgrade("q", 12)) base = base.times(upgradeEffect("q", 12));
        if (hasMilestone("h",15))base = base.times(challengeEffect("h",12));
        if (player.m.unlocked) base = base.times(buyableEffect("m", 11));
        if (hasUpgrade("s",14)&&hasMilestone("hs",1)) base = base.times(buyableEffect("s", 13));
        if (hasUpgrade("b", 24)) base = base.times(upgradeEffect("b", 24));
        if (hasUpgrade("b", 34)) base = base.times(upgradeEffect("b", 34));
        return base;
    },
    effect() {
        if(inChallenge("h", 12)||inChallenge("ne",11))return new Decimal(1);
        if (player[this.layer].unlocked)return Decimal.pow(tmp.b.effectBase, player.b.points);
        return new Decimal(1);
    },
    effectDescription() {
        return "将点数生成提升"+format(tmp.b.effect)+"倍"+" (每个"+format(tmp.b.effectBase)+"倍)"
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("t", 3)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset("b", keep)
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    upgrades: {
        rows: 3,
        cols: 4,
        11: {
            title: "BP组合",
            description: "最佳助推器提升声望点数获取",
            cost() { return new Decimal(3) },
            effect() { 
                if(player.ma.points.gte(2))return Decimal.pow(10,player.b.best);
                let ret = player.b.best.plus(1);
                if (hasUpgrade("b", 32)) ret = Decimal.pow(1.2, player.b.best).times(ret);
                if (hasUpgrade("b", 33)) ret = Decimal.pow(2/1.2, player.b.best).times(ret);
                return ret;
            },
            unlocked() { return player.b.unlocked },
            effectDisplay() { return format(tmp.b.upgrades[11].effect)+"倍" },
        },
        12: {
            title: "交叉污染",
            description(){
                if(hasMilestone("h",9))return "生成器乘算助推器效果基础";
                return "生成器增加助推器效果基础"
            },
            cost() { return new Decimal(12) },
            effect() {
                let ret = player.g.points.add(1).log10();
                if(player.ma.points.gte(2))ret = player.g.points.div(1000);
                if(hasUpgrade("b",14))ret = ret.mul(player.sb.points.div(100).add(1));
                if(hasMilestone("h",9))ret=ret.add(1);
                return ret;
            },
            unlocked() { return player.b.unlocked&&player.g.unlocked },
            effectDisplay() { if(hasMilestone("h",9))return format(tmp.b.upgrades[12].effect)+"倍";return "+"+format(tmp.b.upgrades[12].effect) },
        },
        13: {
            title: "PB反转",
            description(){
                if(hasMilestone("h",9))return "总声望点数乘算助推器效果基础"
                return "总声望点数增加助推器效果基础"
            },
            cost() { return new Decimal(14) },
            effect() { 
                let ret = player.p.total.add(1).log10().add(1).log10();
                if(player.ma.points.gte(2))ret = player.p.total.add(1).log10().sqrt().div(100);
                if(hasUpgrade("b",14))ret = ret.mul(player.sb.points.div(100).add(1));
                if(hasMilestone("h",9))ret=ret.add(1);
                return ret;
            },
            unlocked() { return player.b.unlocked&&player.b.best.gte(7) },
            effectDisplay() { if(hasMilestone("h",9))return format(tmp.b.upgrades[13].effect)+"倍";return "+"+format(tmp.b.upgrades[13].effect) },
        },
        14: {
            title: "元组合",
            description: "超级助推器提升左侧2个升级",
            cost() { return new Decimal(6160) },
            unlocked() { return player.ma.points.gte(2) },
        },
        21: {
            title: "生成器力量提升",
            description: "生成器力量效果^1.28",
            cost() { return new Decimal(17) },
            unlocked() { return hasUpgrade("b", 11) && hasUpgrade("b", 12) },
        },
        22: {
            title: "生成器力量提升II",
            description: "生成器力量效果^1.25",
            cost() { return new Decimal(22) },
            unlocked() { return hasUpgrade("b", 21) },
        },
        23: {
            title: "折扣一",
            description: "助推器更便宜",
            cost() { return new Decimal(26) },
            unlocked() { return hasUpgrade("b", 22) },
        },
        24: {
            title: "助推递归",
            description: "助推器乘算自身基础",
            cost() { return new Decimal(6300) },
            unlocked() { return player.ma.points.gte(2) },
            effect() { return player.b.points.div(1000).plus(1) },
            effectDisplay() { return format(tmp[this.layer].upgrades[this.id].effect)+"倍" },
        },
        31: {
            title: "更差的BP组合",
            description: "超级助推器提升声望点数获取",
            cost() { return new Decimal(29) },
            unlocked() { return player.sb.unlocked },
            effect() { 
                return Decimal.pow(10, player.sb.points.pow(1.5)); 
            },
            effectDisplay() { return format(tmp.b.upgrades[31].effect)+"倍" },
        },
        32: {
            title: "更好的BP组合",
            description() { return "<b>BP组合</b>使用更好的公式" },
            cost() { return new Decimal(35) },
            unlocked() { return player.sb.unlocked },
        },
        33: {
            title: "更好的BP组合II",
            description() { return "<b>BP组合</b>使用更好的公式" },
            cost() { return new Decimal(45) },
            unlocked() { return player.sb.unlocked },
        },
        34: {
            title: "反度量",
            description: "帝国砖块乘算助推器基础",
            cost() { return new Decimal(10000) },
            unlocked() { return player.ma.points.gte(2) },
            effect() { return player.i.points.plus(1) },
            effectDisplay() { return format(tmp[this.layer].upgrades[this.id].effect)+"倍" },
        },
    },
    marked: function(){return player.ma.points.gte(2)}
})


addLayer("g", {
    name: "生成器", 
    symbol: "G", 
    position: 1,
    color: "#a3d9a5",
    requires() {
if(hasMilestone("c",0))return new Decimal(1);
        if(hasMilestone("ai",9))return new Decimal(1);
        let b=3;
        if(hasUpgrade("g",22))b-=0.15;
        if(hasUpgrade("g",32))b-=0.05;
        if(hasUpgrade("sp",43))b-=0.05;
        if(hasUpgrade("sp",35))b-=0.05;
        if(hasMilestone("h",49))b-=0.05;
        if(player.ma.points.gte(3)){
            return new Decimal(b).sub(player.points.sub(20).max(0).div(10)).max(1);
        }
        return new Decimal(b) 
    },
    resource: "生成器", 
    baseResource: "点数", 
    baseAmount() {return player.points},
    type: "static",
    branches: ["p"],
    exponent() {
        if(player.h.challenges[12]>=23)return Math.max(1.23/Math.sqrt(player.h.challenges[12]),0.25);
        if(player.h.challenges[12]>=20.92)return Math.max(1.225/Math.sqrt(player.h.challenges[12]),0.257);
        if(player.h.challenges[12]>=19.4)return Math.max(1.211/Math.sqrt(player.h.challenges[12]),0.268);
        if(player.h.challenges[12]>=18.1)return Math.max(5.08/player.h.challenges[12],0.275);
        if(player.h.challenges[12]>=16)return 5/Math.min(player.h.challenges[12],17.8);
        if(player.h.challenges[12]>=9)return 4.5/Math.min(player.h.challenges[12],14);
        return 0.5
    },
    base() { return 1.2 },
    gainMult() { 
        let mult = new Decimal(1);
        return mult;
    },
    canBuyMax() { return player.t.unlocked },
    autoPrestige() { return hasMilestone("s",1) },
    resetsNothing() { return hasMilestone("s",1) },
    row: 1,
    hotkeys: [
    {key: "g", description: "G: 重置获取生成器", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.b.unlocked},
    automate() {},
    effectBase() {
        let base = new Decimal(2);
        
        if (hasUpgrade("g", 12) && player.ma.points.lt(3)) base = base.plus(upgradeEffect("g", 12));
        if (hasUpgrade("g", 13) && player.ma.points.lt(3)) base = base.plus(upgradeEffect("g", 13));
        if (hasUpgrade("e", 11)) base = base.plus(upgradeEffect("e", 11).g);
        if (player.e.unlocked) base = base.plus(layers.e.buyables[11].effect()[0]);
        if (hasUpgrade("s",14)&&!hasMilestone("hs",1)) base = base.plus(buyableEffect("s", 13));
        
        if (hasUpgrade("g", 12) && player.ma.points.gte(3)) base = base.times(upgradeEffect("g", 12));
        if (hasUpgrade("g", 13) && player.ma.points.gte(3)) base = base.times(upgradeEffect("g", 13));
        if (hasUpgrade("s",14)&&hasMilestone("hs",1)) base = base.times(buyableEffect("s", 13));
        if (player.sg.unlocked) base = base.times(tmp.sg.effect);
        if (hasUpgrade("q", 12)) base = base.times(upgradeEffect("q", 12));
        return base;
    },
    effect() {
        if(inChallenge("h", 12)||inChallenge("ne",11))return new Decimal(0);
        if (player[this.layer].unlocked){
            let eff=Decimal.pow(tmp.g.effectBase, player.g.points).mul(player.g.points);
            
            if (hasUpgrade("g", 21)) eff = eff.times(upgradeEffect("g", 21));
            if (hasUpgrade("s", 12)) eff = eff.times(upgradeEffect("s", 12));
            if (hasUpgrade("s", 13)) eff = eff.times(upgradeEffect("s", 13));
            if (hasUpgrade("t", 15)) eff = eff.times(softcap(softcap(layers.t.powerEff(),new Decimal("1e110000"),0.5),new Decimal("1e150000"),0.5).min("1e200000"));
        if (player.q.unlocked) eff = eff.times(tmp.q.enEff);
            return eff;
        }
        return new Decimal(0);
    },
    powerEff() {
        if (!player[this.layer].unlocked) return new Decimal(1);
        let ret=softcap(player.g.power.plus(1),new Decimal('1e320'),0.5);
        if(player.m.unlocked)ret=player.g.power.plus(1).pow(0.5);
        if(hasUpgrade("b",21))ret=ret.pow(1.28);
        if(hasUpgrade("b",22))ret=ret.pow(1.25);
        if(hasUpgrade("q",13))ret=ret.pow(1.25);
        return ret;
    },
    effectDescription() {
        return "每秒生成"+format(tmp.g.effect)+"生成器能量"
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("s", 0)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset("g", keep)
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        power: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    upgrades: {
        rows: 3,
        cols: 5,
        11: {
            title: "GP组合",
            description: "最佳生成器提升声望点数获取",
            cost() { return new Decimal(3) },
            effect() { 
                if(player.ma.points.gte(3))return Decimal.pow(10,player.g.best);
                let ret = player.g.best.plus(1);
                return ret;
            },
            unlocked() { return player.g.unlocked },
            effectDisplay() { return format(tmp.g.upgrades[11].effect)+"倍" },
        },
        12: {
            title: "我需要更多！",
            description(){
                if(player.ma.points.gte(3))return "助推器乘算生成器基础";
                return "助推器增加生成器基础";
            },
            cost() { return new Decimal(12) },
            effect() { 
                let ret = player.b.points.add(1).log10();
                if(player.ma.points.gte(3))ret = player.b.points.div(15000);
                if(hasUpgrade("s",24))ret = ret.mul(upgradeEffect("s",24));
                if(player.ma.points.gte(3))ret = ret.add(1);
                return ret;
            },
            unlocked() { return player.b.unlocked&&player.g.unlocked },
            effectDisplay() { if(player.ma.points.gte(3))return format(tmp.g.upgrades[12].effect)+"倍";return "+"+format(tmp.g.upgrades[12].effect) },
        },
        13: {
            title: "我需要更多II",
            description(){
                if(player.ma.points.gte(3))return "最佳声望点数乘算生成器基础";
                return "最佳声望点数增加生成器基础";
            },
            cost() { return new Decimal(14) },
            effect() { 
                let ret = player.p.best.add(1).log10().add(1).log10();
                if(player.ma.points.gte(3))ret = player.p.best.add(1).log10().sqrt().div(1500);
                if(hasUpgrade("s",24))ret = ret.mul(upgradeEffect("s",24));
                if(player.ma.points.gte(3))ret = ret.add(1);
                return ret;
            },
            unlocked() { return player.g.best.gte(8) },
            effectDisplay() { if(player.ma.points.gte(3))return format(tmp.g.upgrades[13].effect)+"倍";return "+"+format(tmp.g.upgrades[13].effect) },
        },
        14: {
            title: "提升提升",
            description() { return "<b>声望提升</b>提升为1.5次方" },
            cost() { return new Decimal(17) },
            unlocked() { return player.g.best.gte(10) },
        },
        15: {
            title: "外部协同",
            description: "基于生成器使<b>自我协同</b>更强",
            cost() { return new Decimal(22) },
            effect() { 
                let eff = player.g.points.pow(player.ma.points.gte(3)?0.75:hasMilestone("h",8)?0.68:0.5).add(1);
                return eff;
            },
            unlocked() { return hasUpgrade("g", 13) },
            effectDisplay() { return "^"+format(tmp.g.upgrades[15].effect) },
        },
        21: {
            title: "我需要更多III",
            description: "生成器能量提升自身的生成",
            cost() { return new Decimal(24) },
            effect() { 
                let ret = player.g.power.add(1).log10().add(1);
                if(hasUpgrade("s",24))ret = ret.pow(upgradeEffect("s",24));
                return ret;
            },
            unlocked() { return hasUpgrade("g", 15) },
            effectDisplay() { return format(tmp.g.upgrades[21].effect)+"倍" },
        },
        22: {
            title: "折扣二",
            description: "生成器更便宜",
            cost() { return new Decimal(27) },
            unlocked() { return hasUpgrade("g", 15) },
        },
        23: {
            title: "双重反转",
            description: "基于助推器使<b>反向声望提升</b>更强",
            cost() { return new Decimal(39) },
            effect() { return player.b.points.pow(player.ma.points.gte(3)?0.75:hasMilestone("h",8)?0.68:0.3).add(1) },
            unlocked() { return hasUpgrade("g", 15)&&player.b.unlocked },
            effectDisplay() { return "^"+format(tmp.g.upgrades[23].effect) },
        },
        24: {
            title: "再次提升提升",
            description: "<b>声望提升</b>提升为1.3333次方",
            cost() { return new Decimal(44) },
            unlocked() { return hasUpgrade("g", 14)&&(hasUpgrade("g", 21)||hasUpgrade("g", 22)) },
        },
        25: {
            title: "更好的GP组合",
            description: "生成器能量提升声望点数",
            cost() { return new Decimal(49) },
            effect() { 
                if(player.sp.unlocked)return player.g.power.add(1);
                let eff = player.g.power.add(1).pow(player.g.power.add(10).log10().div(1000).pow(2).min(1));
                return eff;
            },
            unlocked() { return hasUpgrade("g", 24)&&hasUpgrade("g",15) },
            effectDisplay() { return format(tmp.g.upgrades[25].effect)+"倍" },
        },
        31: {
            title: "荒谬生成",
            description: "生成器能量乘算超级生成器基础",
            cost() { return new Decimal(6370) },
            unlocked() { return player.ma.points.gte(3) },
            effect() { return player.g.power.plus(1).log10().plus(1).log10().plus(1).log10().div(100).plus(1) },
            effectDisplay() { return format(tmp[this.layer].upgrades[this.id].effect)+"倍" },
        },
        32: {
            title: "另一个折扣",
            description: "生成器更便宜",
            cost() { return new Decimal(6410) },
            unlocked() { return player.ma.points.gte(3) },
        },
        33: {
            title: "生命生产",
            description: "生成器提升生命能量获取",
            cost() { return new Decimal(7100) },
            unlocked() { return player.ma.points.gte(3) },
            effect() { return Decimal.pow(1.15, player.g.points.sqrt()) },
            effectDisplay() { return format(tmp[this.layer].upgrades[this.id].effect)+"倍" },
        },
        34: {
            title: "时间生成器",
            description: "生成器能量乘算时间胶囊基础",
            cost() { return new Decimal(12000) },
            unlocked() { return player.ma.points.gte(3) },
            effect() { return player.g.power.plus(1).log10().sqrt().div(500).plus(1) },
            effectDisplay() { return format(tmp[this.layer].upgrades[this.id].effect)+"倍" },
        },
        35: {
            title: "进入未来",
            description: "生命精华、超级点数和超空间能量获取基于生成器能量提升",
            cost() { return new Decimal(13700) },
            unlocked() { return player.ma.points.gte(3) },
            effect() { return player.g.power.plus(1).log10().plus(1).sqrt() },
            effectDisplay() { return format(tmp[this.layer].upgrades[this.id].effect)+"倍" },
        },
    },
    tabFormat: ["main-display",
        "prestige-button",
        "blank",
        ["display-text",
            function() {return '你有 ' + format(player.g.power) + ' 生成器能量，将点数生成提升'+format(tmp.g.powerEff)+'倍'},
                {}],
        "blank",
        ["display-text",
            function() {return '你的最佳生成器是 ' + formatWhole(player.g.best) + '<br>你总共制造了'+formatWhole(player.g.total)+"个生成器"},
                {}],
        "blank",
        "milestones", "blank", "blank", "upgrades"],
    update(diff) {
        if (player.g.unlocked) player.g.power = player.g.power.plus(tmp.g.effect.times(diff));
    },
    marked: function(){return player.ma.points.gte(3)}
})



addLayer("t", {
    name: "时间", 
    symbol: "T", 
    position: 0,
    color: "#006609",
    requires() { 
if(hasMilestone("c",0))return new Decimal(1);
        if(hasMilestone("i",3))return new Decimal(4).sub(player.points.max(23).sub(23).div(2)).max(1);
        return new Decimal(4) 
    },
    resource: "时间胶囊", 
    baseResource: "点数", 
    baseAmount() {return player.points},
    type: "static",
    branches: ["b"],
    exponent() { 
        a=0.75;
        if(player.h.challenges[22]>=19.63)a=Math.max(Math.min(9.2/player.h.challenges[22],0.4279),0.3915);
        else if(player.h.challenges[22]>=10.5)a=a*10/Math.min(player.h.challenges[22],16);
        if(hasUpgrade("sp",25))a=a-0.001;
        if(hasMilestone("i",10))a=a-0.001;
        if(hasMilestone("h",48))a=a-0.001;
        if(hasMilestone("i",11))a=a-0.001;
        if(hasUpgrade("ai",23))a=a-0.002;
        if(hasUpgrade("q",31))a=a/(player.q.buyables[11].add(1).log10().mul(0.01).toNumber()+1);
        a=Math.max(a,0.375);
        return a;
    },
    base() { return 1.1 },
    gainMult() { 
        let mult = new Decimal(1);
        return mult;
    },
    row: 2,
    hotkeys: [
    {key: "t", description: "T: 重置获取时间胶囊", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.g.unlocked},
    automate() {},
    effectBase() {
        let base = new Decimal(2);
        if(hasMilestone("q",12))base = base.plus(1)
        if(hasUpgrade("t",21))base = base.plus(1)
        if(hasUpgrade("t",23))base = base.mul(challengeEffect("h",22));
        else base = base.add(challengeEffect("h",22));
        base = base.mul(tmp.ba.posBuff);
        if (player.m.unlocked) base = base.times(buyableEffect("m", 12));
        if (player.i.buyables[11].gte(1)) base = base.times(buyableEffect("s", 21));
        if (hasUpgrade("g",34)) base = base.times(upgradeEffect("g",34));
        base = base.mul(tmp.en.twEff);
        return base;
    },
    effect() {
        if(inChallenge("h", 22))return new Decimal(0);
        if (player[this.layer].unlocked){
            let gain=Decimal.pow(tmp.t.effectBase,layers.t.effect1()).mul(layers.t.effect1());
            if (player.h.unlocked) gain = gain.mul(layers.h.effect());
            if (hasUpgrade("t",22)) gain = gain.mul(upgradeEffect("t",22));
            gain = gain.mul(tmp.o.solEnEff);
            gain = gain.mul(tmp.t.powerEff2);
            return gain;
        }
        return new Decimal(0);
    },
    effect1() {
        let ret = player[this.layer].points.add(player[this.layer].buyables[11]);
        return ret;
    },
    powerEff() {
        if (!player[this.layer].unlocked) return new Decimal(1);
        let ret=player.t.power.plus(1);
        
        if(hasUpgrade("t",14))ret = ret.pow(1.28)
        if(hasMilestone("hs",3))ret = ret.pow(1.25)
        if(player.ma.points.gte(4))ret = ret.pow(1.25)
        return ret;
    },
    powerEff2() {
        if (!hasUpgrade("t",24)) return new Decimal(1);
        let ret=player.t.power.plus(1).log10().sqrt().div(2);
        if(hasMilestone("h",21))ret=player.t.power.plus(1).log10().pow(0.6);
        if(player.ge.unlocked)ret=player.t.power.plus(1).log10().pow(0.7);
        if(hasUpgrade("t",33))ret=player.t.power.plus(1).log10().pow(0.75);
        if(hasUpgrade("t",34))ret=player.t.power.plus(1).log10().pow(0.8);
        if(hasUpgrade("sp",15))ret=player.t.power.plus(1).log10().pow(0.81);
            if(hasUpgrade("ai",43))ret=player.t.power.plus(1).log10().pow(0.95);
            if(hasUpgrade("sp",54))ret=player.t.power.plus(1).log10().pow(0.97);
        if(hasUpgrade("t",14))ret = ret.mul(1.28)
        if(hasMilestone("hs",3))ret = ret.mul(1.25)
        if(player.ma.points.gte(4))ret = ret.mul(1.25)
        return Decimal.pow(2,ret);
    },
    effectDescription() {
        return "每秒生成"+format(tmp.t.effect)+"时间能量"
    },
    doReset(resettingLayer) {
        let keep = [];
        if (player.q.unlocked) keep.push("milestones")
        if (hasMilestone("q",4)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset("t", keep)
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        power: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    tabFormat: {
        "Main Tab": {
            content:  ["main-display",
        "prestige-button",
                "resource-display",
        "blank",
        ["display-text",
            function() {return '你有 ' + format(player.t.power) + ' 时间能量，将点数 & 声望点数生成提升'+format(tmp.t.powerEff)+'倍 '+(hasUpgrade("t",24)?("并将时间能量获取提升"+format(tmp.t.powerEff2)+'倍'):"")},
                {}],
        "blank",
        "buyables",
         "blank", "upgrades"]
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones"]
        },
    },
    update(diff) {
        if (player.t.unlocked) player.t.power = player.t.power.plus(tmp.t.effect.times(diff));
        if (hasMilestone("q",8))player.t.buyables[11]=player.t.buyables[11].max(player.b.points.add(1).pow(1/1.5).sub(2).add(0.000001).floor());
        if (hasMilestone("q",8)&&hasUpgrade("t",31))player.t.buyables[11]=player.t.buyables[11].max(player.b.points.pow(1/1.45).add(0.000001).floor());
    },
    milestones: {
        0: {
            requirementDescription: "1时间胶囊",
            done() { return player.t.best.gte(1) },
            effectDescription: "你可以购买最大助推器/生成器",
        },
        1: {
            requirementDescription: "2时间胶囊",
            done() { return player.t.best.gte(2) },
            effectDescription: "保留声望升级",
        },
        2: {
            requirementDescription: "3时间胶囊",
            done() { return player.t.best.gte(3) },
            effectDescription: "每秒获得100%声望点数",
        },
        3: {
            requirementDescription: "4时间胶囊",
            done() { return player.t.best.gte(4) },
            effectDescription: "保留助推器升级",
        },
    },
    
buyables: {
        rows: 1,
        cols: 1,
        11: {
            title: "额外时间胶囊",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = x.add(3).pow(1.5).sub(1).ceil();
                if(hasUpgrade("t",31))cost = x.add(1).pow(1.45).ceil();
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let extra2 = tmp[this.layer].effect1.sub(player[this.layer].buyables[this.id]).sub(player[this.layer].points);
                return "你有"+formatWhole(player[this.layer].buyables[this.id])+(extra2.gte(1)?("+"+formatWhole(extra2)):"")+"额外时间胶囊\n\
                下一个额外时间胶囊成本: " + format(data.cost) + " 助推器";
            },
            unlocked() { return hasUpgrade("t",12) }, 
            canAfford() {
                return player.b.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.b.points = player.b.points.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
            },
            buyMax() {},
            style: {'height':'222px'},
        },
},

    upgrades: {
        rows: 4,
        cols: 5,
        11: {
            title: "伪提升",
            description(){
                if(hasUpgrade("q",34))return "非额外时间胶囊乘算助推器基础";
                return "非额外时间胶囊增加助推器基础"
            },
            cost() { return new Decimal(8) },
            unlocked() { return player.t.unlocked },
            effect() { 
                let ret = player.t.points.pow(0.9).add(0.5).plus(hasUpgrade("t", 13)?upgradeEffect("t", 13):0);
                if(player.ge.unlocked)ret = player.t.points.add(1).mul(hasUpgrade("t", 13)?upgradeEffect("t", 13):1);
                if(hasUpgrade("q",34) && !player.ge.unlocked)ret=ret.add(1);
                return ret;
            },
            effectDisplay() { if(hasUpgrade("q",34))return format(tmp.t.upgrades[11].effect)+"倍";return "+"+format(tmp.t.upgrades[11].effect) }
        },
        12: {
            title: "限制拉伸器",
            description: "解锁额外时间胶囊",
            cost() { return new Decimal(11) },
            unlocked() { return player.t.best.gte(2) },
        },
        13: {
            title: "伪伪提升",
            description(){
                if(player.ge.unlocked)return "额外时间胶囊乘算<b>伪提升</b>效果"
                return "额外时间胶囊增加<b>伪提升</b>效果"
            },
            cost() { return new Decimal(13) },
            unlocked() { return hasUpgrade("t", 12) },
            effect() { 
                if(player.ge.unlocked)return player.t.buyables[11].add(1);
                return player.t.buyables[11].pow(0.95);
            },
            effectDisplay() { if(player.ge.unlocked)return format(tmp.t.upgrades[13].effect)+"倍";return "+"+format(tmp.t.upgrades[13].effect) }
        },
        14: {
            title: "更多时间",
            description: "时间能量效果提升为1.28次方",
            cost() { return new Decimal(19) },
            unlocked() { return hasUpgrade("t", 13) },
        },
        15: {
            title: "时间效力",
            description: "时间能量影响生成器能量获取(软上限1e110000时间能量效果,硬上限1e390000)",
            cost() { return new Decimal(20) },
            unlocked() { return hasUpgrade("t", 13) },
        },
        21: {
            title: "弱化链条",
            description: "时间胶囊基础+1",
            cost() { return new Decimal(21) },
            unlocked() { return hasUpgrade("t", 15) },
        },
        22: {
            title: "增强时间",
            description: "增强点数提升时间能量的生成",
            cost() { return new Decimal(29) },
            unlocked() { return hasUpgrade("t", 21) },
            effect() { 
                if(player.ge.unlocked)return player.e.points.plus(1);
                return player.e.points.plus(1).root(10);
            },
            effectDisplay() { return format(tmp.t.upgrades[22].effect)+"倍" },
        },
        23: {
            title: "阻碍增强器",
            description: "第4个H挑战效果更强",
            cost() { return new Decimal(32) },
            unlocked() { return hasUpgrade("t", 22) },
        },
        24: {
            title: "时间膨胀",
            description: "解锁新的时间能量效果",
            cost() { return new Decimal(40) },
            unlocked() { return hasUpgrade("t", 23) },
        },
        25: {
            title: "更好的BP组合III",
            description: "助推器效果提升声望点数",
            cost() { return new Decimal(66) },
            effect() { 
                if(player.sp.unlocked)return tmp.b.effect;
                let eff = tmp.b.effect.add(1).pow(tmp.b.effect.add(10).log10().div(player.m.unlocked?8000:10000).pow(2).min(1));
                return eff;
            },
            unlocked() { return hasUpgrade("t", 24) },
            effectDisplay() { return format(tmp.t.upgrades[25].effect)+"倍" },
        },
        31: {
            title: "便宜时间",
            description: "额外时间胶囊更便宜",
            cost() { return new Decimal(720) },
            unlocked() { return player.ma.points.gte(4) },
        },
        32: {
            title: "超时间连续体",
            description: "超空间成本降低",
            cost() { return new Decimal(900) },
            unlocked() { return player.ma.points.gte(4) },
        },
        33: {
            title: "几乎无限",
            description: "第2个时间能量效果更强",
            cost() { return new Decimal(1375) },
            unlocked() { return player.ma.points.gte(4) },
        },
        34: {
            title: "不要浪费时间",
            description: "第2个时间能量效果更强",
            cost() { return new Decimal(2660) },
            unlocked() { return player.ma.points.gte(4) },
        },
        35: {
            title: "亚时间力量",
            description: "子空间基础x1.2，基于时间胶囊获取更多超空间能量",
            cost() { return new Decimal(3750) },
            unlocked() { return player.ma.points.gte(4) },
        },
    },
    canBuyMax() { return hasMilestone("q",1) },
    autoPrestige() { return hasMilestone("q",5) },
    resetsNothing() { return hasMilestone("q",5) },
    marked: function(){return player.ma.points.gte(4)}
})


addLayer("s", {
    name: "空间", 
    symbol: "S", 
    position: 2,
    color: "#dfdfdf",
    requires() { 
if(hasMilestone("c",0))return new Decimal(1);
        if(hasMilestone("i",3))return new Decimal(4).sub(player.points.max(23).sub(23).div(2)).max(1);
        if(player.ma.points.gte(5))return new Decimal(4);
        let ret=new Decimal(5);
        if(player.ss.unlocked)ret=ret.sub(0.25);
        if(hasUpgrade("ss",11))ret=ret.sub(0.25);
        if(player.hs.unlocked)ret=ret.sub(0.25);
        
        if(player.s.points.gte(15))ret=ret.min(4.8362118522710054416216354073349);
        if(player.s.points.gte(275))ret=ret.min(4.493359291942686);
        return ret;
    },
 autoPrestige() { return hasMilestone("q",6) },
    resetsNothing() { return hasMilestone("q",6) },
    resource: "空间能量", 
    baseResource: "点数", 
    baseAmount() {return player.points},
    type: "static",
canBuyMax() { return hasMilestone("q",3) },
    branches: ["g"],
    exponent() { 
        a=0.75;
        if(player.h.challenges[22]>=19.63)a=Math.max(Math.min(9.2/player.h.challenges[22],0.4279),0.3915);
        else if(player.h.challenges[22]>=10.5)a=a*10/Math.min(player.h.challenges[22],16);
        if(hasUpgrade("sp",25))a=a-0.001;
        if(hasMilestone("i",10))a=a-0.001;
        if(hasMilestone("h",48))a=a-0.001;
        if(hasMilestone("i",11))a=a-0.001;
        if(hasUpgrade("ai",23))a=a-0.002;
        if(hasUpgrade("q",31))a=a/(player.q.buyables[11].add(1).log10().mul(0.01).toNumber()+1);
        a=Math.max(a,0.375);
        return a;
    },
    base() { return 1.1 },
    gainMult() { 
        let mult = new Decimal(1);
        return mult;
    },
    row: 2,
    hotkeys: [
    {key: "s", description: "S: 重置获取空间能量", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.t.unlocked},
    automate() {},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        power: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    milestones: {
        0: {
            requirementDescription: "2空间能量",
            done() { return player[this.layer].best.gte(2) },
            effectDescription: "保留生成器升级",
        },
        1: {
            requirementDescription: "4空间能量",
            done() { return player[this.layer].best.gte(4)},
            effectDescription: "自动购买助推器/生成器，助推器/生成器重置不影响任何内容",
        },
    },
    doReset(resettingLayer) {
        let keep = [];
        if (player.q.unlocked) keep.push("milestones")
        if (hasMilestone("q",4)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset("s", keep)
    },
    
    buyables: {
        rows: 3,
        cols: 5,
        11: {
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(hasUpgrade("s",34)?800:hasUpgrade("s",31)?1e3:1e4,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
                if(x.eq(0))return new Decimal(0)
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = Decimal.pow(player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).add(1),x.add(hasUpgrade("s",32)?player.s.buyables[12].div(5):0).add(buyableEffect("s",15)).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1).mul(3));
                eff = eff.pow(buyableEffect("hs",11));
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "空间建筑1\n\
                成本: " + format(data.cost) + " 生成器能量\n\
                等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
                "当前: 将点数获取乘" + format(data.effect) + "倍 (由你的空间能量提升)";
            },
            unlocked() { return player.g.unlocked }, 
            canAfford() {
                return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.g.power = player.g.power.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'height':'120px','width':'120px'},
        },
        12: {
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = Decimal.pow(hasUpgrade("s",34)?4e4:hasUpgrade("s",31)?1e5:1e6,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
            return cost
        },
        effect(x=player[this.layer].buyables[this.id]) {
            let eff = Decimal.pow(player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).add(1),x.add(hasUpgrade("s",32)?player.s.buyables[13].div(5):0).add(buyableEffect("s",15)).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1).mul(3));
            eff = eff.pow(buyableEffect("hs",12));
            return eff;
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "空间建筑2\n\
            成本: " + format(data.cost) + " 生成器能量\n\
            等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
            "当前: 将声望点数获取乘" + format(data.effect) + "倍 (由你的空间能量提升)";
        },
        unlocked() { return player.g.unlocked }, 
        canAfford() {
            return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
        },
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player.g.power = player.g.power.sub(cost)    
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
        },
        style: {'height':'120px','width':'120px'},
    },
    13: {
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = Decimal.pow(hasUpgrade("s",34)?3e7:hasUpgrade("s",31)?1e8:1e10,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
            return cost
        },
        effect(x=player[this.layer].buyables[this.id]) {
            let eff = player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).mul(x.add(hasUpgrade("s",32)?player.s.buyables[14].div(5):0).add(buyableEffect("s",15)).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1)).pow(0.4);
            if(hasMilestone("hs",1))eff = eff.add(1).sqrt();
            eff = eff.pow(buyableEffect("hs",13));
            return eff;
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "空间建筑3\n\
            成本: " + format(data.cost) + " 生成器能量\n\
            等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
            "当前: "+(hasMilestone("hs",1)?"乘算":"增加")+"助推器/生成器基础" + format(data.effect) + "倍 (由你的空间能量提升)";
        },
        unlocked() { return hasUpgrade("s",14) }, 
        canAfford() {
            return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
        },
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player.g.power = player.g.power.sub(cost)    
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
        },
        style: {'height':'120px','width':'120px'},
    },
    14: {
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = Decimal.pow(hasUpgrade("s",34)?8e11:hasUpgrade("s",31)?1e13:1e20,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
            return cost
        },
        effect(x=player[this.layer].buyables[this.id]) {
            let eff = player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).mul(x.add(hasUpgrade("s",32)?player.s.buyables[15].div(5):0).add(buyableEffect("s",15)).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1)).pow(0.2).add(1);
            if(hasUpgrade("s",23))eff=eff.pow(2);
            if(hasUpgrade("q",32))eff=eff.pow(0.1);
            eff = eff.pow(buyableEffect("hs",14));
            return eff;
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "空间建筑4\n\
            成本: " + format(data.cost) + " 生成器能量\n\
            等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
            "当前: 将子空间"+(hasUpgrade("q",32)?"基础":"获取")+"乘" + format(data.effect) + "倍 (由你的空间能量提升)";
        },
        unlocked() { return hasUpgrade("s",15) }, 
        canAfford() {
            return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
        },
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player.g.power = player.g.power.sub(cost)    
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
        },
        style: {'height':'120px','width':'120px'},
    },
    15: {
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = Decimal.pow(hasUpgrade("s",34)?1e40:1e50,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
            return cost
        },
        effect(x=player[this.layer].buyables[this.id]) {
            if(!hasUpgrade("s",25))return new Decimal(0);
            let eff = player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).mul(x.add(hasUpgrade("s",32)?player.s.buyables[21].div(5):0).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1)).pow(0.5).div(5);
            eff = eff.mul(buyableEffect("hs",15));
            return eff;
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "空间建筑5\n\
            成本: " + format(data.cost) + " 生成器能量\n\
            等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
            "当前: 为前4个空间建筑增加" + format(data.effect) + "等级 (由你的空间能量提升)";
        },
        unlocked() { return hasUpgrade("s",25) }, 
        canAfford() {
            return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
        },
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player.g.power = player.g.power.sub(cost)    
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
        },
        style: {'height':'120px','width':'120px'},
    },21: {
    cost(x=player[this.layer].buyables[this.id]) {
        let cost = Decimal.pow(1e30,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
        return cost
    },
    effect(x=player[this.layer].buyables[this.id]) {
        if(player.i.buyables[11].lt(1))return new Decimal(1);
        let eff = player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).mul(x.add(hasUpgrade("s",32)?player.s.buyables[22].div(5):0).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1)).pow(0.25).div(100).add(1);
        eff = eff.pow(buyableEffect("hs",21));
        return eff;
    },
    display() {
        let data = tmp[this.layer].buyables[this.id]
        return "空间建筑6\n\
        成本: " + format(data.cost) + " 生成器能量\n\
        等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
        "当前: 将时间胶囊基础乘" + format(data.effect) + "倍 (由你的空间能量提升)";
    },
    unlocked() { return player.i.buyables[11].gte(1) }, 
    canAfford() {
        return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
    },
    buy() { 
        cost = tmp[this.layer].buyables[this.id].cost
        player.g.power = player.g.power.sub(cost)    
        player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
    },
    style: {'height':'120px','width':'120px'},
},
22: {
    cost(x=player[this.layer].buyables[this.id]) {
        let cost = Decimal.pow(1e60,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
        return cost
    },
    effect(x=player[this.layer].buyables[this.id]) {
        if(player.i.buyables[11].lt(2))return new Decimal(1);
        let eff = Decimal.pow(player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).add(1),x.add(hasUpgrade("s",32)?player.s.buyables[23].div(5):0).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1).mul(20).pow(0.8));
        eff = eff.pow(buyableEffect("hs",22));
        return eff;
    },
    display() {
        let data = tmp[this.layer].buyables[this.id]
        return "空间建筑7\n\
        成本: " + format(data.cost) + " 生成器能量\n\
        等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
        "当前: 将幻影灵魂需求除" + format(data.effect) + "倍 (由你的空间能量提升)";
    },
    unlocked() { return player.i.buyables[11].gte(2) }, 
    canAfford() {
        return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
    },
    buy() { 
        cost = tmp[this.layer].buyables[this.id].cost
        player.g.power = player.g.power.sub(cost)    
        player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
    },
    style: {'height':'120px','width':'120px'},
},
23: {
    cost(x=player[this.layer].buyables[this.id]) {
        let cost = Decimal.pow(1e100,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
        return cost
    },
    effect(x=player[this.layer].buyables[this.id]) {
        if(player.i.buyables[11].lt(3))return new Decimal(1);
        let eff = player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).add(1).log10().mul(x.add(hasUpgrade("s",32)?player.s.buyables[24].div(5):0).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1).add(1).log10()).add(1);
        eff = eff.pow(buyableEffect("hs",23));
        return eff;
    },
    display() {
        let data = tmp[this.layer].buyables[this.id]
        return "空间建筑8\n\
        成本: " + format(data.cost) + " 生成器能量\n\
        等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
        "当前: 将超空间能量获取乘" + format(data.effect) + "倍 (由你的空间能量提升)";
    },
    unlocked() { return player.i.buyables[11].gte(3) }, 
    canAfford() {
        return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
    },
    buy() { 
        cost = tmp[this.layer].buyables[this.id].cost
        player.g.power = player.g.power.sub(cost)    
        player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
    },
    style: {'height':'120px','width':'120px'},
},
24: {
    cost(x=player[this.layer].buyables[this.id]) {
        let cost = Decimal.pow(1e150,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
        return cost
    },
    effect(x=player[this.layer].buyables[this.id]) {
        if(player.i.buyables[11].lt(4))return new Decimal(1);
        let eff = player.s.points.mul(layers.ss.eff1()).mul(buyableEffect("s",25)).add(1).log10().mul(x.add(hasUpgrade("s",32)?player.s.buyables[25].div(5):0).add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1).add(1).log10()).div(100).add(1);
        eff = eff.mul(buyableEffect("hs",24));
        return eff;
    },
    display() {
        let data = tmp[this.layer].buyables[this.id]
        return "空间建筑9\n\
        成本: " + format(data.cost) + " 生成器能量\n\
        等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
        "当前: 将法术效果乘" + format(data.effect) + "倍 (由你的空间能量提升)";
    },
    unlocked() { return player.i.buyables[11].gte(4) }, 
    canAfford() {
        return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
    },
    buy() { 
        cost = tmp[this.layer].buyables[this.id].cost
        player.g.power = player.g.power.sub(cost)    
        player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
    },
    style: {'height':'120px','width':'120px'},
},
25: {
    cost(x=player[this.layer].buyables[this.id]) {
        let cost = Decimal.pow(1e300,Decimal.pow(x,1.35)).pow(hasUpgrade("sp",42)?0.9:hasUpgrade("p",42)?0.95:1)
        return cost
    },
    effect(x=player[this.layer].buyables[this.id]) {
        if(player.i.buyables[11].lt(5))return new Decimal(1);
        let eff = x.add(hasUpgrade("s",11)?1:0).add(hasUpgrade("s",22)?upgradeEffect("s",22):0).add(hasUpgrade("ss",31)?upgradeEffect("ss",31):0).mul(hasUpgrade("s",21)?1.08:1).add(1).log10().div(5).add(1);
        return eff;
    },
    display() {
        let data = tmp[this.layer].buyables[this.id]
        return "空间建筑10\n\
        成本: " + format(data.cost) + " 生成器能量\n\
        等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
        "当前: 将有效空间能量乘" + format(data.effect) + "倍";
    },
    unlocked() { return player.i.buyables[11].gte(5) }, 
    canAfford() {
        return player.g.power.gte(tmp[this.layer].buyables[this.id].cost)
    },
    buy() { 
        cost = tmp[this.layer].buyables[this.id].cost
        player.g.power = player.g.power.sub(cost)    
        player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
    },
    style: {'height':'120px','width':'120px'},
},
    },
    upgrades:{
        rows: 3,
        cols: 5,
        11: {
            title: "空间X",
            description: "所有空间建筑免费提升1级",
            cost() { return new Decimal(8) },
            unlocked() { return player[this.layer].unlocked }
        },
        12: {
            title: "生成器生成器",
            description: "生成器能量提升自身的生成",
            cost() { return new Decimal(9) },
            unlocked() { return hasUpgrade("s", 11) },
            effect() { return player.g.power.add(1).log10().add(1) },
            effectDisplay() { return format(tmp.s.upgrades[12].effect)+"倍" },
        },
        13: {
            title: "运送离开",
            description: "空间建筑1等级提升生成器能量获取",
            cost() { return new Decimal(11) },
            unlocked() { return hasUpgrade("s", 11) },
            effect() { return Decimal.pow(10, player.s.buyables[11]) },
            effectDisplay() { return format(tmp.s.upgrades[13].effect)+"倍" },
        },
        14: {
            title: "进入重复",
            description: "解锁<b>空间建筑3</b>",
            cost() { return new Decimal(12) },
            unlocked() { return hasUpgrade("s", 12)||hasUpgrade("s", 13) }
        },
        15: {
            title: "四方",
            description: "解锁<b>空间建筑4</b>",
            cost() { return new Decimal(17) },
            unlocked() { return hasUpgrade("s", 14) },
        },
        21: {
            title: "宽敞",
            description: "所有空间建筑效果提升8%",
            cost() { return new Decimal(19) },
            unlocked() { return hasUpgrade("s", 15) },
        },
        22: {
            title: "时空异常",
            description: "非额外时间胶囊提供免费空间建筑",
            cost() { return new Decimal(21) },
            unlocked() { return hasUpgrade("s", 21) },
            effect() { if(hasMilestone("hs",2))return player.t.points.sqrt(); return player.t.points.cbrt().floor() },
            effectDisplay() { if(hasMilestone("hs",2))return "+"+format(tmp.s.upgrades[22].effect); return "+"+formatWhole(tmp.s.upgrades[22].effect) },
        },
        23: {
            title: "子空间提升",
            description: "空间建筑4效果平方",
            cost() { return new Decimal(26) },
            unlocked() { return hasUpgrade("s", 21) },
        },
        24: {
            title: "想要更多?",
            description: "基于空间建筑1使所有三个<b>我需要更多</b>升级更强",
            cost() { return new Decimal(40) },
            unlocked() { return hasUpgrade("s", 23) },
            effect() {
                return player.s.buyables[11].sqrt().div(5).plus(1);
            },
            effectDisplay() { return format(tmp.s.upgrades[24].effect.sub(1).times(100))+"%更强" },
        },
        25: {
            title: "再来一个?",
            description: "解锁<b>空间建筑5</b>并自动购买",
            cost() { return new Decimal(63) },
            unlocked() { return hasUpgrade("s", 24) },
        },
        31: {
            title: "有用的维度",
            description: "前四个空间建筑更便宜",
            cost() { return new Decimal(960) },
            unlocked() { return player.ma.points.gte(5) },
        },
        32: {
            title: "庞加莱递归",
            description: "每个空间建筑购买等级的1/5会添加到前一个建筑的额外等级",
            cost() { return new Decimal(1325) },
            unlocked() { return player.ma.points.gte(5) },
        },
        33: {
            title: "非连续光谱",
            description: "空间能量乘算超空间能量获取",
            cost() { return new Decimal(2620) },
            unlocked() { return player.ma.points.gte(5) },
            effect() { return player.s.points.plus(1) },
            effectDisplay() { return format(tmp.s.upgrades[this.id].effect)+"倍" },
        },
        34: {
            title: "能量减少",
            description: "前五个空间建筑更便宜",
            cost() { return new Decimal(4000) },
            unlocked() { return player.ma.points.gte(5) },
        },
        35: {
            title: "连续维度",
            description: "空间能量乘算超级点数获取",
            cost() { return new Decimal(2090) },
            unlocked() { return player.ma.points.gte(5) },
            effect() { return player.s.points.plus(1) },
            effectDisplay() { return format(tmp.s.upgrades[this.id].effect)+"倍" },
        },
    },
    
        canBuyMax() { return hasMilestone("q",2) },
        autoPrestige() { return hasMilestone("q",6) },
        resetsNothing() { return hasMilestone("q",6) },
        
    update(diff){
    var pow=player.g.power.pow(hasUpgrade("sp",42)?(1/0.9):hasUpgrade("p",42)?(1/0.95):1);
    if(player.i.buyables[11].gte(5)){
        var target=pow.add(1).log(1e300).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[25])){
            player.s.buyables[25]=target;
        }
    }
    if(player.i.buyables[11].gte(4)){
        var target=pow.add(1).log(1e150).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[24])){
            player.s.buyables[24]=target;
        }
    }
    if(player.i.buyables[11].gte(3)){
        var target=pow.add(1).log(1e100).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[23])){
            player.s.buyables[23]=target;
        }
    }
    if(player.i.buyables[11].gte(2)){
        var target=pow.add(1).log(1e60).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[22])){
            player.s.buyables[22]=target;
        }
    }
    if(player.i.buyables[11].gte(1)){
        var target=pow.add(1).log(1e30).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[21])){
            player.s.buyables[21]=target;
        }
    }
    if(hasUpgrade("s",25)){
        var target=pow.add(1).log(hasUpgrade("s",34)?1e40:1e50).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[15])){
            player.s.buyables[15]=target;
        }
    }
    if(hasMilestone("ss",1)){
        var target=pow.add(1).log(hasUpgrade("s",34)?8e11:hasUpgrade("s",31)?1e13:1e20).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[14])){
            player.s.buyables[14]=target;
        }
    }
    if(hasMilestone("ss",0)){
        var target=pow.add(1).log(hasUpgrade("s",34)?3e7:hasUpgrade("s",31)?1e8:1e10).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[13])){
            player.s.buyables[13]=target;
        }
    }
    if(hasMilestone("q",11)){
        var target=pow.add(1).log(hasUpgrade("s",34)?4e4:hasUpgrade("s",31)?1e5:1e6).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[12])){
            player.s.buyables[12]=target;
        }
    }
    if(hasMilestone("q",10)){
        var target=pow.add(1).log(hasUpgrade("s",34)?800:hasUpgrade("s",31)?1e3:1e4).pow(1/1.35).add(1).floor();
        if(target.gt(player.s.buyables[11])){
            player.s.buyables[11]=target;
        }
    }
},
marked: function(){return player.ma.points.gte(5)}
},)

addLayer("e", {
    name: "增强",
    symbol: "E",
    position: 2,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#b82fbd",
    requires() {
if(hasMilestone("c",0))return new Decimal(1);
        if(player.ma.points.gte(6))return new Decimal(1);
        if(hasMilestone("h",6))return new Decimal(6).min(Decimal.sub(8.5,player.points.div(4)).max(1));
        return new Decimal(6)
    },
    resource: "增强点数",
    baseResource: "点数",
    baseAmount() {return player.points},
    type: "normal",
    exponent(){
        if(player.ma.points.gte(6) && player.points.gte(26))return player.points.pow(player.points.sub(10).div(10).min(2)).add(player.points.sub(20).mul(5).min(100));
        if(player.ma.points.gte(6))return player.points.pow(1.6).add(30);
        if(hasMilestone("h",6))return new Decimal(30).max(player.points.pow(1.5));
        return 30;
    },
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade("e",22))mult=mult.mul(buyableEffect("e",11)[2]);
        if(hasUpgrade("e",24))mult=mult.mul(upgradeEffect("e",24));
        if(hasMilestone("sp",17))mult = mult.mul(player.sp.points.add(1));
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    branches: ["b","g"],
    layerShown(){return player.s.unlocked},
    hotkeys: [
    {key: "e", description: "E: 重置获取增强点数", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = []
        if (player.q.unlocked) keep.push("milestones")
        if (hasMilestone("q",4)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades:{
        rows: 3,
        cols: 4,
        11: {
            title: "第二行协同",
            description: "助推器与生成器互相提升",
            cost() { return new Decimal(10000) },
            unlocked() { return player.e.unlocked },
            effect() { 
                let exp = 1
                return {g: player.b.points.add(1).log10().pow(exp), b: player.g.points.add(1).log10().add(hasUpgrade("e",14)?1:0).pow(exp)} 
            },
            effectDisplay() { return "+"+format(tmp.e.upgrades[11].effect.g)+" 生成器基础, "+(hasUpgrade("e",14)?"":"+")+format(tmp.e.upgrades[11].effect.b)+(hasUpgrade("e",14)?"x":"")+" 助推器基础" },
            formula: "log(x+1)",
        },
        12: {
            title: "增强声望",
            description: "总增强点数提升声望点数获取",
            cost() { return new Decimal(40000) },
            unlocked() { return hasUpgrade("e", 11) },
            effect() { 
                let ret = player.e.total.add(1).pow(1.5) 
                return ret
            },
            effectDisplay() { return format(tmp.e.upgrades[12].effect)+"倍" },
        },
        13: {
            title: "增强+",
            description: "获得1个免费增强器",
            cost() { return new Decimal(3e6) },
            unlocked() { return hasUpgrade("e", 11) },
        },
        14: {
            title: "更多乘法",
            description: "<b>第二行协同</b>改为乘算助推器基础而非相加",
            cost() { return new Decimal(1e13) },
            unlocked() { return hasUpgrade("e", 11) },
        },
        21: {
            title: "增强++",
            description: "再获得2个免费增强器",
            cost() { return new Decimal(3e7) },
            unlocked() { return hasUpgrade("e", 13) },
        },
        22: {
            title: "增强反转",
            description: "增强器效果更好并增加新效果",
            cost() { return new Decimal(1e9) },
            unlocked() { return hasUpgrade("e", 13) },
        },
        23: {
            title: "进入E空间",
            description: "空间能量提供免费增强器",
            cost() { return new Decimal(1e17) },
            unlocked() { return hasUpgrade("e", 22) },
            effect() {
                let eff = player.s.points.div(15);
                return eff;
            },
            effectDisplay() { return "+"+format(tmp.e.upgrades[23].effect) },
        },
        24: {
            title: "怪物成长",
            description: "助推器与生成器提升增强点数获取",
            cost() { return new Decimal(1e15) },
            unlocked() { return hasUpgrade("e", 22) },
            effect() { return Decimal.pow(1.1, player.b.points.plus(player.g.points).pow(0.5)) },
            effectDisplay() { return format(tmp.e.upgrades[24].effect)+"倍" },
        },
        31: {
            title: "放大",
            description: "增强器效果更好",
            cost() { return new Decimal("1e1400") },
            unlocked() { return player.ma.points.gte(6) },
        },
        32: {
            title: "补充",
            description: "最佳超级点数提供免费增强器",
            cost() { return new Decimal("1e1777") },
            unlocked() { return player.ma.points.gte(6) },
            effect() { return player.sp.best.plus(1).log10().div(50) },
            effectDisplay() { return "+"+format(tmp[this.layer].upgrades[this.id].effect) },
        },
        33: {
            title: "增强",
            description: "增强器效果更好",
            cost() { return new Decimal("1e4250") },
            unlocked() { return player.ma.points.gte(6) },
        },
        34: {
            title: "强化",
            description: "增强器更便宜",
            cost() { return new Decimal("1e2333") },
            unlocked() { return player.ma.points.gte(6) },
        },
    },
    buyables: {
        rows: 1,
        cols: 1,
        11: {
            title: "增强器",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(hasUpgrade("e",34)?1.9:hasMilestone("h",27)?2:10, x.pow(1.5))
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                if(hasUpgrade("e",13))x=x.add(1);
                if(hasUpgrade("e",21))x=x.add(2);
                if(hasUpgrade("e",23))x=x.add(upgradeEffect("e",23));
                if(hasUpgrade("e",32))x=x.add(upgradeEffect("e",32));
                if(hasUpgrade("q",22))x=x.add(upgradeEffect("q",22));
                if(inChallenge("h",31))x=new Decimal(0);
                let eff = [];
                eff[0]=x;
                eff[1]=x;
                eff[2]=new Decimal(1);
                
                if(hasUpgrade("e",33)){
                    eff[0]=eff[0].pow(8/7);
                    eff[1]=eff[1].pow(8/7);
                    eff[2]=Decimal.pow(challengeEffect("h",31).mul(buyableEffect("m",22)).mul(2),x);
                }else if(hasUpgrade("e",31)){
                    eff[0]=eff[0].pow(1.125);
                    eff[1]=eff[1].pow(1.125);
                    eff[2]=Decimal.pow(challengeEffect("h",31).mul(buyableEffect("m",22)).mul(2),x);
                }else if(hasMilestone("m",7)){
                    eff[0]=eff[0].pow(10/9);
                    eff[1]=eff[1].pow(10/9);
                    eff[2]=Decimal.pow(challengeEffect("h",31).mul(buyableEffect("m",22)).mul(2),x);
                }else if(hasUpgrade("e",22)){
                    eff[0]=eff[0].pow(1.1);
                    eff[1]=eff[1].pow(1.05);
                    eff[2]=Decimal.pow(challengeEffect("h",31).mul(2),x);
                }
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "你有 "+formatWhole(player[this.layer].buyables[this.id])+" 增强器\n\
                它们为声望点数指数增加 "+format(data.effect[1])+"\n\
                为助推器/生成器基础增加 "+format(data.effect[0])+(hasUpgrade("e",22)?"\n\
                将增强点数获取乘"+format(data.effect[2])+"倍":"")+"\n\
                下一个增强器成本: " + format(data.cost) + " 增强点数";
            },
            unlocked() { return true }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
            },
            style: {'height':'222px'},
        },
    },
    passiveGeneration() { return hasMilestone("q",3)?1:0 },
    update(diff){
         if(hasMilestone("q",9)){
                var target=player.e.points.add(1).log(hasUpgrade("e",34)?1.9:hasMilestone("h",27)?2:10).pow(1/1.5).add(1).floor();
                if(target.gt(player.e.buyables[11])){
                    player.e.buyables[11]=target;
                }
         }
     },
    marked: function(){return player.ma.points.gte(6)}
});

addLayer("sb", {
    name: "超级助推器",
    symbol: "SB",
    position: 0,
    row: 2,
    color: "#504899",
    requires() {
if(hasMilestone("c",0))return new Decimal(1);
        if(hasMilestone("sp",20))return new Decimal(10).sub(player.sp.points.add(10).log10().sub(200).max(0).div(10)).max(1);
        if(player.ma.points.gte(7))return new Decimal(12); 
        return new Decimal(24)
    },
    resource: "超级助推器",
    baseResource: "助推器",
    baseAmount() {return player.b.points},
    roundUpCost: true,
    type: "static",
    branches: ["b"],
    exponent() { return 1 },
    base() { return 1.08 },
    layerShown(){return player.t.unlocked&&player.e.unlocked&&player.s.unlocked},
    effectBase() {
        let base = new Decimal(1.25);
        if(player.ma.points.gte(7))base = new Decimal(1.35);
        if(hasMilestone("l",2))base = base.add(buyableEffect("l",11)).sub(1);
        base = base.mul(tmp.en.swEff);
        return base
    },
    effect() {
        if (!player[this.layer].unlocked) return new Decimal(1);
        return Decimal.pow(this.effectBase(), player.sb.points).max(0);
    },
    effectDescription() {
        return "将助推器基础乘"+format(tmp.sb.effect)+"倍"+(tmp.nerdMode?("\n ("+format(tmp.sb.effectBase)+"倍每个)"):"")
    },
    doReset(resettingLayer){ 
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        first: 0,
        auto: false,
    }},
    hotkeys: [
    {key: "B", description: "Shift+B: 重置获取超级助推器", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    canBuyMax() { return hasMilestone("q",7) },
    autoPrestige() { return hasMilestone("h",0) },
    resetsNothing() { return hasMilestone("h",0) },
    marked: function(){return player.ma.points.gte(6)}
});

addLayer("sg", {
    name: "超级生成器",
    symbol: "SG",
    position: 4,
    row: 2,
    color: "#248239",
    requires(){
if(hasMilestone("c",0))return new Decimal(1);
        if(hasMilestone("sp",20))return new Decimal(10).sub(player.sp.points.add(10).log10().sub(200).max(0).div(10)).max(1);
        if(player.ma.points.gte(11))return new Decimal(12); 
        if(hasUpgrade("ss",21))return new Decimal(24);
        return new Decimal(70);
    },
    resource: "超级生成器",
    baseResource: "生成器",
    baseAmount() {return player.g.points},
    roundUpCost: true,
    type: "static",
    branches: ["g"],
    exponent() { return 1 },
    base() { 
        if(player.ma.points.gte(11))return 1.08; return 1.1 },
    layerShown(){return player.ss.unlocked},
    effectBase() {
        let base = new Decimal(1.05);
        if(player.ma.points.gte(11))base = new Decimal(1.06);
        if(hasUpgrade("g",31))base = base.mul(upgradeEffect("g",31));
        if(hasMilestone("ne",1))base = base.mul(tmp.ne.thoughtEff2);
        return base
    },
    effect() {
        if (!player[this.layer].unlocked) return new Decimal(1);
        return Decimal.pow(this.effectBase(), player.sg.points).max(0);
    },
    effectDescription() {
        return "将生成器基础乘"+format(tmp.sg.effect)+"倍"+(tmp.nerdMode?("\n ("+format(tmp.sg.effectBase)+"倍每个)"):"")
    },
    doReset(resettingLayer){ 
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        first: 0,
        auto: false,
    }},
    hotkeys: [
    {key: "G", description: "Shift+G: 重置获取超级生成器", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    canBuyMax() { return hasUpgrade("ss",21) },
    autoPrestige() { return hasMilestone("ss",1) },
    resetsNothing() { return hasMilestone("ss",1) },
    marked: function(){return player.ma.points.gte(11)}
});

addLayer("q", {
    name: "特性",
    symbol: "Q",
    position: 2,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        energy: new Decimal(0),
        auto: false,
        first: 0,
        pseudoUpgs: [],
    }},
    color: "#c20282",
    requires(){  if(hasMilestone("c",0))return new Decimal(1);return new Decimal(hasMilestone("m",4)?1:1e40)},
    resource: "特性",
    baseResource: "生成器能量",
    baseAmount() {return player.g.power},
    type: "normal",
    exponent() { return new Decimal(0.1) },
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("q", 14)) mult = mult.times(upgradeEffect("q", 14).q);

        if(player.m.unlocked)mult = mult.mul(tmp.m.hexEff);
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    hotkeys: [
        {key: "q", description: "Q: 重置获取特性", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        let b=player.q.buyables[12];
        if(hasMilestone("m",2))keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
            player.q.buyables[12]=b;
    },
    layerShown(){return player.sb.unlocked},
    branches: ["e"],
    enGainMult() {
        let mult = new Decimal(1);
        if (hasUpgrade("q", 11)) mult = mult.times(upgradeEffect("q", 11));
        if (hasUpgrade("q", 21)) mult = mult.times(upgradeEffect("q", 21));
        if (player.o.unlocked) mult = mult.times(buyableEffect("o", 12));
        mult = mult.mul(tmp.ba.negBuff);
        mult = mult.mul(tmp.ps.soulEff);
        return mult;
    },
    enGainExp() {
        let exp = player.q.buyables[11].sub(1);
        if(hasUpgrade("q",23))exp = player.q.buyables[11].add(player.q.buyables[12].add(1).div(4).floor().sqrt());
        return exp;
    },
    enEff() {
        if (!player[this.layer].unlocked || inChallenge("h",31)) return new Decimal(1);
        let eff = softcap(player.q.energy,new Decimal(1e120),0.25).plus(1).pow(2);
        if(player.m.unlocked)eff=player.q.energy.plus(1);
        return eff;
    },
    update(diff) {
        if (tmp.q.enGainExp.gte(0)) player.q.energy = player.q.energy.plus(new Decimal(player.timePlayed).times(tmp.q.enGainMult).pow(tmp.q.enGainExp).times(player.q.buyables[11]).times(diff));
     if(hasMilestone("ba",2)){
            var target=player.q.points.add(1).log(2).pow(1/2).add(1).floor();
            if(target.gt(player.q.buyables[11])){
                player.q.buyables[11]=target;
            }
     }
    },
    tabFormat: {
        "Main Tab": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
    function() {return '你有 ' + formatWhole(player.g.power)+' 生成器能量'},
    {}],
["display-text",
    function() {return '你有 ' + formatWhole(player.q.best)+' 最高特性数'},
    {}],
["display-text",
    function() {return '你有 ' + formatWhole(player.q.total)+' 总特性数'},
    {}],
"blank",
["display-text",
    function() {return '你有 ' + formatWhole(player.q.energy)+' 特性能量(由特性层生成)，将点数获取和生成器能量获取乘以' + format(tmp.q.enEff)+'倍'},
    {}],
                "blank",
                "buyables", "blank", "blank",
                "upgrades"]
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
["display-text",
    function() {return '你拥有 ' + formatWhole(player.g.power)+' 生成器能量'},
    {}],
                "milestones"],
        },
    },
    milestones: {
        0: {
            requirementDescription: "1特性",
            done() { return player.q.best.gte(1)},
            effectDescription: "保留第三行里程碑和第一、二行升级",
        },
        1: {
            requirementDescription: "2特性",
            done() { return player.q.best.gte(2)},
            effectDescription: "可以购买最大时间胶囊",
        },
        2: {
            requirementDescription: "3特性",
            done() { return player.q.best.gte(3)},
            effectDescription: "可以购买最大空间能量",
        },
        3: {
            requirementDescription: "10特性",
            done() { return player.q.best.gte(10)},
            effectDescription: "每秒获得100%增强点数",
        },
        4: {
            requirementDescription: "100特性",
            done() { return player.q.best.gte(100)},
            effectDescription: "保留第三行升级",
        },
        5: {
            requirementDescription: "200特性",
            done() { return player.q.best.gte(200)},
            effectDescription: "自动购买时间胶囊，时间胶囊重置不影响任何内容",
        },
        6: {
            requirementDescription: "300特性",
            done() { return player.q.best.gte(300)},
            effectDescription: "自动购买空间能量，空间能量重置不影响任何内容",
        },
        7: {
            requirementDescription: "400特性",
            done() { return player.q.best.gte(400)},
            effectDescription: "可以购买最大超级助推器",
        },
        8: {
            requirementDescription: "10000特性",
            done() { return player.q.best.gte(10000)},
            effectDescription: "自动购买额外时间胶囊",
        },
        9: {
            requirementDescription: "20000特性",
            done() { return player.q.best.gte(20000)},
            effectDescription: "自动购买增强器",
        },
        10: {
            requirementDescription: "30000特性",
            done() { return player.q.best.gte(30000)},
            effectDescription: "自动购买空间建筑1",
        },
        11: {
            requirementDescription: "40000特性",
            done() { return player.q.best.gte(40000)},
            effectDescription: "自动购买空间建筑2",
        },
        12: {
            requirementDescription: "4000000特性",
            done() { return player.q.best.gte(4000000)},
            effectDescription: "时间胶囊基础+1",
        },
    },
    buyables: {
        rows: 1,
        cols: 2,
        11: {
            title: "特性层",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(2, x.pow(2))
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "你有 "+format(player[this.layer].buyables[this.id])+" 特性层<br>"+
                "它们每秒生产 "+format(new Decimal(player.timePlayed).times(tmp.q.enGainMult).pow(tmp.q.enGainExp).times(player.q.buyables[11]))+" 特性能量<br>"+
                "下一个特性层成本: " + format(data.cost) + " 特性";
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'height':'222px'},
        },
        12: {
            title: "特性改进",
            cost(x=player[this.layer].buyables[this.id]) {
                if(hasUpgrade("q",35))return Decimal.pow(10,x.pow(2).mul(1000));
                let cost = Decimal.pow(hasUpgrade("q",44)?"1e115000":hasUpgrade("q",42)?"1e135000":"1e145000", x.div(10).add(1).pow(2))
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "你有 "+format(player[this.layer].buyables[this.id])+" 特性改进<br>"+
                "下一个效果: "+(["<b>Row 4 Synergy</b> is better.","<b>Quirk City</b> is better.","<b>The Waiting Game</b> is better.","<b>Infinite Possibilities</b> is better."])[player[this.layer].buyables[this.id].toNumber()%4]+
                "<br>下一个特性改进成本: " + format(data.cost) + " 特性能量";
            },
            canAfford() {
                return player[this.layer].energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].energy = player[this.layer].energy.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            unlocked(){
                return hasUpgrade("q",41);
            },
            style: {'height':'222px'},
        },
    },
    upgrades: {
        rows: 4,
        cols: 5,
        11: {
            title: "特性中心",
            description: "总特性乘算特性层基础(由已购买的特性升级提升)",
            cost() { return new Decimal(1e18) },
            unlocked() { return hasMilestone("h", 10) },
            effect() { return player.q.total.plus(1).log10().plus(1).pow(player.q.upgrades.length) },
            effectDisplay() { return format(tmp.q.upgrades[11].effect)+"倍" },
        },
        12: {
            title: "回到第二行",
            description: "总特性乘算助推器/生成器基础",
            cost() { return new Decimal(1e22) },
            unlocked() { return hasUpgrade("q", 11) },
            effect() { return player.q.total.plus(1).log10().plus(1).pow(0.1) },
            effectDisplay() { return format(tmp.q.upgrades[12].effect)+"倍" },
        },
        13: {
            title: "跳过第二跳过",
            description: "生成器能量效果提升为1.25次方",
            cost() { return new Decimal(5e73) },
            unlocked() { return hasUpgrade("q", 11) },
        },
        14: {
            title: "第四行协同",
            description: "阻碍精神与特性互相提升获取",
            cost() { return new Decimal(1e90) },
            unlocked() { return hasUpgrade("q", 12)||hasUpgrade("q", 13) },
            effect() { 
                let q = player.q.points;
                let h = player.h.points;
                let hmul=Decimal.pow(10,q.plus(10).log10().pow(0.5)).pow(player.q.buyables[12].add(3).div(4).floor().sqrt());
                let qmul=Decimal.pow(10,h.plus(10).log10().pow(0.5)).pow(player.q.buyables[12].add(3).div(4).floor().sqrt());
                if(hasUpgrade("q",24))return {
                    h: q.plus(1).root(20).pow(player.ma.points.gte(8)?1.6:1).mul(hmul),
                    q: h.plus(1).root(40).pow(player.ma.points.gte(8)?1.6:1).mul(qmul),
                };
                return {
                    h: q.plus(1).root(50).mul(hmul),
                    q: h.plus(1).root(100).mul(qmul),
                };
            },
            effectDisplay() { return "H: "+format(tmp.q.upgrades[14].effect.h)+"倍, Q: "+format(tmp.q.upgrades[14].effect.q)+"倍" },
        },
        15: {
            title: "特性扩展",
            description: "基于特性的阻碍精神效果基于特性能量提升",
            cost() { return new Decimal("1e25255") },
            unlocked() { return player.ma.points.gte(8) },
        },
        21: {
            title: "特性城市",
            description: "超级助推器乘算每个特性层的生产",
            cost() { return new Decimal(1e280) },
            unlocked() { return hasUpgrade("q", 11)&&hasUpgrade("q", 13) },
            effect() { return Decimal.pow(1.1, player.sb.points).pow(player.q.buyables[12].add(2).div(4).floor().sqrt().add(1)) },
            effectDisplay() { return format(tmp.q.upgrades[21].effect)+"倍" },
        },
        22: {
            title: "无限可能",
            description: "总特性提供免费额外增强器",
            cost() { return new Decimal("1e920") },
            unlocked() { return hasUpgrade("q", 12)&&hasUpgrade("q", 14) },
            effect() { return player.q.total.plus(1).log10().plus(1).log10().mul(player.q.buyables[12].div(4).floor().sqrt().add(1)); },
            effectDisplay() { return "+"+format(tmp.q.upgrades[22].effect) },
        },
        23: {
            title: "等待游戏",
            description(){
                if(player.q.buyables[12].gte(3))return "增加 "+format(player.q.buyables[12].add(1).div(4).floor().sqrt().add(1))+" 免费特性层";
                return "增加1个免费特性层";
            },
            cost() { return new Decimal("1e1010") },
            unlocked() { return hasUpgrade("q", 13)&&hasUpgrade("q", 21) },
        },
        24: {
            title: "指数疯狂",
            description(){ if(player.ma.points.gte(8))return "<b>第四行协同</b>效果提升^4"; return "<b>第四行协同</b>效果提升^2.5"},
            cost() { return new Decimal("1e1135") },
            unlocked() { return hasUpgrade("q", 14)&&hasUpgrade("q", 22) },
        },
        25: {
            title: "神经元提升",
            description: "神经元需求降低至1且信号获取翻倍",
            cost() { return new Decimal("1e117500") },
            unlocked() { return player.r.unlocked },
        },
        31: {
            title: "缩放软化",
            description: "T/S层缩放基于特性层减弱",
            cost() { return new Decimal("1e1460") },
            unlocked() { return hasUpgrade("q", 21)&&hasUpgrade("q", 23) },
        },
        32: {
            title: "三元超空间",
            description: "空间建筑4效果改变",
            cost() { return new Decimal("1e2100") },
            unlocked() { return hasUpgrade("q", 22)&&hasUpgrade("q", 24) },
        },
        33: {
            title: "折扣三",
            description: "助推器更便宜",
            cost() { return new Decimal("1e2600") },
            unlocked() { return hasUpgrade("q", 32) },
        },
        34: {
            title: "助推器疯狂",
            description: "<b>伪助推</b>乘算助推器基础而非相加",
            cost() { return new Decimal("1e4800") },
            unlocked() { return hasUpgrade("q", 33) },
        },
        35: {
            title: "千年能力",
            description: "特性改进更便宜",
            cost() { return new Decimal("1e188800") },
            unlocked() { return player.r.unlocked },
        },
        41: {
            title: "更特性",
            description: "解锁特性改进",
            cost() { return new Decimal("1e44000") },
            unlocked() { return player.ma.points.gte(8) },
        },
        42: {
            title: "改进提升",
            description: "特性改进更便宜",
            cost() { return new Decimal("1e63000") },
            unlocked() { return player.ma.points.gte(8) },
        },
        43: {
            title: "神经元提升II",
            description: "神经元更便宜且信号获取翻倍",
            cost() { return new Decimal("1e123456") },
            unlocked() { return player.r.unlocked },
        },
        44: {
            title: "大量改进",
            description: "特性改进更便宜",
            cost() { return new Decimal("1e134250") },
            unlocked() { return player.r.unlocked },
        },
        45: {
            title: "反阻碍",
            description: "基于特性的阻碍精神效果基于特性提升",
            cost() { return new Decimal("1e212000") },
            unlocked() { return player.r.unlocked },
        },
    },
    passiveGeneration() { return hasMilestone("ba",6)?1:0 },
    marked: function(){return player.ma.points.gte(8)}
});


addLayer("h", {
    name: "阻碍精神",
    symbol: "H",
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        challenges: {}
    }},
    color: "#a14040",
    requires(){return new Decimal(hasMilestone("m",4)?1:1e15)},
    resource: "阻碍精神",
    baseResource: "时间能量",
    baseAmount() {return player.t.power},
    type: "normal",
    exponent() { return new Decimal(0.25) },
    gainMult() {
        mult = new Decimal(1)
        if (hasUpgrade("q", 14)) mult = mult.times(upgradeEffect("q", 14).h);
        if(player.m.unlocked)mult = mult.mul(tmp.m.hexEff);
        return mult
    },
    gainExp() { return new Decimal(1) },
    branches: ["t"],
    row: 3,
    hotkeys: [
        {key: "h", description: "H: 重置获取阻碍精神", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.q.unlocked},
    doReset(resettingLayer){ 
            let keep = ["milestones"];
            keep.push("challenges");
            if (layers[resettingLayer].row > this.row) {
                layerDataReset(this.layer, keep)
            }
    },
    effect() { 
        if(!player.h.unlocked)return new Decimal(1);
        let eff = player.h.points.times(player.points.add(1).pow(hasUpgrade("q",15)?player.q.energy.add(10).log10().sqrt().add(1):1).pow(hasUpgrade("q",45)?player.q.points.add(10).log10().pow(0.1).add(1):1)).add(1).pow(2);
        return eff;
    },
    effectDescription() {
        return "将点数 & 时间能量获取乘" + format(tmp.h.effect) + "倍 (由点数提升)"
    },
    milestones: {
        0: {
            requirementDescription: "100阻碍精神",
            done() { return player.h.best.gte(100)},
            effectDescription: "自动购买超级助推器，超级助推器重置不影响任何内容",
        },
        1: {
            requirementDescription: "500阻碍精神",
            done() { return player.h.best.gte(500)},
            effectDescription: "解锁第1个挑战",
        },
        2: {
            requirementDescription: "在第一个挑战中获得3.9点",
            done() { return player.h.challenges[11]>=3.9},
            effectDescription: "助推器更便宜",
        },
        3: {
            requirementDescription: "在第一个挑战中获得4.1点",
            done() { return player.h.challenges[11]>=4.1},
            effectDescription: "解锁第2个挑战",
        },
        4: {
            requirementDescription: "在第二个挑战中获得8.4点",
            done() { return player.h.challenges[12]>=8.4},
            effectDescription: "第一个挑战效果由阻碍精神提升",
        },
        5: {
            requirementDescription: "在第一个挑战中获得4.3点",
            done() { return player.h.challenges[11]>=4.3},
            effectDescription: "声望点数获取指数基于你的点数变得更好",
        },
        6: {
            requirementDescription: "在第二个挑战中获得8.6点",
            done() { return player.h.challenges[12]>=8.6},
            effectDescription: "在10点以上增加增强点数获取",
        },
        7: {
            requirementDescription: "在第二个挑战中获得8.7点",
            done() { return player.h.challenges[12]>=8.7},
            effectDescription: "解锁第3个挑战",
        },
        8: {
            requirementDescription: "在第三个挑战中获得9.3点",
            done() { return player.h.challenges[21]>=9.3},
            effectDescription: "<b>外部协同</b>和<b>双重反转</b>效果更好",
        },
        9: {
            requirementDescription: "在第二个挑战中获得8.95点",
            done() { return player.h.challenges[12]>=8.95},
            effectDescription: "第一行助推器升级改为乘算助推器基础而非相加",
        },
        10: {
            requirementDescription: "在第三个挑战中获得9.4点",
            done() { return player.h.challenges[21]>=9.4},
            effectDescription: "解锁特性升级",
        },
        11: {
            requirementDescription: "在第二个挑战中获得9点",
            done() { return player.h.challenges[12]>=9},
            effectDescription: "助推器/生成器成本缩放基于第二个挑战的最高点数减弱",
        },
        12: {
            requirementDescription: "在第三个挑战中获得10点",
            done() { return player.h.challenges[21]>=10},
            effectDescription: "解锁第4个挑战",
        },
        13: {
            requirementDescription: "在第四个挑战中获得10.5点",
            done() { return player.h.challenges[22]>=10.5},
            effectDescription: "时间胶囊/空间能量成本缩放基于第四个挑战的最高点数减弱",
        },
        14: {
            requirementDescription: "在第一个挑战中获得5点",
            done() { return player.h.challenges[11]>=5},
            effectDescription: "点数缩放基于第一个挑战的最高点数减弱",
        },
        15: {
            requirementDescription: "在第二个挑战中获得10.7点",
            done() { return player.h.challenges[12]>=10.7},
            effectDescription: "第二个挑战效果更好",
        },
        16: {
            requirementDescription: "在第四个挑战中获得12点",
            done() { return player.h.challenges[22]>=12},
            effectDescription: "解锁第5个挑战",
        },
        17: {
            requirementDescription: "在第一个挑战中获得6点",
            done() { return player.h.challenges[11]>=6},
            effectDescription: "第三个挑战效果更好",
        },
        18: {
            requirementDescription: "在第五个挑战中获得14点",
            done() { return player.h.challenges[31]>=14},
            effectDescription: "解锁第6个挑战",
        },
        19: {
            requirementDescription: "在第六个挑战中获得15点",
            done() { return player.h.challenges[32]>=15},
            effectDescription: "解锁第7个挑战",
        },
        20: {
            requirementDescription: "在第二个挑战中获得13点",
            done() { return player.h.challenges[12]>=13},
            effectDescription: "助推器更便宜",
        },
        21: {
            requirementDescription: "在第四个挑战中获得16点",
            done() { return player.h.challenges[22]>=16},
            effectDescription: "第二个时间能量效果更好",
        },
        22: {
            requirementDescription: "在第七个挑战中获得6.5点",
            done() { return player.h.challenges[41]>=6.5},
            effectDescription: "解锁第8个挑战",
        },
        23: {
            requirementDescription: "在第六个挑战中获得17点",
            done() { return player.h.challenges[32]>=17},
            effectDescription: "第六个挑战效果更好",
        },
        24: {
            requirementDescription: "在第一个挑战中获得8点",
            done() { return player.h.challenges[11]>=8},
            effectDescription: "第二个挑战效果由阻碍精神提升",
        },
        25: {
            requirementDescription: "在第六个挑战中获得17.5点",
            done() { return player.h.challenges[32]>=17.5},
            effectDescription: "太阳能量效果平方",
        },
        26: {
            requirementDescription: "在第三个挑战中获得16.15点",
            done() { return player.h.challenges[21]>=16.15},
            effectDescription: "第三个挑战效果由阻碍精神提升",
        },
        27: {
            requirementDescription: "在第五个挑战中获得17.2点",
            done() { return player.h.challenges[31]>=17.2},
            effectDescription: "增强器更便宜",
        },
        28: {
            requirementDescription: "在第二个挑战中获得16点",
            done() { return player.h.challenges[12]>=16},
            effectDescription: "第二个挑战9点里程碑效果更好",
        },
        29: {
            requirementDescription: "在第八个挑战中获得15.6点",
            done() { return player.h.challenges[42]>=15.6},
            effectDescription: "解锁最后一个(第9个)挑战",
        },
        30: {
            requirementDescription: "在第九个挑战中获得6点",
            done() { return player.h.challenges[51]>=6},
            effectDescription: "第六个挑战效果更好",
        },
        31: {
            requirementDescription: "在第一个挑战中获得9点",
            done() { return player.h.challenges[11]>=9},
            effectDescription: "第一个挑战增加新奖励",
        },
        32: {
            requirementDescription: "在第四个挑战中获得18.5点",
            done() { return player.h.challenges[22]>=18.5},
            effectDescription: "<b>反永恒</b>效果更好",
        },
        33: {
            requirementDescription: "在第六个挑战中获得19.1点",
            done() { return player.h.challenges[32]>=19.1},
            effectDescription: "第六个挑战效果更好",
        },
        34: {
            requirementDescription: "在第七个挑战中获得7.8点",
            done() { return player.h.challenges[41]>=7.8},
            effectDescription: "第七个挑战效果由阻碍精神提升",
        },
        35: {
            requirementDescription: "在第四个挑战中获得19.6点",
            done() { return player.h.challenges[22]>=19.6},
            effectDescription: "第四个挑战10.5点里程碑效果更好",
        },
        36: {
            requirementDescription: "在第八个挑战中获得18点",
            done() { return player.h.challenges[42]>=18},
            effectDescription: "第八个挑战效果由阻碍精神提升",
        },
        37: {
            requirementDescription: "在第九个挑战中获得7.7点",
            done() { return player.h.challenges[51]>=7.7},
            effectDescription: "第五个挑战效果更好",
        },
        38: {
            requirementDescription: "在第九个挑战中获得8点",
            done() { return player.h.challenges[51]>=8},
            effectDescription: "第九个挑战效果由阻碍精神提升",
        },
        39: {
            requirementDescription: "在第四个挑战中获得21点",
            done() { return player.h.challenges[22]>=21},
            effectDescription: "第四个挑战效果由阻碍精神提升",
        },
        40: {
            requirementDescription: "在第二个挑战中获得21点",
            done() { return player.h.challenges[12]>=21},
            effectDescription: "助推器更便宜",
        },
        41: {
            requirementDescription: "在第一个挑战中获得11点",
            done() { return player.h.challenges[11]>=11},
            effectDescription: "第一个挑战增加新奖励",
        },
        42: {
            requirementDescription: "在第十个挑战中获得3.3点",
            unlocked(){return player.ma.points.gte(9)},
            done() { return player.h.challenges[52]>=3.3},
            effectDescription: "<b>反永恒</b>效果更好",
        },
        43: {
            requirementDescription: "在第十个挑战中获得3.375点",
            unlocked(){return player.ma.points.gte(9)},
            done() { return player.h.challenges[52]>=3.375},
            effectDescription: "<b>反永恒</b>效果更好",
        },
        44: {
            requirementDescription: "在第二个挑战中获得24点",
            unlocked(){return player.ma.points.gte(9)},
            done() { return player.h.challenges[12]>=24},
            effectDescription: "阻碍精神挑战提升提升能量",
        },
        45: {
            requirementDescription: "在第十个挑战中获得3.4点",
            unlocked(){return player.ma.points.gte(9)},
            done() { return player.h.challenges[52]>=3.4},
            effectDescription: "<b>反永恒</b>效果更好",
        },
        46: {
            requirementDescription: "在第四个挑战中获得25点",
            unlocked(){return player.ma.points.gte(9)},
            done() { return player.h.challenges[22]>=25},
            effectDescription: "<b>反永恒</b>效果更好",
        },
        47: {
            requirementDescription: "在第十个挑战中获得3.425点",
            unlocked(){return player.ma.points.gte(9)},
            done() { return player.h.challenges[52]>=3.425},
            effectDescription: "第六个挑战效果更好",
        },
        48: {
            requirementDescription: "在第一个挑战中获得12.5点",
            done() { return player.h.challenges[11]>=12.5},
            effectDescription: "时间胶囊和空间能量更便宜",
        },
        49: {
            requirementDescription: "在第一个挑战中获得13点",
            done() { return player.h.challenges[11]>=13},
            effectDescription: "生成器更便宜",
        },
 50: {
                requirementDescription: "在第十个挑战中获得3.475点",
                unlocked(){return player.ma.points.gte(9)},
                done() { return player.h.challenges[52]>=3.475},
                effectDescription: "<b>反永恒</b>效果更好",
            },
    },
    getHCBoost(){
        if(inChallenge("ne",11))return new Decimal(0);
        return player.h.points.add(1).log10().add(1).log10().add(1);
    },
    challenges: {
        rows: 5,
        cols: 2,
        11: {
            name: "点数减半(1)",
            challengeDescription: "你的点数被除以2",
            unlocked() { return hasMilestone("h",1) },
            rewardDescription(){
                if(player.h.challenges[11]>=11)return "基于本挑战最高点数增加声望、超级点数和SP升级'超级助推'的基础指数";
                if(player.h.challenges[11]>=9)return "基于本挑战最高点数增加声望和超级点数指数";
                return "基于本挑战最高点数增加声望指数"
            },
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[11],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(0);
                let ret=new Decimal(player.h.challenges[11]).mul(challengeEffect("h",41)).mul(challengeEffect("h",51)).mul(challengeEffect("h",52));
                if(hasMilestone("h",4) || player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                return ret;
            },
            rewardDisplay(){return "+"+format(challengeEffect("h",11))}
        },
        12: {
            name: "第二行禁用(2)",
            challengeDescription: "助推器/生成器被禁用",
            unlocked() { return hasMilestone("h",3) },
            rewardDescription(){if(player.h.challenges[12]>=10.7)return "基于本挑战最高点数乘算助推器基础"; return "基于本挑战最高点数增加助推器基础"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[12],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[12]).mul(challengeEffect("h",42)).mul(challengeEffect("h",51)).mul(challengeEffect("h",52));
                if(hasMilestone("h",24) || player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                if(player.h.challenges[12]>=10.7)ret=ret.add(1);
                return ret;
            },
            rewardDisplay(){if(player.h.challenges[12]>=10.7)return format(challengeEffect("h",12))+"x";return "+"+format(challengeEffect("h",12))}
        },
        21: {
            name: "无声望(3)",
            challengeDescription: "你无法获取声望点数",
            unlocked() { return hasMilestone("h",7) },
            rewardDescription(){if(hasMilestone("h",17))return "基于本挑战最高点数乘算声望指数"; return "基于本挑战最高点数增加声望指数"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[21],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[21]).mul(challengeEffect("h",41)).mul(challengeEffect("h",51)).mul(challengeEffect("h",52));
                if(hasMilestone("h",26) || player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                ret = ret.sqrt();
                if(hasMilestone("h",17)){
                    ret=new Decimal(player.h.challenges[21]).mul(challengeEffect("h",41)).mul(challengeEffect("h",51)).mul(challengeEffect("h",52)).div(15);
                    if(hasMilestone("h",26) || player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                    return ret.add(1);
                }
                return ret;
            },
            rewardDisplay(){if(hasMilestone("h",17))return format(challengeEffect("h",21))+"x";return "+"+format(challengeEffect("h",21))}
        },
        22: {
            name: "永恒与无空间(4)",
            challengeDescription: "你无法获取时间能量。有效空间能量为0",
            unlocked() { return hasMilestone("h",12) },
            rewardDescription(){if(hasUpgrade("t",23))return "基于本挑战最高点数乘算时间胶囊基础"; return "基于本挑战最高点数增加时间胶囊基础"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[22],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[22]).div(10).mul(challengeEffect("h",42)).mul(challengeEffect("h",51)).mul(challengeEffect("h",52));
                if(hasUpgrade("ss",23)){
                    let mxtime=20000;
                    if(player.m.unlocked)mxtime=25000;
                    if(player.ps.unlocked)mxtime=30000;
                    if(player.sp.unlocked)mxtime=35000;
                    if(player.hs.unlocked)mxtime=40000;
                    if(player.l.unlocked)mxtime=45000;
                    if(player.i.unlocked)mxtime=50000;
                    if(player.ma.unlocked)mxtime=55000;
                    if(player.ge.unlocked)mxtime=60000;
                    if(player.mc.unlocked)mxtime=65000;
                    if(player.ne.unlocked)mxtime=70000;
                    if(player.en.unlocked)mxtime=75000;
                    if(player.r.unlocked)mxtime=80000;
                    if(player.id.unlocked)mxtime=85000;
                    if(player.ai.unlocked)mxtime=92500;
                        if(player.c.unlocked)mxtime=100000;
                        ret=ret.mul(Math.min(player.timePlayed,mxtime)/(hasMilestone("h",50)?100:("h",46)?3000:hasMilestone("h",45)?7000:hasMilestone("h",43)?10000:hasMilestone("h",42)?20000:hasMilestone("h",32)?50000:100000)+1);
                }
                if(hasMilestone("h",39) || player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                if(hasUpgrade("t",23))ret=ret.add(1);
                return ret;
            },
            rewardDisplay(){if(hasUpgrade("t",23))return format(challengeEffect("h",22))+"x"; return "+"+format(challengeEffect("h",22))}
        },
        31: {
            name: "禁用EQ(5)",
            challengeDescription: "特性能量和增强器无效",
            unlocked() { return hasMilestone("h",16) },
            rewardDescription(){return "基于本挑战最高点数乘算第三个增强器效果基础"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[31],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[31]).div(20).mul(challengeEffect("h",41)).mul(challengeEffect("h",51)).mul(challengeEffect("h",52));
                if(hasMilestone("h",37) || player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                ret = ret.add(1);
                return ret;
            },
            rewardDisplay(){return format(challengeEffect("h",31))+"x"}
        },
        32: {
            name: "黑暗区域(6)",
            challengeDescription: "太阳能量为0%。太阳能量和子空间无效",
            unlocked() { return hasMilestone("h",18) },
            rewardDescription(){return "基于本挑战最高点数乘算子空间基础"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[32],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[32]).div(hasMilestone("h",47)?1:hasMilestone("h",33)?5:hasMilestone("h",30)?10:hasMilestone("h",23)?20:50).mul(challengeEffect("h",42)).mul(challengeEffect("h",51)).mul(challengeEffect("h",52));
                let a = 4;
                if(hasMilestone("i",5))a = 1;
                if(player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost().max(a)).div(a);
                ret = ret.add(1);
                return ret;
            },
            rewardDisplay(){return format(challengeEffect("h",32))+"x"}
        },
        41: {
            name: "左翼(7)",
            challengeDescription: "同时进行第1、3、5个挑战",
            unlocked() { return hasMilestone("h",19) },
            rewardDescription(){return "第1、3、5个挑战效果更强"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[41],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[41]).div(100).mul(challengeEffect("h",51)).mul(challengeEffect("h",52));
                if(hasMilestone("h",34) || player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                ret = ret.add(1);
                return ret;
            },
            rewardDisplay(){return format(challengeEffect("h",41))+"x"},
            countsAs: [11,21,31]
        },
        42: {
            name: "右翼(8)",
            challengeDescription: "同时进行第2、4、6个挑战",
            unlocked() { return hasMilestone("h",22) },
            rewardDescription(){return "第2、4、6个挑战效果更强"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[42],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[42]).div(200).mul(challengeEffect("h",51)).mul(challengeEffect("h",52));
                if(hasMilestone("h",36) || player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                ret = ret.add(1);
                return ret;
            },
            rewardDisplay(){return format(challengeEffect("h",42))+"x"},
            countsAs: [12,22,32]
        },
        51: {
            name: "现实(9)",
            challengeDescription: "最终挑战！同时进行左翼和右翼",
            unlocked() { return hasMilestone("h",29) },
            rewardDescription(){return "前8个挑战效果都更强"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[51],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[51]).div(100).mul(challengeEffect("h",52));
                if(player.ma.points.gte(9))ret = ret.mul(layers.h.getHCBoost());
                else if(hasMilestone("h",38))ret = ret.mul(player.h.points.add(1).log10().add(1).log10().div(2).add(1));
                ret = ret.add(1);
                return ret;
            },
            rewardDisplay(){return format(challengeEffect("h",51))+"x"},
            countsAs: [11,21,31,12,22,32]
        },
        52: {
            name: "真实现实(10)",
            challengeDescription: "最终挑战！现实挑战且点数在减半后取log2(点数+1)",
            unlocked() { return player.ma.points.gte(9) },
            rewardDescription(){return "前9个挑战效果都更强"},
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player.h.challenges[52],4)},
            rewardEffect(){
                if(inChallenge("ne",11))return new Decimal(1);
                let ret=new Decimal(player.h.challenges[52]).div(200).mul(layers.h.getHCBoost()).add(1);
                return ret;
            },
            rewardDisplay(){return format(challengeEffect("h",52))+"x"},
            countsAs: [11,21,31,12,22,32],
            onEnter(){
                updateTemp();
                updateTemp();
                updateTemp();
            }
        },
    },
    update(diff){
        if(player.h.activeChallenge){
            player.h.challenges[player.h.activeChallenge]=player.points.max(player.h.challenges[player.h.activeChallenge]).toNumber();
        }
    },
    tabFormat: {
            "Main Tab": {
            content: [
                "main-display",
                ["display-text",function(){
                if(player.ma.points.gte(9))return "你的阻碍精神将所有10个挑战奖励效果提升"+format(layers.h.getHCBoost())+"倍";
                }],
                "prestige-button",
                "resource-display",
                "blank",
                "challenges"]
        },
            "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones"]
        },
    },
    passiveGeneration() { return hasMilestone("ba",5)?1:0 },
    marked: function(){return player.ma.points.gte(9)}
});

addLayer("ss", {
    name: "子空间",
    symbol: "SS",
    position: 3,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        subspace: new Decimal(0),
    }},
    color: "#e8ffff",
    requires() { 
if(hasMilestone("c",0))return new Decimal(1);
        if(hasMilestone("ne",5))return new Decimal(1);
        if(player.ne.unlocked)return new Decimal(1).add(Decimal.pow(0.9,player.ne.thoughts).mul(7));
        if(player.ma.points.gte(10))return new Decimal(10);
        return new Decimal(16);
    },
    roundUpCost: true,
    resource: "子空间能量",
    baseResource: "空间能量",
    baseAmount() {return player.s.points},
    type: "static",
    exponent() { return 1 },
    base() { return 1.1 },
    branches: ["s"],
    row: 3,
    hotkeys: [
        {key: "S", description: "Shift+S: 重置获取子空间能量", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.q.unlocked},
    milestones: {
        0: {
            requirementDescription: "1子空间能量",
            done() { return player.ss.best.gte(1)},
            effectDescription: "自动购买空间建筑3，空间能量更便宜",
        },
        1: {
            requirementDescription: "5子空间能量",
            done() { return player.ss.best.gte(5)},
            unlocked() {return player.sg.unlocked},
            effectDescription: "自动购买空间建筑4和超级生成器。超级生成器重置不影响任何内容",
        },
    },
    effBase() {
        let base = new Decimal(2);
        if (hasUpgrade("ss",32)) base=base.add(upgradeEffect("ss", 32));
        if (hasUpgrade("ss", 41)&&hasUpgrade("q",32)) base = base.plus(buyableEffect("o", 21));
        base=base.mul(challengeEffect("h",32));
        base=base.mul(buyableEffect("m",21));
        if (hasUpgrade("ss", 41)&&!hasUpgrade("q",32)) base = base.plus(buyableEffect("o", 21));
        if (hasUpgrade("s",15)&&hasUpgrade("q",32)) base = base.mul(buyableEffect("s", 14));
        if (hasUpgrade("ba",24)) base = base.mul(upgradeEffect("ba", 24));
        if(hasMilestone("l",7))base = base.mul(buyableEffect("l",13));
        if(hasMilestone("i",2))base = base.mul(player.i.points.div(10).add(1));
        if(hasMilestone("ne",1))base = base.mul(tmp.ne.thoughtEff2);
        if(hasUpgrade("t",35))base = base.mul(1.2);
            if(player.i.points.gte(33))base = base.mul(Decimal.pow(1.2,player.i.points.pow(1.1)));
            if (hasUpgrade("sp",53)) base = base.mul(upgradeEffect("sp", 53));
        return base;
    },
    effect() { 
        if (!player.ss.unlocked) return new Decimal(0);
        let gain = Decimal.pow(tmp.ss.effBase, player.ss.points).mul(player.ss.points);
        if (hasUpgrade("s",15)&&!hasUpgrade("q",32)) gain=gain.mul(buyableEffect("s", 14));
        if (hasUpgrade("ss",13)) gain=gain.mul(upgradeEffect("ss", 13));
        if (hasUpgrade("ba",11)) gain=gain.mul(upgradeEffect("ba", 11));
        if (player.o.unlocked) gain=gain.times(buyableEffect("o", 13));
        if(player.m.unlocked)gain = gain.mul(tmp.m.hexEff);
        if(player.ma.points.gte(8))gain = gain.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        if(hasMilestone("i",4))gain = gain.mul(Decimal.pow(2,player.i.points));
        return gain;
    },
    effectDescription() {
        return "每秒生成"+format(tmp.ss.effect)+"子空间"
    },
    update(diff) {
        if (player.ss.unlocked) player.ss.subspace = player.ss.subspace.plus(tmp.ss.effect.times(diff));
    },
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text",
            function() {return '你有 ' + format(player.ss.subspace) + ' 子空间，将有效空间能量乘'+format(tmp.ss.eff1)+'倍'},
                {}],
        "blank",
        "upgrades",
        "milestones",
    ],
    eff1() { 
        if(inChallenge("h", 22))return new Decimal(0);
        if(inChallenge("h", 32))return new Decimal(1);
        let eff=player.ss.subspace.plus(1).log10().plus(1).log10();
        if(hasUpgrade("ss",42))eff=player.ss.subspace.plus(1).log10().root(5);
        if(player.ma.points.gte(10))eff = eff.pow(1.25);
        if(hasUpgrade("ss",12))eff=eff.mul(upgradeEffect("ss",12));
        if(hasMilestone("l",6))eff=eff.mul(buyableEffect("o",23));
        return eff.add(1);
    },
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if(hasMilestone("m",2))keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 4,
        cols: 3,
        11: {
            title: "空间觉醒",
            description: "空间能量更便宜",
            cost() { return new Decimal(1500) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return player.ss.unlocked },
        },
        12: {
            title: "子空间觉醒",
            description: "子空间能量提升所有子空间效果",
            cost() { return new Decimal(5000) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 11) },
            effect() { 
                let eff = player.ss.points.div(2.5).plus(1).sqrt();
                return eff;
            },
            effectDisplay() { return format(tmp.ss.upgrades[12].effect.sub(1).times(100))+"%更强" },
        },
        13: {
            title: "粉碎使者",
            description: "特性提升子空间获取",
            cost() { return new Decimal(50000) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 11) },
            effect() { return player.q.points.plus(1).log10().div(10).plus(1) },
            effectDisplay() { return format(tmp.ss.upgrades[13].effect)+"倍" },
        },
        21: {
            title: "非法升级",
            description: "超级生成器更便宜，可以购买最大超级生成器",
            cost() { return new Decimal(200000) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 13) },
        },
        22: {
            title: "太阳之下",
            description: "<b>太阳核心</b>使用更好的效果公式",
            cost() { return new Decimal(1e9) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 21)&&player.o.unlocked },
        },
        23: {
            title: "反永恒",
            description: "<b>永恒与无空间(4)</b>的效果基于你玩这个游戏的总时间增加",
            cost() { return new Decimal(1e13) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 21)&&player.o.unlocked },
        },
        31: {
            title: "不再进步",
            description: "空间能量提供免费空间建筑",
            cost() { return new Decimal(1e14) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 22)||hasUpgrade("ss", 23) },
            effect() { return player.s.points.div(10).cbrt() },
            effectDisplay() { return "+"+format(tmp.ss.upgrades[31].effect) },
        },
        32: {
            title: "超越无限",
            description: "基于你的特性层增加子空间能量基础",
            cost() { return new Decimal(1e25) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 31) },
            effect() { return player.q.buyables[11].add(1).log10() },
            effectDisplay() { return "+"+format(tmp.ss.upgrades[32].effect) },
        },
        33: {
            title: "永恒太阳",
            description: "太阳核心提升太阳能量",
            cost() { return new Decimal(1e35) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 23)&&hasUpgrade("ss", 31) },
            effect() { return softcap(player.o.buyables[11].plus(1).log10().div(10),new Decimal(1.2),new Decimal(0.25)) },
            effectDisplay() { return "+"+format(tmp.ss.upgrades[33].effect.times(100))+"%" },
        },
        41: {
            title: "更多太阳",
            description: "解锁日冕波",
            cost() { return new Decimal(1e50) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasUpgrade("ss", 33) },
        },
        42: {
            title: "子-子空间",
            description: "子空间效果更好",
            cost() { return new Decimal(1e150) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasMilestone("i",1) },
        },
        43: {
            title: "非挑战加速",
            description() { return "点数获取提升为1.01次方" },
            cost() { return new Decimal(1e235) },
            currencyDisplayName: "子空间",
            currencyInternalName: "subspace",
            currencyLayer: "ss",
            unlocked() { return hasMilestone("i",1) },
        },
    },
    canBuyMax() { return hasMilestone("ba",1) },
    autoPrestige() { return hasMilestone("m",1) },
    resetsNothing() { return hasMilestone("m",1) },
    marked: function(){return player.ma.points.gte(10)}
});


addLayer("o", {
    name: "太阳能量",
    symbol: "O",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        energy: new Decimal(0),
        first: 0,
    }},
    roundUpCost: true,
    color: "#ffcd00",
    nodeStyle() {return {
        "background": (((player.o.unlocked||canReset("o")))?("radial-gradient(#ffcd00, #ff4300)"):"#bf8f8f") ,
    }},
    componentStyles: {
        "prestige-button"() {return { "background": (canReset("o"))?("radial-gradient(#ffcd00, #ff4300)"):"#bf8f8f" }},
    },
    requires() { 
if(hasMilestone("c",0))return new Decimal(1);
        let req = new Decimal(20);
        if(player.ma.points.gte(12))req=req.sub(player.o.points.add(10).log10().sqrt().min(19));
        return req;
    },
    resource: "太阳能量",
    baseResource: "超级助推器",
    baseAmount() {return player.sb.points},
    type: "normal",
    exponent() { 
        let exp = new Decimal(15);
        if(hasUpgrade("p",34))exp = exp.mul(upgradeEffect("p",34));
        if(player.ma.points.gte(12))exp = exp.mul(buyableEffect("o",32));
        exp = exp.mul(tmp.en.owEff);
        return exp;
    },
    gainMult() {
        mult = buyableEffect("o", 11);
        if(hasUpgrade("ba",14))mult = mult.mul(upgradeEffect("ba",14));
        if(player.ma.points.gte(8))mult = mult.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        mult = mult.mul(buyableEffect("r",21));
        return mult
    },
    gainExp() {
        return new Decimal(1);
    },
    row: 3,
    hotkeys: [
        {key: "o", description: "O: 重置获取太阳能量", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    layerShown(){return player.sg.unlocked },
    branches: ["sb", "t"],
    effect() { 
        return new Decimal(1).sub(Decimal.pow(0.95,player.o.points.add(1).log10().cbrt())).mul(0.1);
    },
    effect2() { 
        return player.o.points;
    },
    solEnGain() { 
            let gain = player.t.power.min("e1180000").max(1).pow(tmp.o.effect);
        if(gain.gte("1e50"))gain = Decimal.pow(10,gain.log10().mul(50).sqrt());
        gain = gain.mul(tmp.o.effect2);
        if(player.m.unlocked)gain = gain.mul(tmp.m.hexEff);
        gain = gain.mul(buyableEffect("r",21));
        return gain;
    },
    effectDescription() { return "每秒生成"+format(tmp.o.solEnGain)+"太阳能量" },

    update(diff) {
        player.o.energy = player.o.energy.plus(tmp.o.solEnGain.times(diff));
        if(hasMilestone("ba",3))player.o.buyables[11] = player.o.buyables[11].plus(tmp.o.buyables[11].gain.times(diff));
        if(hasMilestone("m",3))player.o.buyables[12] = player.o.buyables[12].plus(tmp.o.buyables[12].gain.times(diff));
        if(hasMilestone("ps",0))player.o.buyables[13] = player.o.buyables[13].plus(tmp.o.buyables[13].gain.times(diff));
        if(hasMilestone("sp",7))player.o.buyables[21] = player.o.buyables[21].plus(tmp.o.buyables[21].gain.times(diff));
        if(hasMilestone("l",4))player.o.buyables[22] = player.o.buyables[22].plus(tmp.o.buyables[22].gain.times(diff));
        if(hasMilestone("l",6))player.o.buyables[23] = player.o.buyables[23].plus(tmp.o.buyables[23].gain.times(diff));
        if(hasMilestone("l",9))player.o.buyables[31] = player.o.buyables[31].plus(tmp.o.buyables[31].gain.times(diff));
        if(player.ma.points.gte(12))player.o.buyables[32] = player.o.buyables[32].plus(tmp.o.buyables[32].gain.times(diff));
        if(player.ma.points.gte(12))player.o.buyables[33] = player.o.buyables[33].plus(tmp.o.buyables[33].gain.times(diff));
    },
    solEnEff() { 
        if(inChallenge("h", 32))return new Decimal(1);
        return player.o.energy.plus(1).pow(hasMilestone("h",25)?2:1);
    },
    solPow() {
        if(inChallenge("h", 32))return new Decimal(0);
        let pow = new Decimal(1);
        if(hasUpgrade("ba",21))pow=pow.add(upgradeEffect("ba",21));
        if(hasUpgrade("ss",33))pow=pow.add(upgradeEffect("ss",33));
        if (hasUpgrade("ss", 41))pow=pow.add(buyableEffect("o", 21));
        if(hasMilestone("l",10))pow=pow.add(buyableEffect("l", 14));
        if(player.ma.points.gte(12))pow=pow.add(1);
        if(player.ma.points.gte(14))pow=pow.add(buyableEffect("m", 31).sub(1));
        return pow;
    },
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text",
            function() {return '你有 ' + format(player.o.energy) + ' 太阳能量，将时间能量获取乘'+format(tmp.o.solEnEff)+'倍'},
                {}],
        "blank",
        "milestones",
        "blank",
        ["display-text",
            function() { return "<b>太阳能量: "+format(tmp.o.solPow.times(100))+"%</b><br>" },
                {}],
        "buyables",
        "blank"
    ],

    buyables: {
        rows: 3,
        cols: 3,
        11: {
            title: "太阳核心",
            gain() { if(hasMilestone("l",8))return player.o.points.root(1.5).mul(100).floor(); return player.o.points.div(2).root(1.5).floor() },
            effect() { 
                let amt = player[this.layer].buyables[this.id]
                if(amt.gte(1e10))amt=Decimal.pow(10,Decimal.pow(10,amt.log10().log10().cbrt()));
                return hasUpgrade("ss", 22)?(amt.plus(1).pow(tmp.o.solPow).cbrt()):(amt.plus(1).pow(tmp.o.solPow).log10().plus(1))
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("牺牲所有太阳能量获取"+formatWhole(tmp[this.layer].buyables[this.id].gain)+"太阳核心\n"+
                (hasMilestone("l",8)?"":"需求: 100太阳能量\n")+
                "数量: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将太阳能量获取乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() { return player.o.points.gte(100) || hasMilestone("l",8) },
            buy() { 
                player.o.points = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
            },
            style: {'height':'140px', 'width':'140px'},
        },
        12: {
            title: "塔科等离子体",
            gain() { if(hasMilestone("l",8))return player.o.points.times(player.o.energy).root(3).mul(100).floor(); return player.o.points.div(100).times(player.o.energy.div(2500)).root(3.5).floor() },
            effect() { 
            if(hasUpgrade("p",24))return Decimal.pow(10, player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().cbrt());
            return (player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().plus(1).log10().times(10).plus(1)) },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("牺牲所有太阳能量和太阳能量获取"+formatWhole(tmp[this.layer].buyables[this.id].gain)+"塔科等离子体\n"+
                (hasMilestone("l",8)?"":"需求: 100太阳能量和1e6太阳能量\n")+
                "数量: " + formatWhole(player[this.layer].buyables[this.id])+"\n"+
                ("效果: 将特性层基础乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() { return (player.o.points.gte(100)&&player.o.energy.gte(1000000)) || hasMilestone("l",8) },
            buy() { 
                player.o.points = new Decimal(0);
                player.o.energy = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
            },
            style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
        },
        13: {
            title: "对流能量",
            gain() { if(hasMilestone("l",8))return player.o.points.times(player.o.energy).times(player.ss.subspace).root(6).mul(100).floor(); return player.o.points.div(1e3).times(player.o.energy.div(2e5)).times(player.ss.subspace.div(10)).root(6.5).floor() },
            effect() { return player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().plus(1).pow(2.5) },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("牺牲所有太阳能量、太阳能量和子空间获取"+formatWhole(tmp[this.layer].buyables[this.id].gain)+"对流能量\n"+
                (hasMilestone("l",8)?"":"需求: 1e5太阳能量、1e9太阳能量和1e10子空间\n")+
                "数量: " + formatWhole(player[this.layer].buyables[this.id]))+"\n"+
                ("效果: 将子空间获取乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍")
                return display;
            },
            unlocked() { return player[this.layer].unlocked&&player.ss.unlocked }, 
            canAfford() { return (player.o.points.gte(1e5)&&player.o.energy.gte(1e9)&&player.ss.subspace.gte(1e10)) || hasMilestone("l",8) },
            buy() { 
                player.o.points = new Decimal(0);
                player.o.energy = new Decimal(0);
                player.ss.subspace = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
            },
            style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
        },
        21: {
            title: "日冕波",
            gain() { if(hasMilestone("l",11))return player.o.points.root(5).times(player.o.energy.root(30)).times(player.ss.subspace.root(8)).times(player.q.energy.root(675)).mul(100).floor();
                return player.o.points.div(1e10).root(5).times(player.o.energy.div(1e40).root(30)).times(player.ss.subspace.div(1e50).root(8)).times(player.q.energy.div("1e3000").root(675)).floor() },
            effect() { 
                let eff = player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().plus(1).log10();
                if(hasUpgrade("sp",24))eff = eff.mul(2);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("牺牲所有太阳能量、太阳能量、子空间和特性能量获取"+formatWhole(tmp[this.layer].buyables[this.id].gain)+"日冕波\n"+
                (hasMilestone("l",11)?"":"需求: 1e10太阳能量、1e40太阳能量、1e50子空间和1e3000特性能量\n")+
                "数量: " + formatWhole(player[this.layer].buyables[this.id]))+"\n"+("效果: 为子空间基础增加"+format(tmp[this.layer].buyables[this.id].effect)+"并将太阳能量增加"+format(tmp[this.layer].buyables[this.id].effect.times(100))+"%")
                return display;
            },
            unlocked() { return player[this.layer].unlocked&&hasUpgrade("ss", 41) }, 
            canAfford() { return (player.o.points.gte(1e10)&&player.o.energy.gte(1e40)&&player.ss.subspace.gte(1e50)&&player.q.energy.gte("1e3000")) || hasMilestone("l",11) },
            buy() { 
                player.o.points = new Decimal(0);
                player.o.energy = new Decimal(0);
                player.ss.subspace = new Decimal(0);
                player.q.energy = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
            },
            style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
        },
        22: {
            title: "新星残余",
            gain() { if(hasMilestone("l",11))return player.o.buyables[11].pow(3).floor(); return player.o.buyables[11].div(1e25).pow(3).floor() },
            effect() {
                return player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().root(10).plus(1)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return ("牺牲所有太阳核心获取"+formatWhole(data.gain)+"新星残余\n"+
                (hasMilestone("l",11)?"":"需求: 1e25太阳核心\n")+
                "数量: "+formatWhole(player[this.layer].buyables[this.id])+"\n"+
                ("效果: 将超级点数获取乘"+format(data.effect)+"倍"))
            },
            unlocked() { return hasMilestone("l",4) },
            canAfford() { return player.o.buyables[11].gte(1e25) || hasMilestone("l",11)},
            buy() {
                player.o.buyables[11] = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
				},
				 buyMax() {
					// I'll do this later ehehe
            },
            style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
        },
        23: {
            title: "核熔炉",
            gain() { if(hasMilestone("l",11))return player.o.buyables[11].times(player.o.energy.root(10)).floor(); return player.o.buyables[11].div(1e30).times(player.o.energy.div("1e160").root(10)).floor() },
            effect() {
                return player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().plus(1).log10().plus(1).root(5)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return ("牺牲所有太阳核心和太阳能量获取"+formatWhole(data.gain)+"核熔炉\n"+
                (hasMilestone("l",11)?"":"需求: 1e30太阳核心和1e160太阳能量\n")+
                "数量: "+formatWhole(player[this.layer].buyables[this.id])+"\n"+
                "效果: 子空间效果"+format(data.effect)+"倍更强")
            },
            unlocked() { return hasMilestone("l",6) },
            canAfford() { return (player.o.buyables[11].gte(1e30)&&player.o.energy.gte("1e160")) || hasMilestone("l",11) },
            buy() {
                player.o.buyables[11] = new Decimal(0);
                player.o.energy = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
            },
            style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
        },
        31: {
            title: "蓝移耀斑",
            gain() { if(hasMilestone("l",12))return player.o.points.pow(10).floor(); return player.o.points.div("1e55").pow(10).floor() },
            effect() {
                if(player.ma.points.gte(12))return player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().plus(1).log10().div(10).add(1);
                return player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().plus(1).log10().root(5).div(10).add(1);
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return ("牺牲所有太阳能量获取"+formatWhole(data.gain)+"蓝移耀斑\n"+
                (hasMilestone("l",12)?"":"需求: 1e55太阳能量\n")+
                "数量: "+formatWhole(player[this.layer].buyables[this.id])+"\n"+
                "效果: 将法术效果乘"+format(data.effect)+"倍")
            },
            unlocked() { return hasMilestone("l",9) },
            canAfford() { return player.o.points.gte("1e55") },
            buy() {
                player.o.points = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
            },
            style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
        },
        32: {
            title: "燃烧气体",
            gain() { if(hasMilestone("l",12))return player.o.energy.root(100).floor();return player.o.energy.div("1e400").root(100).floor() },
            effect() {
                return player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().plus(1).log10().plus(1).log10().plus(1)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return ("牺牲所有太阳能量获取"+formatWhole(data.gain)+"燃烧气体\n"+
                (hasMilestone("l",12)?"":"需求: 1e400太阳能量\n")+
                "数量: "+formatWhole(player[this.layer].buyables[this.id])+"\n"+
                ("效果: 将太阳能量获取指数乘"+format(data.effect)+"倍"))
            },
            unlocked() { return player.ma.points.gte(12) },
            canAfford() { return player.o.energy.gte("1e400") },
            buy() {
                player.o.energy = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
            },
            style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
        },
        33: {
            title: "热核反应物",
            gain() { if(hasMilestone("l",12))return player.o.points.pow(10).floor(); return player.o.points.div("1e110").pow(10).floor() },
            effect() {
                return player[this.layer].buyables[this.id].plus(1).pow(tmp.o.solPow).log10().plus(1).log10().div(20).plus(1);
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return ("牺牲所有太阳能量获取"+formatWhole(data.gain)+"热核反应物\n"+
                (hasMilestone("l",12)?"":"需求: 1e110太阳能量\n")+
                "数量: "+formatWhole(player[this.layer].buyables[this.id])+"\n"+
                ("效果: 超空间成本^"+format(data.effect.pow(-1))))
            },
            unlocked() { return player.ma.points.gte(12) },
            canAfford() { return player.o.points.gte("1e110") },
            buy() {
                player.o.points = new Decimal(0);
                player.o.buyables[this.id] = player.o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
            },
            style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
        },
    },
    passiveGeneration() { return (hasMilestone("ba", 4)?1:0) },
    marked: function(){return player.ma.points.gte(12)}
});

addLayer("ba", {
    name: "平衡",
    symbol: "BA",
    position: 3,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        pos: new Decimal(0),
        neg: new Decimal(0),
        first: 0,
    }},
    color: "#fced9f",
    requires(){if(hasMilestone("sp",10))return new Decimal(1);return new Decimal("1e100");},
    resource: "平衡能量",
    baseResource: "特性",
    baseAmount() {return player.q.points},
    type: "normal",
    exponent: 0.04,
    gainMult() {
        mult = new Decimal(1);
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 4,
    hotkeys: [
        {key: "a", description: "A: 重置获取平衡能量", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if(hasMilestone("hs",0))keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    layerShown(){return player.o.unlocked },
    
    branches: ["q","ss"],
    update(diff) {
        if (!player.ba.unlocked) return;
        player.ba.pos = player.ba.pos.plus(tmp.ba.posGain.times(diff));
        player.ba.neg = player.ba.neg.plus(tmp.ba.negGain.times(diff));
         if(hasMilestone("sp",1)){
             var target=player.ss.subspace.add(1).log(player.ma.points.gte(13)?1.1:2).pow(1/1).add(1).floor();
            if(target.gt(player.ba.buyables[11])){
                player.ba.buyables[11]=target;
            }
            target=player.q.points.add(1).log(player.ma.points.gte(13)?2:10).pow(1/(player.ma.points.gte(13)?1.3:hasUpgrade("ba",33)?1.35:hasUpgrade("ba",23)?1.4:1.5)).add(1).floor();
            if(target.gt(player.ba.buyables[12])){
                player.ba.buyables[12]=target;
            }
            target=player.ba.neg.add(1).log(3).pow(1/1).add(1).floor();
            if(target.gt(player.ba.buyables[13])){
                player.ba.buyables[13]=target;
            }
            target=player.o.energy.add(1).log(player.ma.points.gte(13)?1.1:2).pow(1/1).add(1).floor();
            if(target.gt(player.ba.buyables[21])){
                player.ba.buyables[21]=target;
            }
            target=player.h.points.add(1).log(player.ma.points.gte(13)?2:10).pow(1/(player.ma.points.gte(13)?1.3:hasUpgrade("ba",33)?1.35:hasUpgrade("ba",13)?1.4:1.5)).add(1).floor();
            if(target.gt(player.ba.buyables[22])){
                player.ba.buyables[22]=target;
            }
            target=player.ba.pos.add(1).log(3).pow(1/1).add(1).floor();
            if(target.gt(player.ba.buyables[23])){
                player.ba.buyables[23]=target;
            }
         }
    },
    posGain() {
        let gain = player.ba.points;
        gain = gain.mul(buyableEffect("ba",11));
        gain = gain.mul(buyableEffect("ba",12));
        gain = gain.mul(buyableEffect("ba",13));
        return gain;
    },
    negGain() {
        let gain = player.ba.points;
        gain = gain.mul(buyableEffect("ba",21));
        gain = gain.mul(buyableEffect("ba",22));
        gain = gain.mul(buyableEffect("ba",23));
        return gain;
    },
    posBuff() { 
        let eff = player.ba.pos.plus(1).log10().div(10);
        if(hasUpgrade("ba",12))eff = eff.mul(1.28);
        if(hasUpgrade("ba",32))eff = eff.mul(1.25);
        return eff.plus(1);
    },
    negBuff() { 
        let eff = player.ba.neg.plus(1).log10().plus(1);
        if(hasUpgrade("ba",22))eff = eff.pow(2);
        if(hasUpgrade("ba",32))eff = eff.pow(2);
        return eff;
    },
    tabFormat: {
            "Main Tab": {
            content: ["main-display",
        "prestige-button",
        "resource-display",
        "blank",
        ["display-text", function(){return "积极性: "+format(player.ba.pos)+" (+"+format(tmp.ba.posGain)+"/秒)"}],
        ["display-text", function(){return "增益: 将时间胶囊基础乘"+format(tmp.ba.posBuff)+"倍"}],
        ["row", [["buyable",11],["buyable",12],["buyable",13]]],
        "blank",
        ["display-text", function(){return "消极性: "+format(player.ba.neg)+" (+"+format(tmp.ba.negGain)+"/秒)"}],
        ["display-text", function(){return "增益: 将特性层基础乘"+format(tmp.ba.negBuff)+"倍"}],
        ["row", [["buyable",21],["buyable",22],["buyable",23]]],
        "blank",
        "upgrades"]
        },
            "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones"]
        },
    },
    milestones: {
        0: {
            requirementDescription: "1平衡能量",
            done() { return player.ba.best.gte(1)},
            effectDescription: "重置时保留第4行里程碑和H挑战",
        },
        1: {
            requirementDescription: "2平衡能量",
            done() { return player.ba.best.gte(2)},
            effectDescription: "可以购买最大子空间能量",
        },
        2: {
            requirementDescription: "3平衡能量",
            done() { return player.ba.best.gte(3)},
            effectDescription: "自动购买特性层",
        },
        3: {
            requirementDescription: "5平衡能量",
            done() { return player.ba.best.gte(5)},
            effectDescription: "每秒获得100%太阳核心获取",
        },
        4: {
            requirementDescription: "10平衡能量",
            done() { return player.ba.best.gte(10)},
            effectDescription: "每秒获得100%太阳能量获取",
        },
        5: {
            requirementDescription: "20平衡能量",
            done() { return player.ba.best.gte(20)},
            effectDescription: "每秒获得100%阻碍精神获取",
        },
        6: {
            requirementDescription: "40平衡能量",
            done() { return player.ba.best.gte(40)},
            effectDescription: "每秒获得100%特性获取",
        },
        7: {
            requirementDescription: "200平衡能量",
            done() { return player.ba.best.gte(200)},
            effectDescription: "解锁平衡升级",
        },
    },
buyables: {
        rows: 2,
        cols: 3,
        11: {
            title: "子空间提升",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(player.ma.points.gte(13)?1.1:2, x)
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "等级: "+format(player[this.layer].buyables[this.id])+" <br>"+
                "将积极性获取乘"+format(data.effect)+"倍 <br>"+
                "成本: " + format(data.cost) + " 子空间";
            },
            canAfford() {
                return player.ss.subspace.gte(tmp[this.layer].buyables[this.id].cost)
            },
            effect(){return Decimal.pow(hasUpgrade("ba",35)?1.3:hasUpgrade("ba",25)?1.2:1.1, player[this.layer].buyables[this.id])},
            unlocked(){return player.ba.unlocked},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.ss.subspace = player.ss.subspace.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        12: {
            title: "特性提升",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(player.ma.points.gte(13)?2:10, x.pow(player.ma.points.gte(13)?1.3:hasUpgrade("ba",33)?1.35:hasUpgrade("ba",23)?1.4:1.5))
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "等级: "+format(player[this.layer].buyables[this.id])+" <br>"+
                "将积极性获取乘"+format(data.effect)+"倍 <br>"+
                "成本: " + format(data.cost) + " 特性";
            },
            canAfford() {
                return player.q.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            effect(){return Decimal.pow(hasUpgrade("ba",35)?1.3:hasUpgrade("ba",25)?1.2:1.1, player[this.layer].buyables[this.id])},
            unlocked(){return player.ba.unlocked},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.q.points = player.q.points.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        13: {
            title: "消极协同",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(3, x)
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "等级: "+format(player[this.layer].buyables[this.id])+" <br>"+
                "将积极性获取乘"+format(data.effect)+"倍 <br>"+
                "成本: " + format(data.cost) + " 消极性";
            },
            canAfford() {
                return player.ba.neg.gte(tmp[this.layer].buyables[this.id].cost)
            },
            effect(){return Decimal.pow(hasUpgrade("ba",35)?1.3:hasUpgrade("ba",25)?1.2:1.1, player[this.layer].buyables[this.id])},
            unlocked(){return player.ba.unlocked},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.ba.neg = player.ba.neg.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        21: {
            title: "太阳提升",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(player.ma.points.gte(13)?1.1:2, x)
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "等级: "+format(player[this.layer].buyables[this.id])+" <br>"+
                "将消极性获取乘"+format(data.effect)+"倍 <br>"+
                "成本: " + format(data.cost) + " 太阳能量";
            },
            canAfford() {
                return player.o.energy.gte(tmp[this.layer].buyables[this.id].cost)
            },
            effect(){return Decimal.pow(hasUpgrade("ba",35)?1.3:hasUpgrade("ba",15)?1.2:1.1, player[this.layer].buyables[this.id])},
            unlocked(){return player.ba.unlocked},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.o.energy = player.o.energy.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        22: {
            title: "阻碍提升",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(player.ma.points.gte(13)?2:10, x.pow(player.ma.points.gte(13)?1.3:hasUpgrade("ba",33)?1.35:hasUpgrade("ba",13)?1.4:1.5))
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "等级: "+format(player[this.layer].buyables[this.id])+" <br>"+
                "将消极性获取乘"+format(data.effect)+"倍 <br>"+
                "成本: " + format(data.cost) + " 阻碍精神";
            },
            canAfford() {
                return player.h.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            effect(){return Decimal.pow(hasUpgrade("ba",35)?1.3:hasUpgrade("ba",15)?1.2:1.1, player[this.layer].buyables[this.id])},
            unlocked(){return player.ba.unlocked},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.h.points = player.h.points.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        23: {
            title: "积极协同",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(3, x)
                return cost
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "等级: "+format(player[this.layer].buyables[this.id])+" <br>"+
                "将消极性获取乘"+format(data.effect)+"倍 <br>"+
                "成本: " + format(data.cost) + " 积极性";
            },
            canAfford() {
                return player.ba.pos.gte(tmp[this.layer].buyables[this.id].cost)
            },
            effect(){return Decimal.pow(hasUpgrade("ba",35)?1.3:hasUpgrade("ba",15)?1.2:1.1, player[this.layer].buyables[this.id])},
            unlocked(){return player.ba.unlocked},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.ba.pos = player.ba.pos.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
    },
    upgrades: {
        rows: 3,
        cols: 5,
        11: {
            title: "正离子",
            description: "积极性提升子空间",
            cost() { return new Decimal(1e7) },
            currencyDisplayName: "积极性",
            currencyInternalName: "pos",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("ba", 7) },
            effect() { return Decimal.pow(hasUpgrade("ba",31)?4:2,player.ba.pos.add(1).log10().sqrt()) },
            effectDisplay() { return format(tmp.ba.upgrades[11].effect)+"倍" },
        },
        12: {
            title: "积极性提升",
            description: "积极性效果更好",
            cost() { return new Decimal(1e12) },
            currencyDisplayName: "积极性",
            currencyInternalName: "pos",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("ba", 7) },
        },
        13: {
            title: "H折扣",
            description: "阻碍提升更便宜",
            cost() { return new Decimal(1e100) },
            currencyDisplayName: "积极性",
            currencyInternalName: "pos",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("hs", 0) },
        },
        14: {
            title: "积极太阳能量",
            description: "积极性提升太阳能量",
            cost() { return new Decimal(1e210) },
            currencyDisplayName: "积极性",
            currencyInternalName: "pos",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("hs", 0) },
            effect() { 
                let ret = player.ba.pos.plus(1).log10().plus(1).pow(hasUpgrade("ba",34)?2:1);
                return ret;
            },
            effectDisplay() { return format(tmp.ba.upgrades[14].effect)+"倍" },
        },
        15: {
            title: "积极力量",
            description: "所有提升消极性的购买物效果更好",
            cost() { return new Decimal(1e300) },
            currencyDisplayName: "积极性",
            currencyInternalName: "pos",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("hs", 0) },
        },
        21: {
            title: "负离子",
            description: "消极性提升太阳能量",
            cost() { return new Decimal(1e7) },
            currencyDisplayName: "消极性",
            currencyInternalName: "neg",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("ba", 7) },
            effect() { 
                let ret = player.ba.neg.plus(1).log10().plus(1).log10().div(hasUpgrade("ba",31)?5:10);
                return ret;
            },
            effectDisplay() { return "+"+format(tmp.ba.upgrades[21].effect.times(100))+"%" },
        },
        22: {
            title: "消极性提升",
            description: "消极性效果更好",
            cost() { return new Decimal(1e12) },
            currencyDisplayName: "消极性",
            currencyInternalName: "neg",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("ba", 7) },
        },
        23: {
            title: "Q折扣",
            description: "特性提升更便宜",
            cost() { return new Decimal(1e100) },
            currencyDisplayName: "消极性",
            currencyInternalName: "neg",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("hs", 0) },
        },
        24: {
            title: "消极子空间",
            description: "消极性提升子空间基础",
            cost() { return new Decimal(1e210) },
            currencyDisplayName: "消极性",
            currencyInternalName: "neg",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("hs", 0) },
            effect() { 
                let ret = player.ba.neg.plus(1).log10().plus(1).log10().div(10).mul(hasUpgrade("ba",34)?2:1).plus(1);
                return ret;
            },
            effectDisplay() { return format(tmp.ba.upgrades[24].effect)+"倍" },
        },
        25: {
            title: "消极力量",
            description: "所有提升积极性的购买物效果更好",
            cost() { return new Decimal(1e300) },
            currencyDisplayName: "消极性",
            currencyInternalName: "neg",
            currencyLayer: "ba",
            unlocked() { return hasMilestone("hs", 0) },
        },
        31: {
            title: "中性离子",
            description: "提升本升级上方2个升级",
            cost() { return new Decimal(player.ge.unlocked?1e40:1e50) },
            unlocked() { return hasMilestone("hs", 0) },
        },
        32: {
            title: "平衡提升",
            description: "提升本升级上方2个升级",
            cost() { return new Decimal(1e90) },
            unlocked() { return hasMilestone("hs", 0) },
        },
        33: {
            title: "平衡折扣",
            description: "提升本升级上方2个升级",
            cost() { return new Decimal(1e160) },
            unlocked() { return hasMilestone("hs", 0) },
        },
        34: {
            title: "中性提升",
            description: "提升本升级上方2个升级",
            cost() { return new Decimal(1e250) },
            unlocked() { return hasMilestone("hs", 0) },
        },
        35: {
            title: "中性力量",
            description: "提升本升级上方2个升级",
            cost() { return new Decimal(player.ge.unlocked?"1e360":"1e530") },
            unlocked() { return hasMilestone("hs", 0) },
        },
    },
    passiveGeneration() { return (hasMilestone("sp", 4)?1:0) },
    marked: function(){return player.ma.points.gte(13)}
});


addLayer("m", {
    name: "魔法", 
    symbol: "M", 
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        hexes: new Decimal(0),
    }},
    color: "#eb34c0",
    requires(){if(hasMilestone("sp",10))return new Decimal(1);return new Decimal("1e100");},
    resource: "魔法能量", 
    baseResource: "阻碍精神", 
    baseAmount() {return player.h.points},
    type: "normal",
    exponent() { return 0.05 },
    gainMult() {
        mult = new Decimal(1);
        return mult;
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 4,
    hotkeys: [
        {key: "m", description: "M: 重置获取魔法能量", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    layerShown(){return player.ba.unlocked },
    branches: ["o","h","q"],
    tabFormat: {
            "Main Tab": {
            content: ["main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "buyables",
        ["display-text",
            function() {return "你有"+formatWhole(player.m.hexes)+"(+"+format(tmp.m.hexGain)+"/秒)个魔法符文(来自已分配的魔法), "+tmp.m.hexEffDesc },
                {}],
        ]
        },
            "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones"]
        },
    },
    milestones: {
        0: {
            requirementDescription: "1总魔法",
            done() { return player.m.total.gte(1)},
            effectDescription: "魔法般地移除生成器能量和特性能量效果的软上限,但这些效果会被平方根。<b>更好的BP组合III</b>在助推器效果达到e10000前更强",
        },
        1: {
            requirementDescription: "2总魔法",
            done() { return player.m.total.gte(2)},
            effectDescription: "自动购买子空间能量,子空间能量重置不影响任何内容",
        },
        2: {
            requirementDescription: "3总魔法",
            done() { return player.m.total.gte(3)},
            effectDescription: "保留第4行升级",
        },
        3: {
            requirementDescription: "5总魔法",
            done() { return player.m.total.gte(5)},
            effectDescription: "每秒获得100%的塔科等离子体获取",
        },
        4: {
            requirementDescription: "10总魔法",
            done() { return player.m.total.gte(10)},
            effectDescription: "H/Q层需求降为1",
        },
        5: {
            requirementDescription: "100总魔法",
            done() { return player.m.total.gte(100)},
            effectDescription: "解锁另一个魔法",
        },
        6: {
            requirementDescription: "1e5总魔法",
            done() { return player.m.total.gte(1e5)},
            effectDescription: "解锁另一个魔法",
        },
        7: {
            requirementDescription: "1e7总魔法",
            done() { return player.m.total.gte(1e7)},
            effectDescription: "解锁另一个魔法。前2个增强器效果更强",
        },
    },
    buyables: {
        rows: 3,
        cols: 3,
        11: {
            title: "助推器提升",
            gain() { return player.m.points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log10().mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将助推器基础乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
        12: {
            title: "时间逆转",
            gain() { return player.m.points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log10().sqrt().div(10).mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                if(hasMilestone("l",3))eff = player[this.layer].buyables[this.id].add(1).log10().div(hasUpgrade("sp",44)?Math.max(1,10/buyableEffect("o",31).toNumber()):hasUpgrade("p",44)?Math.max(1,15/buyableEffect("o",31).toNumber()):20).mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                if(hasUpgrade("ai",13))eff = player[this.layer].buyables[this.id].add(1).log10().mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将时间胶囊基础乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return hasMilestone("m",5) }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
        13: {
            title: "齿轮平滑",
            gain() { return player.m.points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log10().mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将齿轮和旋转获取乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return player.ma.points.gte(21) }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
        21: {
            title: "子空间扩展",
            gain() { return player.m.points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log10().div(hasUpgrade("sp",44)?Math.max(1,10/buyableEffect("o",31).toNumber()):hasUpgrade("p",44)?Math.max(1,15/buyableEffect("o",31).toNumber()):20).mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                if(hasUpgrade("ai",13))eff = player[this.layer].buyables[this.id].add(1).log10().mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将子空间基础乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return hasMilestone("m",6) }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
        22: {
            title: "增强增强器",
            gain() { return player.m.points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log10().div(hasUpgrade("sp",44)?Math.max(1,10/buyableEffect("o",31).toNumber()):hasUpgrade("p",44)?Math.max(1,15/buyableEffect("o",31).toNumber()):20).mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将第3个增强器效果基础乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return hasMilestone("m",7) }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
        23: {
            title: "机器修复",
            gain() { return player.m.points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log10().mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将机器能量和机械能量获取乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return hasMilestone("ai",4) }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
        31: {
            title: "太阳赋能",
            gain() { return player.m.points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log10().div(1000).mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 增加"+format(tmp[this.layer].buyables[this.id].effect.sub(1).mul(100))+"%太阳能量"))
                return display;
            },
            unlocked() { return player.ma.points.gte(14) }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
        32: {
            title: "机器人克隆",
            gain() { return player.m.points },
            effect() {
                let eff = player[this.layer].buyables[this.id].add(1).log10().mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).div(Decimal.pow(10,Decimal.sub(3,player.i.buyables[12]))).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将机器人获取乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return hasMilestone("r",4) }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
        33: {
            title: "信号传输",
            gain() { return player.m.points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log10().mul(buyableEffect("o",31)).mul(player.i.buyables[11].gte(4)?buyableEffect("s",24):1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("已分配魔法: " + formatWhole(player[this.layer].buyables[this.id])+("\n效果: 将信号获取乘"+format(tmp[this.layer].buyables[this.id].effect)+"倍"))
                return display;
            },
            unlocked() { return hasMilestone("ai",4) }, 
            canAfford() { return player.m.points.gt(0) },
            buy() { 
        player.m.buyables[this.id] = player.m.buyables[this.id].plus(player.m.points);
                player.m.points = new Decimal(0);
            },
        },
    },
    update(diff) {
        if (!player.m.unlocked) return;
        player.m.hexes = player.m.hexes.plus(tmp.m.hexGain.times(diff));    
        if(hasMilestone("sp",2)){
            player.m.buyables[11]=player.m.buyables[11].add(player.m.points.times(diff));
            player.m.buyables[12]=player.m.buyables[12].add(player.m.points.times(diff));
            player.m.buyables[21]=player.m.buyables[21].add(player.m.points.times(diff));
            player.m.buyables[22]=player.m.buyables[22].add(player.m.points.times(diff));
            if(player.ma.points.gte(14))player.m.buyables[31]=player.m.buyables[31].add(player.m.points.times(diff));
            if(hasMilestone("r",4))player.m.buyables[32]=player.m.buyables[32].add(player.m.points.times(diff));
            if(player.ma.points.gte(21))player.m.buyables[13]=player.m.buyables[13].add(player.m.points.times(diff));
            if(hasMilestone("ai",4))player.m.buyables[23]=player.m.buyables[23].add(player.m.points.times(diff));
            if(hasMilestone("ai",4))player.m.buyables[33]=player.m.buyables[33].add(player.m.points.times(diff));
        }
    },
    hexGain() {
        let gain = player.m.buyables[11].sqrt();
        gain=gain.add(player.m.buyables[12].sqrt());
        gain=gain.add(player.m.buyables[13].sqrt());
        gain=gain.add(player.m.buyables[21].sqrt());
        gain=gain.add(player.m.buyables[22].sqrt());
        gain=gain.add(player.m.buyables[23].sqrt());
        gain=gain.add(player.m.buyables[31].sqrt());
        gain=gain.add(player.m.buyables[32].sqrt());
        gain=gain.add(player.m.buyables[33].sqrt());
        gain=gain.mul(tmp.l.lifePowerEff);
        gain=gain.mul(tmp.ps.powerEff);
        if(hasMilestone("l",5))gain=gain.mul(buyableEffect("l",12));
        if(player.ma.points.gte(14))gain = gain.mul(player.o.energy.pow(0.1));
        return gain;
    },
    hexEff() {
        return Decimal.pow(10,player.m.hexes.add(1).log10().pow(player.ge.unlocked?0.625:0.5));
    },
    hexEffDesc() {
        return "将阻碍精神、特性、太阳能量和子空间获取乘"+format(tmp.m.hexEff)+"倍"
    },

    passiveGeneration() { return (hasMilestone("sp", 3)?1:0) },
    marked: function(){return player.ma.points.gte(14)}
});

addLayer("ps", {
    name: "幻影灵魂",
    symbol: "PS",
    position: 2,
    row: 4,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            souls: new Decimal(0),
            power: new Decimal(0),
        };
    },
    color: "#b38fbf",
    requires(){
        if(player.ma.points.gte(15))return new Decimal(1);
        return new Decimal("1e765");
    },
    resource: "幻影灵魂",
    baseResource: "特性能量",
    baseAmount() { return player.q.energy;},
    type: "static",
    exponent: 1.5,
    base: new Decimal("1e400"),
        gainMult() {
            mult = new Decimal(1)
            if (player.i.buyables[11].gte(2)) mult = mult.div(buyableEffect("s", 22));
            return mult
        },
        gainExp() {
            return new Decimal(1)
        },
        hotkeys: [
            {key: "P", description: "Shift+P: 幻影灵魂重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        doReset(resettingLayer){ 
            let b=player.ps.buyables[21];
            let keep = ["milestones"];
            player.ps.souls = new Decimal(0);
            if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
            player.ps.buyables[21]=b;
        },
        layerShown(){return player.m.unlocked && player.ba.unlocked},
        branches: ["q", ["h", 2]],
        update(diff) {
            player.ps.souls = player.ps.souls.max(tmp.ps.soulGain.times(softcap(player.h.points.max(1).log10(),new Decimal(51400),0.1)))
            if(hasMilestone("l",0))player.ps.buyables[11]=player.ps.souls.div(1350).pow(0.25).mul(8).sub(7).max(0).floor();
            if (player.ma.points.gte(15)) player.ps.power = player.ps.power.root(tmp.ps.powerExp).plus(tmp.ps.powerGain.times(diff)).pow(tmp.ps.powerExp);
        },
        soulGainMult() {
            let mult = new Decimal(1);
            mult = mult.mul(buyableEffect("ps",11));
            return mult;
        },
        soulGain() {
            let gain = Decimal.pow(player.ps.points.min(120),1.5).times(layers.ps.soulGainMult());
            return gain;
        },
        soulEffExp() {
            let exp = new Decimal(1);
            exp = exp.mul(buyableEffect("ps",11));
            return exp;
        },
        soulEff() {
            let eff = player.ps.souls.plus(1).pow(layers.ps.soulEffExp());
            return eff;
        },
        effect(){
            if(!player.ge.unlocked)return Decimal.pow(1.5,player.ps.points);
            let base=new Decimal(1.5).add(tmp.ge.rotationEff);
            if(player.ma.points.gte(15))base = new Decimal(10).add(tmp.ge.rotationEff);
            if(player.ma.points.gte(21))base = new Decimal(10).mul(tmp.ge.rotationEff);
            return Decimal.pow(base,player.ps.points);
        },
        powerGain() { return player.ps.souls.plus(1).times(tmp.ps.buyables[21].effect) },
        powerExp() { return player.ps.points.sqrt().plus(1).times(tmp.ps.buyables[21].effect) },
        powerEff() { return player.ps.power.sqrt().plus(1); },
        tabFormat: {
            "Main Tab": {
                content: ["main-display",
                    ["display-text", function() { 
            if(player.l.unlocked)return "你的幻影灵魂将生命能量获取乘"+format(tmp.ps.effect)+"倍";return ""; }],
                    "prestige-button",
                    "resource-display",
                    "blank",
                    ["display-text", function() { let a = "你有"+formatWhole(player.ps.souls)+"诅咒灵魂(基于阻碍精神和幻影灵魂),将特性层基础乘"+format(tmp.ps.soulEff)+"倍";
                    if(player.ma.points.gte(15)) a += '<br>你有' + formatWhole(player.ps.power)+'幻影能量'+(" (+"+format(tmp.ps.powerGain)+"/秒 (基于诅咒灵魂),然后乘"+format(tmp.ps.powerExp)+"次方 (基于幻影灵魂))")+',将魔法符文获取乘' + format(tmp.ps.powerEff)+'倍';
                    return a;
                    }],
                    "blank",
                    "buyables",
                ],
            },
            "Milestones": {
                content: ["main-display",
                    "prestige-button",
                    "resource-display",
                    "blank",
                    "milestones"
                ],
            }
        },
        milestones: {
            0: {
                requirementDescription: "1幻影灵魂",
                done() { return player.ps.best.gte(1)},
                effectDescription: "每秒获得100%的对流能量获取",
            },
        },
        buyables: {
            rows: 2,
            cols: 1,
            11: {
                title: "幽灵",
                cost(x=player[this.layer].buyables[this.id]) {
let cost = Decimal.pow(x.div(8).add(1),4).mul(hasMilestone("l",0)?1350:1400).floor();
                    return cost;
                },
                effect() {
                    let x = player[this.layer].buyables[this.id];
    if(player.ge.unlocked)return x.mul(0.2).add(1);
                    return softcap(softcap(x.mul(0.5).add(1),new Decimal(15),new Decimal(0.5)),new Decimal(23),new Decimal(0.5));
                },
                display() {
                    let data = tmp[this.layer].buyables[this.id]
                    let display = ("成本: " + formatWhole(data.cost)+"诅咒灵魂")+"\n\
                    数量: " + formatWhole(player[this.layer].buyables[this.id])+"\n\
                    效果: 将诅咒灵魂获取和效果指数乘"+format(data.effect)+"倍";
                    return display;
                },
                unlocked() { return hasMilestone("sp",5) }, 
                canAfford() {
                    return player.ps.souls.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                style: {'height':'200px', 'width':'200px'},
            },
            21: {
                title: "幽灵精神",
                cost(x=player[this.layer].buyables[this.id]) {
                    let cost = Decimal.pow(2,Decimal.pow(2,x).mul(1024));
                    return cost;
                },
                effect() {
                    return player[this.layer].buyables[this.id].div(25).plus(1).pow(2);
                },
                display() {
                    let data = tmp[this.layer].buyables[this.id]
                    let display = (("成本: " + formatWhole(data.cost) + "幻影能量"))+"\n\
                    数量: " + formatWhole(player[this.layer].buyables[this.id])+"\n\
                    效果: 将幻影能量获取/指数乘"+format(tmp.ps.buyables[this.id].effect)+"倍";
                    return display;
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.ps.power.gte(tmp[this.layer].buyables[this.id].cost)
                },
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.ps.power = player.ps.power.sub(cost);
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                style: {'height':'200px', 'width':'200px'},
            },
            },

        canBuyMax() { return hasMilestone("l",0) },
        autoPrestige() { return hasMilestone("l",0) },
        resetsNothing() { return hasMilestone("l",0) },
        marked: function(){return player.ma.points.gte(15)}
});

addLayer("sp", {
    name: "超级点数",
    symbol: "SP",
    position: 2,
    row: 5,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
        };
    },
    color: "#00a7bf",
        requires() { 
        if(hasMilestone("c",0))return new Decimal(1);
            if(player.ma.points.gte(16))return new Decimal(16).sub(player.points.max(24).sub(24).mul(5)).max(1);
            return new Decimal(16) 
        },
    resource: "超级点数",
    baseResource: "点数",
    baseAmount() { return player.points;},
    type: "normal",
    exponent(){
    let exp=new Decimal(100);
        if(hasMilestone("h",30))exp=exp.add(challengeEffect("h",11));
        if(hasMilestone("sp",13))exp=exp.add(player.sp.points.add(1).log10().sqrt());
        if(player.sp.unlocked)return exp;
         return 1;
    },
        gainMult() {
            mult = new Decimal(1)
            if(hasMilestone("sp",14))mult = mult.mul(Decimal.pow(3,player.sp.upgrades.length));
            if(hasMilestone("l",4))mult = mult.mul(buyableEffect("o",22));
        mult = mult.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        if(hasUpgrade("g",35))mult = mult.mul(upgradeEffect("g",35));
        if(hasUpgrade("s",35))mult = mult.mul(upgradeEffect("s",35));
        if(hasMilestone("i",4))mult = mult.mul(Decimal.pow(2,player.i.points));
        if(player.ma.points.gte(19))mult = mult.mul(Decimal.pow(1.5,player.i.points));
        mult = mult.mul(buyableEffect("mc",21));
            mult = mult.times(buyableEffect("r",22));
            return mult
        },
        gainExp() {
            return new Decimal(1)
        },
        hotkeys: [
            {key: "ctrl+p", description: "Ctrl+P: 重置获取超级点数", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        doReset(resettingLayer){ 
            let keep = ["milestones"];
            if(player.ma.points.gte(7))keep.push("upgrades");
            if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
        },
        layerShown(){return player.ps.unlocked},
        branches: ["m","ba"],
        update(diff) {
        },
        tabFormat: {
            "Main Tab": {
                content: ["main-display",
                    "prestige-button",
                    "resource-display",
                    "blank",
                    function(){
                        if(player.i.unlocked)return "upgrades";
                        return "milestones";
                    }
                ],
            },
            "Milestones": {
                unlocked(){return player.i.unlocked;},
                content: ["main-display",
                    "prestige-button",
                    "resource-display",
                    "blank",
                    "milestones"
                ],
            }
        },
        milestones: {
            0: {
                requirementDescription: "1超级点数",
                done() { return player.sp.best.gte(1)},
                effectDescription: "保留第5行里程碑。<b>更好的BP组合III</b>效果始终等于助推器效果。<b>更好的GP组合</b>效果始终等于生成器能量",
            },
            1: {
                requirementDescription: "2超级点数",
                done() { return player.sp.best.gte(2)},
                effectDescription: "自动购买平衡能量购买物",
            },
            2: {
                requirementDescription: "3超级点数",
                done() { return player.sp.best.gte(3)},
                effectDescription: "每秒自动分配100%魔法到所有4个魔法而不消耗魔法",
            },
            3: {
                requirementDescription: "10超级点数",
                done() { return player.sp.best.gte(10)},
                effectDescription: "每秒获得100%魔法获取",
            },
            4: {
                requirementDescription: "20超级点数",
                done() { return player.sp.best.gte(20)},
                effectDescription: "每秒获得100%平衡能量获取",
            },
            5: {
                requirementDescription: "100超级点数",
                done() { return player.sp.best.gte(100)},
                effectDescription: "解锁幻影灵魂层中的幽灵",
            },
            6: {
                requirementDescription: "400超级点数",
                done() { return player.sp.best.gte(400)},
                effectDescription: "解锁更多声望升级",
            },
            7: {
                requirementDescription: "2000超级点数",
                done() { return player.sp.best.gte(2000)},
                effectDescription: "每秒获得100%日冕波获取",
            },
            8: {
                requirementDescription: "5000超级点数",
                done() { return player.sp.best.gte(5000)},
                effectDescription: "助推器更便宜",
            },
            9: {
                requirementDescription: "20000超级点数",
                unlocked() { return player.hs.unlocked },
                done() { return player.sp.best.gte(20000) && player.hs.unlocked},
                effectDescription: "超级点数提升超空间能量获取",
            },
            10: {
                requirementDescription: "1e6超级点数",
                unlocked() { return player.l.unlocked },
                done() { return player.sp.best.gte(1e6) && player.l.unlocked},
                effectDescription: "M/BA需求降为1",
            },
            11: {
                requirementDescription: "1e7超级点数",
                unlocked() { return player.l.unlocked },
                done() { return player.sp.best.gte(1e7) && player.l.unlocked},
                effectDescription: "声望点数获取更好",
            },
            12: {
                requirementDescription: "5e7超级点数",
                unlocked() { return player.l.unlocked },
                done() { return player.sp.best.gte(5e7) && player.l.unlocked},
                effectDescription: "超空间能量需求降低",
            },
            13: {
                requirementDescription: "2e8超级点数",
                unlocked() { return player.l.unlocked },
                done() { return player.sp.best.gte(2e8) && player.l.unlocked},
                effectDescription: "声望点数和超级点数获取基于超级点数变得更好",
            },
            14: {
                requirementDescription: "1e12超级点数",
                unlocked() { return player.i.unlocked },
                done() { return player.sp.best.gte(1e12) && player.i.unlocked},
                effectDescription: "超级点数升级提升超级点数获取",
            },
            15: {
                requirementDescription: "1e16超级点数",
                unlocked() { return player.i.unlocked },
                done() { return player.sp.best.gte(1e16) && player.i.unlocked},
                effectDescription: "超空间能量需求降低",
            },
            16: {
                requirementDescription: "1e20超级点数",
                unlocked() { return player.i.unlocked },
                done() { return player.sp.best.gte(1e20) && player.i.unlocked},
                effectDescription: "帝国砖块提升超空间能量获取",
            },
            17: {
                requirementDescription: "2e29超级点数",
                unlocked() { return player.i.unlocked },
                done() { return player.sp.best.gte(2e29) && player.i.unlocked},
                effectDescription: "超级点数提升增强点数",
            },
            18: {
                requirementDescription: "1e72超级点数",
                unlocked() { return player.ma.unlocked },
                done() { return player.sp.best.gte(1e72) && player.ma.unlocked},
                effectDescription: "<b>超级提升</b>软上限更弱",
            },
            19: {
                requirementDescription: "1e91超级点数",
                unlocked() { return player.ma.unlocked },
                done() { return player.sp.best.gte(1e91) && player.ma.unlocked},
                effectDescription: "<b>超级提升</b>软上限更弱",
            },
            20: {
                requirementDescription: "1e200超级点数",
                unlocked() { return player.r.unlocked },
                done() { return player.sp.best.gte(1e200) && player.r.unlocked},
                effectDescription: "超级助推器和超级生成器基于超级点数更便宜",
            },
            21: {
                requirementDescription: "1e220超级点数",
                unlocked() { return player.r.unlocked },
                done() { return player.sp.best.gte(1e220) && player.r.unlocked},
                effectDescription: "齿轮进化更便宜",
            },
            22: {
                requirementDescription: "1e275超级点数",
                unlocked() { return player.r.unlocked },
                done() { return player.sp.best.gte(1e275) && player.r.unlocked},
                effectDescription: "降低机器需求",
            },
            23: {
                requirementDescription: "1e445超级点数",
                unlocked() { return player.id.unlocked },
                done() { return player.sp.best.gte("1e445") && player.id.unlocked},
                effectDescription: "Point scaling is weaker based on super points.",
            },
            24: {
    requirementDescription: "1e1000超级点数",
    unlocked() { return player.c.unlocked },
    done() { return player.sp.best.gte("1e1000") && player.c.unlocked},
    effectDescription: "生命助推器3和6效果增强",
},
        },
        upgrades: {
            rows: 5,
            cols: 5,
            11: {
                title: "生命-超空间协同",
                description: "第3个生命精华里程碑效果更好",
                cost() { return new Decimal(1e8) },
                unlocked() { return player.i.unlocked && hasUpgrade("p", 11) },
            },
            12: {
                title: "超级提升",
                description: "总超级点数提升声望点数",
                cost() { return new Decimal(1e12) },
                unlocked() { return player.i.unlocked && hasUpgrade("p", 12) },
                effect() { 
                    let exp=new Decimal(100);
                    if(hasMilestone("h",41))exp = exp.add(challengeEffect("h",11));
                    if(hasUpgrade("sp",22))exp=exp.mul(player.sp.upgrades.length);
                    if(player.ma.points.gte(16))return player.sp.total.plus(1).pow(exp);
                    return softcap(player.sp.total.plus(1).pow(exp),new Decimal("1e80000"),player.sp.best.gte(1e91)?0.3:player.sp.best.gte(1e72)?0.1:0.01);
                },
                effectDisplay() { return format(tmp.sp.upgrades[12].effect)+"倍" },
            },
            13: {
                title: "自我-自我协同",
                description: "<b>自我协同</b>更强",
                cost() { return new Decimal(1e13) },
                unlocked() { return player.i.unlocked && hasUpgrade("p", 13) },
            },
            14: {
                title: "反平静",
                description: "<b>声望强度</b>效果更强",
                cost() { return new Decimal(2e38) },
                unlocked() { return player.mc.unlocked && hasUpgrade("p", 14) },
            },
            15: {
                title: "重:时间",
                description: "第2个时间能量效果更强",
                cost() { return new Decimal(Number.MAX_VALUE) },
                unlocked() { return player.r.unlocked },
            },
            21: {
                title: "超空间-生命协同",
                description: "生命精华获取由超空间能量提升",
                cost() { return new Decimal(2e14) },
                unlocked() { return player.i.unlocked && hasUpgrade("p", 21) },
                effect() { return player.hs.points.add(10).log10(); },
                effectDisplay() { return format(tmp.sp.upgrades[21].effect)+"倍" },
            },
            22: {
                title: "超级升级",
                description: "<b>超级提升</b>基于你的SP升级更强",
                cost() { return new Decimal(5e14) },
                unlocked() { return player.i.unlocked && hasUpgrade("p", 22) },
            },
            23: {
                title: "反转轰动",
                description: "<b>反向声望提升</b>更强",
                cost() { return new Decimal(5e18) },
                unlocked() { return player.i.unlocked && hasUpgrade("p", 23) },
            },
            24: {
                title: "日冕能量",
                description: "两个日冕波效果都翻倍(不受软上限影响)",
                cost() { return new Decimal(1e51) },
                unlocked() { return player.mc.unlocked && hasUpgrade("p", 24) },
            },
            25: {
                title: "重:成本",
                description: "时间胶囊和空间能量更便宜",
                cost() { return new Decimal("1e330") },
                unlocked() { return player.r.unlocked },
            },
            31: {
                title: "指数漂移",
                description: "<b>升级力量</b>提升到基于你SP升级的幂次",
                cost() { return new Decimal(2e21) },
                unlocked() { return player.i.unlocked && hasUpgrade("p", 31) },
            },
            32: {
                title: "不那么无用",
                description: "<b>升级力量</b>提升^7",
                cost() { return new Decimal(6e25) },
                unlocked() { return player.i.unlocked && hasUpgrade("p", 32) },
            },
            33: {
                title: "列领导领导",
                description: "<b>列领导</b>基于你的最佳超级点数更强",
                cost() { return new Decimal(1e28) },
                unlocked() { return player.ge.unlocked && hasUpgrade("p", 33) },
                effect() { return player.sp.best.plus(1).log10().plus(1).log10().plus(1) },
                effectDisplay() { return format(tmp.sp.upgrades[33].effect)+"倍" },
            },
            34: {
                title: "太阳发挥",
                description: "<b>太阳潜力</b>效果由你的总超级点数提升",
                cost() { return new Decimal(1e65) },
                unlocked() { return player.mc.unlocked && hasUpgrade("p", 34) },
                effect() { return player.sp.total.plus(1).log10().plus(1).log10().plus(1).log10().plus(1) },
                effectDisplay() { return format(tmp.sp.upgrades[34].effect)+"倍" },
            },
            35: {
                title: "重:折扣",
                description: "生成器更便宜",
                cost() { return new Decimal("1e370") },
                unlocked() { return player.r.unlocked },
            },
            41: {
                title: "一次又一次",
                description: "<b>声望递归</b>更强",
                cost() { return new Decimal(1e76) },
                unlocked() { return player.ne.unlocked && hasUpgrade("p", 41) },
            },
            42: {
                title: "空间感知II",
                description: "空间建筑更便宜",
                cost() { return new Decimal(1e85) },
                unlocked() { return player.ne.unlocked && hasUpgrade("p", 42) },
            },
            43: {
                title: "更多折扣",
                description: "生成器更便宜",
                cost() { return new Decimal(1e190) },
                unlocked() { return player.ma.points.gte(16) && hasUpgrade("p", 43) },
            },
            44: {
                title: "拼写字典II",
                description: "第2-4个魔法更强",
                cost() { return new Decimal(1e205) },
                unlocked() { return player.ma.points.gte(16) && hasUpgrade("p", 44) },
            },
	45: {
    title: "重:缩放", 
    description: "1e445超级点数里程碑效果增强",
    cost() { return new Decimal("1e900") },
    unlocked() { return player.ai.unlocked },
},
51: {
    title: "超级机器人",
    description: "部分机器人可购买项效果增强",
    cost() { return new Decimal("1e1630") },
    unlocked() { return player.c.unlocked },
},
52: {
    title: "超级机器", 
    description: "CPU和南桥效果增强",
    cost() { return new Decimal("1e2045") },
    unlocked() { return player.c.unlocked },
},
53: {
    title: "超级子空间",
    description: "子空间基础值会根据总超级点数提升",
    cost() { return new Decimal("1e2660") },
    unlocked() { return player.c.unlocked },
    effect() { return player.sp.total.plus(1).log10().plus(1) },
    effectDisplay() { return format(tmp.sp.upgrades[53].effect)+"倍" },
},
54: {
    title: "超级时间",
    description: "第二时间能量效果增强", 
    cost() { return new Decimal("1e3040") },
    unlocked() { return player.c.unlocked },
},
        },

        passiveGeneration() { return (player.ma.points.gte(10)?1:0) },
        marked: function(){return player.ma.points.gte(16)}
});

addLayer("hs", {
    name: "超空间",
    symbol: "HS",
    position: 3,
    row: 5,
passiveGeneration() { return (player.ma.points.gte(5)?1:0) },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    roundUpCost: true,
    color: "#dfdfff",
    requires() { 

        if(hasMilestone("c",0))return new Decimal(1);
        if(hasUpgrade("ai",34))return new Decimal(1);
        if(player.ma.points.gte(17))return new Decimal(160).sub(player.points.max(25).sub(25).mul(50)).max(1);
        if(hasMilestone("sp",15))return new Decimal(200); 
        if(hasMilestone("sp",12))return new Decimal(240); 
        return new Decimal(277) 
    },
    resource: "超空间能量",
    baseResource: "空间能量",
    baseAmount() {return player.s.points},
    type: "normal",
    exponent() { 
        let exp = new Decimal(10);
        exp = exp.mul(tmp.mc.mechEff);
        return exp;
    },
    gainMult() {
        mult = new Decimal(1);
        if(hasMilestone("sp",9))mult = mult.mul(player.sp.points.add(10).log10());
        if(hasMilestone("l",1))mult = mult.mul(hasUpgrade("sp",11)?player.l.points.add(10).log10().mul(10):5);
        if(hasMilestone("sp",16)){
            if(hasMilestone("i",2))mult = mult.mul(Decimal.pow(2,player.i.points));
            else mult = mult.mul(player.i.points.add(1));
        }
        if(player.ma.points.gte(19))mult = mult.mul(Decimal.pow(1.5,player.i.points));
        mult = mult.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        if(player.i.buyables[11].gte(3))mult = mult.mul(buyableEffect("s",23));
        if(hasUpgrade("g",35))mult = mult.mul(upgradeEffect("g",35));
        if(hasUpgrade("s",33))mult = mult.mul(upgradeEffect("s",33));
        if(hasUpgrade("t",35))mult = mult.mul(player.t.points.add(1));
        mult = mult.times(buyableEffect("r",23));
        mult = mult.mul(buyableEffect("mc",31));
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    hotkeys: [
        {key: "ctrl+s", description: "Ctrl+S: 超空间重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    layerShown(){return player.ss.unlocked && player.sp.unlocked },
    branches: ["ss", "ba"],
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display",
        ["blank", "5px"],
        ["buyable",1],
        "buyables","upgrades","milestones"
    ],
    buyables: {
    rows: 2,
    cols: 5,
    1: {
        title: "超空间", 
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = Decimal.pow(hasUpgrade("t",32)?1.8:2, x.pow(1.5));
            if(player.ma.points.gte(12))cost = cost.root(buyableEffect("o",33));
            cost = cost.floor();
            return cost
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            function calcNext(a){
                a=a.add(1);
                if(a.gte(1000))return "";
                a=a.toNumber();
                if(a%2)return "下一个超空间将分配到超建筑1。<br>";
                if(a%4)return "下一个超空间将分配到超建筑2。<br>";
                if(a%8)return "下一个超空间将分配到超建筑3。<br>";
                if(a%16)return "下一个超空间将分配到超建筑4。<br>";
                if(a%32)return "下一个超空间将分配到超建筑5。<br>";
                if(a%64)return "下一个超空间将分配到超建筑6。<br>";
                if(a%128)return "下一个超空间将分配到超建筑7。<br>";
                if(a%256)return "下一个超空间将分配到超建筑8。<br>";
                if(a%512)return "下一个超空间将分配到超建筑9。<br>";
            }
            let next = calcNext(player[this.layer].buyables[this.id]);
            return "你有 "+format(player.hs.buyables[1])+" 超空间。<br>"+next+
            "下一个超空间成本: " + format(data.cost) + " 超空间能量";
        },
        unlocked() { return player[this.layer].unlocked }, 
        canAfford() {
            return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost);
        },
        buy() { 
            cost = tmp[this.layer].buyables[this.id].cost
            player[this.layer].points = player[this.layer].points.sub(cost)
            player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
        },
        buyMax() {},
        style: {'height':'222px'},
    },
    11: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑1<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑1的效果^"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(1) }, 
        canAfford() { return false },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
    12: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑2<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑2的效果^"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(2) }, 
        canAfford() { return false },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
    13: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑3<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑3的效果^"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(4) }, 
        canAfford() { return false },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
    14: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑4<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑4的效果^"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(8) }, 
        canAfford() { return false },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
    15: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑5<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑5的效果x"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(16) }, 
        canAfford() { return false },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
    21: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑6<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑6的效果^"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(32) }, 
        canAfford() { return false },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
    22: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑7<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑7的效果^"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(64) }, 
        canAfford() { return false },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
    23: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑8<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑8的效果^"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(128) }, 
        canAfford() { return false },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
    24: {
        display() { 
            let data = tmp[this.layer].buyables[this.id]
            return "超建筑9<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑9的效果x"+format(data.effect)+"<br>";
        },
        unlocked() { return player[this.layer].buyables[1].gte(256) }, 
                canAfford() {
                    return false;
                },
                effect(){
                    let x=player[this.layer].buyables[this.id];
                    return x.mul(0.2).add(1);
                },
                style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
            },
            25: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
   return "超建筑10<br>"+
            "等级: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "效果: 空间建筑10的效果x"+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].buyables[1].gte(512) }, 
                canAfford() {
                    return false;
                },
        effect(){
            let x=player[this.layer].buyables[this.id];
            return x.mul(0.2).add(1);
        },
        style: {'height':'120px','width':'120px','background-color':'#dfdfff'},
    },
},
    milestones: {
        0: {
            requirementDescription: "1超空间能量",
            done() { return player.hs.best.gte(1)},
            effectDescription: "空间能量更便宜。保留平衡升级并解锁更多平衡升级。",
        },
        1: {
            requirementDescription: "50超空间能量",
            done() { return player.hs.best.gte(50)},
            effectDescription: "空间建筑3的效果改变。",
        },
        2: {
            requirementDescription: "300超空间能量",
            done() { return player.hs.best.gte(300)},
            effectDescription: "<b>时空异常</b>效果更好。",
        },
        3: {
            requirementDescription: "50000超空间能量",
            done() { return player.hs.best.gte(50000)},
            effectDescription: "时间能量效果^1.25",
        },
    },

        
    update(diff) {
        if(hasMilestone("mc",1)){
            var target=player.hs.points.pow(buyableEffect("o",33)).add(1).log(hasUpgrade("t",32)?1.8:2).pow(1/1.5).add(1).floor();
            if(target.gt(player.hs.buyables[1])){
                player.hs.buyables[1]=target;
            }
        }
        
        player.hs.buyables[11]=player.hs.buyables[1].add(1).div(2).floor();
        player.hs.buyables[12]=player.hs.buyables[1].add(2).div(4).floor();
        player.hs.buyables[13]=player.hs.buyables[1].add(4).div(8).floor();
        player.hs.buyables[14]=player.hs.buyables[1].add(8).div(16).floor();
        player.hs.buyables[15]=player.hs.buyables[1].add(16).div(32).floor();
        player.hs.buyables[21]=player.hs.buyables[1].add(32).div(64).floor();
        player.hs.buyables[22]=player.hs.buyables[1].add(64).div(128).floor();
        player.hs.buyables[23]=player.hs.buyables[1].add(128).div(256).floor();
        player.hs.buyables[24]=player.hs.buyables[1].add(256).div(512).floor();
            player.hs.buyables[25]=player.hs.buyables[1].div(512).floor();
    },
    marked: function(){return player.ma.points.gte(17)}
});

addLayer("l", {
    name: "生命",
    symbol: "L",
    position: 1,
    row: 5,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        power: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#7fbf7f",
    requires: function(){
        if(hasMilestone("c",0))return new Decimal(1);
        if(player.ma.points.gte(18))return new Decimal(1);
        return new Decimal(1e28);
    },
    resource: "生命精华",
    baseResource: "魔法符文",
    baseAmount() {return player.m.hexes},
    type: "normal",
    exponent: 0.1,
    hotkeys: [
        {key: "l", description: "L: 重置获取生命精华", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
 passiveGeneration() { return (hasMilestone("ge",1)?1:0) },
    layerShown(){return player.hs.unlocked},
    branches: ["o","m",["ps",3]],
    gainMult() {
        let ret=new Decimal(1);
        if(hasUpgrade("sp",21))ret = ret.mul(upgradeEffect("sp",21));
        ret = ret.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        if(hasUpgrade("g",35))ret = ret.mul(upgradeEffect("g",35));
        if(hasMilestone("i",4))ret = ret.mul(Decimal.pow(2,player.i.points));
        if(player.ma.points.gte(19))ret = ret.mul(Decimal.pow(1.5,player.i.points));
        ret = ret.mul(buyableEffect("mc",32));
        ret = ret.times(buyableEffect("r",32));
        return ret;
    },
    effect() {
        let ret = player.l.points;
        ret=ret.mul(tmp.ps.effect);
        if(hasUpgrade("g",33))ret = ret.mul(upgradeEffect("g",33));
        ret = ret.times(buyableEffect("r",32));
        return ret;
    },
    effectDescription() {
        let eff = this.effect();
        return "每秒生成"+format(eff)+"生命能量"
    },
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    milestones: {
        0: {
            requirementDescription: "1生命精华",
            done() {return player[this.layer].best.gte(1)},
            effectDescription: "自动购买幻影灵魂和幽灵，幻影灵魂重置不影响任何内容。幽灵更便宜。",
        },
        1: {
            requirementDescription: "3生命精华",
            done() {return player[this.layer].best.gte(3)},
            effectDescription() { if(hasUpgrade("sp",11))return "基于生命精华获取更多超空间能量。";return "获取5倍超空间能量。"},
        },
        2: {
            requirementDescription: "30生命精华",
            done() {return player[this.layer].best.gte(30)},
            effectDescription: "解锁生命助推器1。",
        },
        3: {
            requirementDescription: "300生命精华",
            done() {return player[this.layer].best.gte(300)},
            effectDescription: "<b>时间逆转</b>效果更好。",
        },
        4: {
            requirementDescription: "1e4生命精华",
            done() {return player[this.layer].best.gte(10000)},
            effectDescription: "解锁新星残余。",
        },
        5: {
            requirementDescription: "1e6生命精华",
            done() {return player[this.layer].best.gte(1e6)},
            effectDescription: "解锁生命助推器2。",
        },
        6: {
            requirementDescription: "1e11生命精华",
            done() {return player[this.layer].best.gte(1e11)},
            effectDescription: "解锁核熔炉。",
        },
        7: {
            requirementDescription: "1e14生命精华",
            done() {return player[this.layer].best.gte(1e14)},
            effectDescription: "解锁生命助推器3。",
        },
        8: {
            requirementDescription: "1e16生命精华",
            done() {return player[this.layer].best.gte(1e16)},
            effectDescription: "前3个太阳能量购买物获取更好。",
        },
        9: {
            requirementDescription: "1e40生命精华",
            done() {return player[this.layer].best.gte(1e40)},
            effectDescription: "解锁蓝移耀斑。",
        },
        10: {
            requirementDescription: "1e53生命精华",
            done() {return player[this.layer].best.gte(1e53)},
            effectDescription: "解锁生命助推器4。",
        },
        11: {
            requirementDescription: "1e75生命精华",
            done() {return player[this.layer].best.gte(1e75)},
            effectDescription: "接下来3个太阳能量购买物获取更好。",
        },
        12: {
            requirementDescription: "1e105生命精华",
            done() {return player[this.layer].best.gte(1e105)},
            effectDescription: "最后3个太阳能量购买物获取更好。",
        },
        13: {
            requirementDescription: "1e220生命精华",
            done() {return player[this.layer].best.gte(1e220)},
            effectDescription: "生命助推器2和5效果更好。",
        },
        14: {
            requirementDescription: "1e240生命精华",
            done() {return player[this.layer].best.gte(1e240)},
            effectDescription: "生命助推器5效果更好。",
        },
        15: {
            requirementDescription: "1e260生命精华",
            done() {return player[this.layer].best.gte(1e260)},
            effectDescription: "生命助推器3和5效果更好。",
        },
        16: {
            requirementDescription: "1e300生命精华",
            done() {return player[this.layer].best.gte(1e300)},
            effectDescription: "生命助推器3和5效果更好。",
        },
        17: {
            requirementDescription: "1e400生命精华",
            done() {return player[this.layer].best.gte("1e400")},
            effectDescription: "解锁生命助推器6。",
        },
        18: {
            requirementDescription: "1e520生命精华",
            done() {return player[this.layer].best.gte("1e520")},
            effectDescription: "生命助推器3和6效果更好。",
        },
        19: {
            requirementDescription: "1e630生命精华",
            done() {return player[this.layer].best.gte("1e630")},
            effectDescription: "生命助推器3和6效果更好。",
        },
20: {
    requirementDescription: "1e900生命精华", 
    done() {return player[this.layer].best.gte("1e900")},
    effectDescription: "生命助推器3和6效果增强",
},
21: {
    requirementDescription: "1e1500生命精华",
    done() {return player[this.layer].best.gte("1e1500")},
    effectDescription: "生命能量效果提升至6次方",
},
    },
    update(diff){
        player.l.power = player.l.power.add(tmp.l.effect.times(diff)).max(0)
        if(hasMilestone("l",2)){
            if(player.ps.points.gte(layers.l.buyables[11].cost())){
                player.l.buyables[11]=player.ps.points.add(1);
            }
        }
        if(hasMilestone("l",5)){
            if(player.ps.points.gte(layers.l.buyables[12].cost())){
                player.l.buyables[12]=player.ps.points.add(1);
            }
        }
        if(hasMilestone("l",7)){
            if(player.ps.points.gte(layers.l.buyables[13].cost())){
                player.l.buyables[13]=player.ps.points.add(1);
            }
        }
        if(hasMilestone("l",10)){
            if(player.ps.points.gte(layers.l.buyables[14].cost())){
                player.l.buyables[14]=player.ps.points.add(1);
            }
        }
        if(player.ma.points.gte(18)){
            if(player.ps.points.gte(layers.l.buyables[15].cost())){
                player.l.buyables[15]=player.ps.points.add(1);
            }
        }
        if(hasMilestone("l",17)){
            if(player.ps.points.gte(layers.l.buyables[16].cost())){
                player.l.buyables[16]=player.ps.points.add(1);
            }
        }
    },
    tabFormat: ["main-display",
        "prestige-button", "resource-display",
        ["blank", "5px"],
        ["display-text",
            function() {
                return '你有 ' + format(player.l.power) + ' 生命能量，将魔法符文获取乘' + format(tmp.l.lifePowerEff)+'倍';
            },
            {}],
        ["row",[["buyable",11],["buyable",12],["buyable",13]]],
        ["row",[["buyable",14],["buyable",15],["buyable",16]]],
        "milestones",
    ],
    lifePowerEff(){
        let ret=player.l.power.add(1).sqrt();
        if(hasMilestone("l",21))ret = ret.pow(6);
        return ret;
    },
   buyables: {
    rows: 1,
    cols: 7,
    11: {
        title: "生命助推器1",
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = x;
            if(!hasMilestone("l",2))return Decimal.dInf;
            return cost
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "数量: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "下一个在: "+formatWhole(data.cost)+" 幻影灵魂<br>"+
            "效果: 超级助推器基础+"+format(data.effect.sub(1));
        },
        effect(){
            let x=player[this.layer].buyables[this.id].mul(player.l.power.add(1).log10().add(1));
            return x.pow(0.1).sub(1).div(5).max(0).add(1);
        },
        unlocked() { return hasMilestone("l",2) }, 
        canAfford() { return false },
        buyMax() {},
        style: {'height':'222px','background-color':'#7fbf7f'},
    },
    12: {
        title: "生命助推器2",
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = x;
            if(!hasMilestone("l",5))return Decimal.dInf;
            return cost
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "数量: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "下一个在: "+formatWhole(data.cost)+" 幻影灵魂<br>"+
            "效果: 获取"+format(data.effect)+"倍魔法符文";
        },
        effect(){
            let x=player[this.layer].buyables[this.id].mul(player.l.power.add(1).log10().add(1));
            return Decimal.pow(hasMilestone("l",13)?10:2,x.pow(0.5));
        },
        unlocked() { return hasMilestone("l",5) }, 
        canAfford() { return false },
        buyMax() {},
        style: {'height':'222px','background-color':'#7fbf7f'},
    },
    13: {
        title: "生命助推器3",
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = x;
            if(!hasMilestone("l",7))return Decimal.dInf;
            return cost
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "数量: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "下一个在: "+formatWhole(data.cost)+" 幻影灵魂<br>"+
            "效果: 子空间基础"+format(data.effect)+"倍";
        },
        effect(){
            let x=player[this.layer].buyables[this.id].mul(player.l.power.add(1).log10().add(1));
            if(hasMilestone("l",18))return x.div(hasMilestone("l",19)?1000:10000).mul(hasUpgrade("ai",33)?10:1).add(1);
            if(hasMilestone("l",16))return x.add(1).log10().add(1);
            return x.add(1).log10().add(1).log10().div(hasMilestone("l",15)?1:5).add(1);
        },
        unlocked() { return hasMilestone("l",7) }, 
        canAfford() { return false },
        buyMax() {},
        style: {'height':'222px','background-color':'#7fbf7f'},
    },
    14: {
        title: "生命助推器4",
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = x;
            if(!hasMilestone("l",10))return Decimal.dInf;
            return cost
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "数量: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "下一个在: "+formatWhole(data.cost)+" 幻影灵魂<br>"+
            "效果: 太阳能量+"+format(data.effect.mul(100))+"%";
        },
        effect(){
            let x=player[this.layer].buyables[this.id].mul(player.l.power.add(1).log10().add(1));
            return x.pow(player.ma.points.gte(18)?0.2:0.1).sub(player.ma.points.gte(18)?0:1).div(5).max(0).add(1);
        },
        unlocked() { return hasMilestone("l",10) }, 
        canAfford() { return false },
        buyMax() {},
        style: {'height':'222px','background-color':'#7fbf7f'},
    },
    15: {
        title: "生命助推器5",
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = x;
            if(player.ma.points.lt(18))return Decimal.dInf;
            return cost
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "数量: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "下一个在: "+formatWhole(data.cost)+" 幻影灵魂<br>"+
            "效果: 信号获取"+format(data.effect)+"倍";
        },
        effect(){
            let x=player[this.layer].buyables[this.id].mul(player.l.power.add(1).log10().add(1));
            return x.div(hasMilestone("l",16)?1:hasMilestone("l",15)?10:hasMilestone("l",14)?100:hasMilestone("l",13)?1000:10000).add(1);
        },
        unlocked() { return player.ma.points.gte(18) }, 
        canAfford() { return false },
        buyMax() {},
        style: {'height':'222px','background-color':'#7fbf7f'},
    },
    16: {
        title: "生命助推器6",
        cost(x=player[this.layer].buyables[this.id]) {
            let cost = x;
            if(!hasMilestone("l",17))return Decimal.dInf;
            return cost
        },
        display() {
            let data = tmp[this.layer].buyables[this.id]
            return "数量: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
            "下一个在: "+formatWhole(data.cost)+" 幻影灵魂<br>"+
            "效果: 机器人获取"+format(data.effect)+"倍";
        },
        effect(){
            let x=player[this.layer].buyables[this.id].mul(player.l.power.add(1).log10().add(1));
            return x.div(hasMilestone("l",19)?100:hasMilestone("l",18)?1000:10000).add(1);
        },
        unlocked() { return hasMilestone("l",17) }, 
        canAfford() { return false },
        buyMax() {},
        style: {'height':'222px','background-color':'#7fbf7f'},
    },
},
    marked: function(){return player.ma.points.gte(18)}
});

addLayer("i", {
    name: "帝国",
    symbol: "I",
    position: 4,
    row: 5,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#e5dab7",
    requires() { 
        if(player.ma.points.gte(19))return new Decimal(1); 
        return new Decimal("1e110") 
    },
 autoPrestige() { return hasMilestone("ma",0) },
    resetsNothing() { return hasMilestone("ma",0) },
    resource: "帝国砖块",
    baseResource: "子空间",
    baseAmount() {return player.ss.subspace},
    type: "static",
    exponent: new Decimal(1.5),
    base() { return new Decimal("1e15") },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    hotkeys: [
        {key: "i", description: "I: 帝国重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = ["buyables","milestones"];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    layerShown(){return player.l.unlocked},
    branches: ["ss"],
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "buyables",
        "upgrades","milestones"
    ],
    milestones: {
        0: {
            requirementDescription: "1帝国砖块",
            done() {return player[this.layer].best.gte(1)},
            effectDescription: "此层里程碑和购买物不会重置。解锁SP升级。",
        },
        1: {
            requirementDescription: "3帝国砖块",
            done() {return player[this.layer].best.gte(3)},
            effectDescription: "解锁更多子空间升级。",
        },
        2: {
            requirementDescription: "5帝国砖块",
            unlocked(){return player.ma.unlocked},
            done() {return player[this.layer].best.gte(5) && player.ma.unlocked},
            effectDescription: "1e20超级点数里程碑效果更好，帝国砖块使子空间获取更好。",
        },
        3: {
            requirementDescription: "9帝国砖块",
            unlocked(){return player.ma.unlocked},
            done() {return player[this.layer].best.gte(9) && player.ma.unlocked},
            effectDescription: "基于点数超过23降低时间胶囊和空间能量成本。",
        },
        4: {
            requirementDescription: "11帝国砖块",
            unlocked(){return player.ma.unlocked},
            done() {return player[this.layer].best.gte(11) && player.ma.unlocked},
            effectDescription: "每个帝国砖块将生命精华/超级点数/子空间获取乘2倍。",
        },
        5: {
            requirementDescription: "12帝国砖块",
            unlocked(){return player.ma.unlocked},
            done() {return player[this.layer].best.gte(12) && player.ma.unlocked},
            effectDescription: "<b>黑暗区域</b>效果更好。",
        },
        6: {
            requirementDescription: "13帝国砖块",
            unlocked(){return player.ne.unlocked},
            done() {return player[this.layer].best.gte(13) && player.ne.unlocked},
            effectDescription: "第二个思想效果平方。",
        },
        7: {
            requirementDescription: "14帝国砖块",
            unlocked(){return player.r.unlocked},
            done() {return player[this.layer].best.gte(14) && player.r.unlocked},
            effectDescription: "帝国砖块提升能量获取。",
        },
        8: {
            requirementDescription: "15帝国砖块",
            unlocked(){return player.r.unlocked},
            done() {return player[this.layer].best.gte(15) && player.r.unlocked},
            effectDescription: "帝国砖块提升机器人获取。",
        },
        9: {
            requirementDescription: "16帝国砖块",
            unlocked(){return player.r.unlocked},
            done() {return player[this.layer].best.gte(16) && player.r.unlocked},
            effectDescription: "机器人需求降为1。",
        },
        10: {
            requirementDescription: "18帝国砖块",
            unlocked(){return player.r.unlocked},
            done() {return player[this.layer].best.gte(18) && player.r.unlocked},
            effectDescription: "时间胶囊和空间能量更便宜。",
        },
        11: {
            requirementDescription: "21帝国砖块",
            unlocked(){return player.r.unlocked},
            done() {return player[this.layer].best.gte(21) && player.r.unlocked},
            effectDescription: "时间胶囊和空间能量更便宜。",
        },
     12: {
    requirementDescription: "33块帝国砖块",
    unlocked(){return player.c.unlocked},
    done() {return player[this.layer].best.gte(33) && player.c.unlocked},
    effectDescription: "帝国砖块会增强子空间获取效率",
},
    },
    buyables: {
        rows: 1,
        cols: 2,
        11: {
            title: "帝国建筑",
            cap() { return new Decimal(5) },
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = x.mul(2).add(2);
                return cost;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                let cost = data.cost;
                let display = (player[this.layer].buyables[this.id].gte(data.cap)?"已达上限":("成本: "+formatWhole(cost)+" 帝国砖块"))+"\n"+
                "数量: " + formatWhole(player[this.layer].buyables[this.id])+" / "+formatWhole(data.cap)+"\n"+
                "解锁 "+formatWhole(player[this.layer].buyables[this.id])+" 个新空间建筑"
                return display;
            },
            canAfford() {
                let cost = tmp[this.layer].buyables[this.id].cost
                return player.i.unlocked && player.i.points.gte(cost) && player[this.layer].buyables[this.id].lt(tmp[this.layer].buyables[this.id].cap)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.i.points = player.i.points.sub(cost);
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'height':'200px', 'width':'200px'},
        },
        12: {
            title: "帝国建筑II",
            cap() { return new Decimal(3) },
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = x.mul(2).add(15);
                return cost;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                let cost = data.cost;
                let display = (player[this.layer].buyables[this.id].gte(data.cap)?"已达上限":("成本: "+formatWhole(cost)+" 帝国砖块"))+"\n"+
                "数量: " + formatWhole(player[this.layer].buyables[this.id])+" / "+formatWhole(data.cap)+"\n"+
                "<b>机器人克隆</b>效果增强"+formatWhole(Decimal.pow(10,player[this.layer].buyables[this.id]))+"倍";
                return display;
            },
            canAfford() {
                let cost = tmp[this.layer].buyables[this.id].cost
                return player.i.unlocked && player.i.points.gte(cost) && player[this.layer].buyables[this.id].lt(tmp[this.layer].buyables[this.id].cap)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player.i.points = player.i.points.sub(cost);
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            style: {'height':'200px', 'width':'200px'},
            unlocked(){return player.ma.points.gte(19)}
        },
    },
    marked: function(){return player.ma.points.gte(19)}
});

addLayer("ma", {
    name: "精通",
    symbol: "MA",
    position: 2,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        first: 0,
        mastered: [],
        selectionActive: false,
        current: null,
    }},
    color: "#ff9f7f",
    requires() { return new Decimal(20) },
    resource: "精通",
    baseResource: "点数",
    baseAmount() {return player.points},
    type: "static",
    exponent: new Decimal(1.11),
    base: new Decimal(1.01),
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    canBuyMax() { return false },
    row: 6,
    hotkeys: [
        {key: "A", description: "Shift+A: 精通重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){},
    milestoneBase(){
        if(player[this.layer].best.gte(20))return player[this.layer].points.div(5).max(3);
        if(player.mc.unlocked)return new Decimal(3);
        if(player.ge.unlocked)return new Decimal(2.5);
        return new Decimal(2);
    },
    layerShown(){return player.ps.unlocked && player.i.unlocked},
    branches: ["sp", "hs", ["ps", 2]],
    getMilestoneDesc(){
        if(player[this.layer].best.gte(8))return "获取"+format(tmp.ma.milestoneBase)+"倍超级点数/生命精华/超空间能量/太阳能量/子空间。";
        return "获取"+format(tmp.ma.milestoneBase)+"倍超级点数/生命精华/超空间能量。";
    },
    milestones: {
        0: {
            requirementDescription: "1精通",
            done() {return player[this.layer].best.gte(1)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+" 此层不会重置。保留第6行里程碑。<br>精通声望: 声望指数公式更好，声望升级第3列由超过20的点数提升。"},
        },
        1: {
            requirementDescription: "2精通",
            done() {return player[this.layer].best.gte(2)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通助推器: 基于超过20的点数使助推器更便宜。解锁新助推器升级，第1行助推器升级效果更好。"},
        },
        2: {
            requirementDescription: "3精通",
            done() {return player[this.layer].best.gte(3)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通生成器: 基于超过20的点数使生成器更便宜。解锁新生成器升级，第1行生成器升级和<b>双重反转</b>效果更好。"},
        },
        3: {
            requirementDescription: "4精通",
            done() {return player[this.layer].best.gte(4)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通时间胶囊: 时间能量效果^1.25，解锁新时间升级"+(player.ge.unlocked?"，部分时间升级效果更好，第2时间能量效果更好。":"。")},
        },
        4: {
            requirementDescription: "5精通",
            done() {return player[this.layer].best.gte(5)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+" 每秒获取100%超空间能量。<br>精通空间能量: 空间能量更便宜。解锁新空间升级。"},
        },
        5: {
            requirementDescription: "6精通",
            done() {return player[this.layer].best.gte(6)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通增强: 增强点数获取更好。解锁新增强升级。"},
        },
        6: {
            requirementDescription: "7精通",
            done() {return player[this.layer].best.gte(7)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+" 保留超级点数升级。<br>精通超级助推器: 超级助推器更便宜，超级助推器效果更好。"},
        },
        7: {
            requirementDescription: "8精通",
            done() {return player[this.layer].best.gte(8)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+(player[this.layer].best.lt(8)?" 前一个效果将影响所有精通里程碑中的太阳能量/子空间。":"")+"<br>精通特性: <b>指数疯狂</b>效果更好。解锁新特性升级。"},
        },
        8: {
            requirementDescription: "9精通",
            done() {return player[this.layer].best.gte(9)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通阻碍精神: H挑战效果由阻碍精神提升。"},
        },
        9: {
            requirementDescription: "10精通",
            done() {return player[this.layer].best.gte(10)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+" 每秒获取100%超级点数。<br>精通子空间: 子空间效果更好。子空间能量更便宜。"},
        },
        10: {
            requirementDescription: "11精通",
            done() {return player[this.layer].best.gte(11)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通超级生成器: 超级生成器更便宜，超级生成器效果更好。"},
        },
        11: {
            requirementDescription: "12精通",
            done() {return player[this.layer].best.gte(12)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通太阳能量: +100%太阳能量，解锁更多太阳能量购买物，太阳能量降低太阳能量需求。"},
        },
        12: {
            requirementDescription: "13精通",
            done() {return player[this.layer].best.gte(13)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通平衡能量: 平衡购买物更便宜。"},
        },
        13: {
            requirementDescription: "14精通",
            done() {return player[this.layer].best.gte(14)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通魔法: 太阳能量以降低的速率提升魔法符文。解锁新法术。"},
        },
        14: {
            requirementDescription: "15精通",
            done() {return player[this.layer].best.gte(15)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通幻影灵魂: 幻影灵魂需求降为1，幻影灵魂基础+8.5。解锁幻影能量。"},
        },
        15: {
            requirementDescription: "16精通",
            done() {return player[this.layer].best.gte(16)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通超级点数: 超级点数获取更好。移除<b>超级提升</b>软上限。"},
        },
        16: {
            requirementDescription: "17精通",
            done() {return player[this.layer].best.gte(17)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通超空间: 超空间需求降低，并由超过25的点数进一步降低。"},
        },
        17: {
            requirementDescription: "18精通",
            done() {return player[this.layer].best.gte(18)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通生命精华: 生命精华需求降为1，生命助推器4效果更好。解锁新生命助推器。"},
        },
        18: {
            requirementDescription: "19精通",
            done() {return player[this.layer].best.gte(19)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通帝国: 帝国需求降为1。解锁帝国建筑II，每个帝国砖块将超级点数/生命精华/超空间能量乘1.5倍。"},
        },
        19: {
            requirementDescription: "20精通",
            done() {return player[this.layer].best.gte(20)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通精通: 精通里程碑效果为(精通/5)倍而非3倍。"},
        },
        20: {
            requirementDescription: "21精通",
            done() {return player[this.layer].best.gte(21)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通齿轮: 齿轮需求降为1，解锁新法术。"},
        },
        21: {
            requirementDescription: "22精通",
            done() {return player[this.layer].best.gte(22)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通机器: 机器需求降为1，机械能量不会丢失。"},
        },
        22: {
            requirementDescription: "23精通",
            done() {return player[this.layer].best.gte(23)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通神经元: 神经元更便宜，思想基础需求为1.96而非2。"},
        },
        23: {
            requirementDescription: "24精通",
            done() {return player[this.layer].best.gte(24)},
            effectDescription(){ return layers.ma.getMilestoneDesc()+"<br>精通能量: 能量需求降为1，心智瓦特获取更好，以100%速率获取所有4种瓦特类型，精通里程碑提升能量。"},
        },
24: {
    requirementDescription: "25精通",
    done() {return player[this.layer].best.gte(25)},
    effectDescription(){ 
        return layers.ma.getMilestoneDesc()+"<br>精通机器人：精通里程碑增强机器人效果，部分机器人可购买项效果提升"
    },
},
25: {
    requirementDescription: "26精通", 
    done() {return player[this.layer].best.gte(26)},
    effectDescription(){ 
        return layers.ma.getMilestoneDesc()+"<br>精通灵感：灵感效果达到最大值"
    },
},
26: {
    requirementDescription: "27精通",
    done() {return player[this.layer].best.gte(27)},
    effectDescription(){ 
        return layers.ma.getMilestoneDesc()+"<br>精通AI：精通里程碑增强超级智能和人工意识效果，每秒获得100%超级智能获取量"
    },
},
    },
    marked: function(){return player.ma.points.gte(20)}
});



addLayer("ge", {
    name: "齿轮",
    symbol: "GE",
    position: 1,
    row: 6,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        rotations: new Decimal(0),
    }},
    color: "#bfbfbf",
    requires: function(){
        if(player.ma.points.gte(21))return new Decimal(1);
        return new Decimal(1e168);
    },
    nodeStyle() { return {
        "background": ((((player.ge.unlocked||canReset("ge"))))?("radial-gradient(circle, #bfbfbf 0%, #838586 100%)"):"#bf8f8f") ,
    }},
    componentStyles: {
        "prestige-button"() {return { "background": (canReset("ge"))?("radial-gradient(circle, #bfbfbf 0%, #838586 100%)"):"#bf8f8f" }},
    },
    resource: "齿轮",
    baseResource: "太阳能量", 
    baseAmount() {return player.o.energy},
    type: "normal",
    exponent: 0.1,
    hotkeys: [
        {key: "E", description: "按下Shift+E进行齿轮重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.ma.unlocked},
    branches: ["l", "r"],
    gainMult(){
        let ret=new Decimal(1);
        if(hasMilestone("en",0))ret = ret.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        ret = ret.mul(buyableEffect("mc",22));
        ret = ret.mul(buyableEffect("r",13));
        if(player.ma.points.gte(21))ret = ret.mul(buyableEffect("m",13));
        if(hasUpgrade("ai",22))ret = ret.mul(tmp.id.revEff);
        return ret;
    },
    effect() {
        let ret = player.ge.points;
        ret = ret.mul(buyableEffect("ge",11));
        ret = ret.mul(buyableEffect("ge",12));
        ret = ret.mul(buyableEffect("r",13));
        if(player.ma.points.gte(21))ret = ret.mul(buyableEffect("m",13));
        if(hasUpgrade("ai",22))ret = ret.mul(tmp.id.revEff);
        
			if (player.c.unlocked && tmp.c)ret = ret.mul(tmp.c.eff4);
        return ret;
    },
    effectDescription() {
        let eff = this.effect();
        return "每秒生成"+format(eff)+"转数";
    },
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    milestones: {
        0: {
            requirementDescription: "1齿轮",
            done() {return player[this.layer].best.gte(1)},
            effectDescription: "每个精通现在给予2.5倍超级点数/生命精华/超空间能量(原为2倍)。魔法符文效果增强，时间胶囊新增精通效果。幽灵被削弱但效果软上限移除。",
        },
        1: {
            requirementDescription: "50齿轮",
            done() {return player[this.layer].best.gte(50)},
            effectDescription: "每秒获得100%生命精华增益。",
        },
        2: {
            requirementDescription: "1e6齿轮",
            done() {return player[this.layer].best.gte(1e6)},
            effectDescription: "解锁一个齿轮可购买项。",
        },
        3: {
            requirementDescription: "1e19齿轮",
            done() {return player[this.layer].best.gte(1e19)},
            effectDescription: "第一个齿轮可购买项更便宜。",
        },
    },
    update(diff){
        player.ge.rotations = player.ge.rotations.add(tmp.ge.effect.times(diff)).max(0)
    },
    tabFormat: ["main-display",
        "prestige-button", "resource-display",
        ["blank", "5px"],
        ["display-text",
            function() {
                return '你有' + format(player.ge.rotations) + '转数，'+(player.ma.points.gte(21)?'将':'为')+'幻影灵魂基础'+ (player.ma.points.gte(21)?'乘以':'增加') + format(tmp.ge.rotationEff);
            },
            {}],
        "buyables",
        "upgrades",
        "milestones",
    ],
    rotationEff(){
        let ret=player.ge.rotations.add(1).log10().div(10).add(1);
        return ret;
    },
    buyables: {
        rows: 1,
        cols: 3,
        11: {
            title: "齿轮速度",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(2, x.add(hasMilestone("ge",3)?0:7).pow(1.5));
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = Decimal.pow(buyableEffect("ge",13).mul(2), x);
                if(hasMilestone("mc",5))eff = Decimal.pow(buyableEffect("ge",13).mul(buyableEffect("mc",13)).mul(2), x);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "成本: " + format(data.cost) + " 齿轮\n\
                等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
                "当前: 转数获取乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("ge",2) }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        12: {
            title: "齿轮加速",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(10, x.pow(1.5));
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = Decimal.pow(buyableEffect("ge",13).mul(2), x);
                if(hasMilestone("mc",5))eff = Decimal.pow(buyableEffect("ge",13).mul(buyableEffect("mc",13)).mul(2), x);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "成本: " + format(data.cost) + " 转数\n\
                等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
                "当前: 转数获取乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("en",1) }, 
            canAfford() {
                return player[this.layer].rotations.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].rotations= player[this.layer].rotations.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        13: {
            title: "齿轮进化",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(hasUpgrade("ai",21)?1e40:hasMilestone("sp",21)?1e50:1e70,Decimal.pow(1.1,x));
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = x.div(20).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "成本: " + format(data.cost) + " 转数\n\
                等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
                "当前: 前2个齿轮和机器可购买项的基础乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("en",2) }, 
            canAfford() {
                return player[this.layer].rotations.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].rotations= player[this.layer].rotations.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
    },
    passiveGeneration() { return (hasMilestone("r", 0)?1:0) },
    marked: function(){return player.ma.points.gte(21)}
});

addLayer("mc", {
    name: "机器",
    symbol: "MC",
    position: 3,
    row: 6,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        mechEn: new Decimal(0),
    }},
    color: "#c99a6b",
    requires: function(){
        if(player.ma.points.gte(22))return new Decimal(1);
        if(hasMilestone("sp",22))return new Decimal(1e168);
        return new Decimal(1e258);
    },
    nodeStyle() { return {
        "background": ((((player.mc.unlocked||canReset("mc"))))?("radial-gradient(circle, #c99a6b 0%, #706d6d 100%)"):"#bf8f8f") ,
    }},
    componentStyles: {
        "prestige-button"() {return { "background": (canReset("mc"))?("radial-gradient(circle, #c99a6b 0%, #706d6d 100%)"):"#bf8f8f" }},
    },
    resource: "机器能量",
    baseResource: "子空间", 
    baseAmount() {return player.ss.subspace},
    type: "normal",
    exponent: 0.1,
    hotkeys: [
        {key: "C", description: "按下C进行机器重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.ge.unlocked},
    branches: ["hs", "i", "id"],
    gainMult(){
        let ret=new Decimal(1);
        if(hasMilestone("ne",0))ret = ret.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        ret = ret.mul(buyableEffect("mc",22));
        ret = ret.mul(buyableEffect("r",31));
        if(hasUpgrade("ai",22))ret = ret.mul(tmp.id.revEff);
        if(hasMilestone("ai",4))ret = ret.mul(buyableEffect("m",23));
        return ret;
    },
    effect() {
        let ret = player.mc.points;
        ret = ret.mul(buyableEffect("mc",11));
        ret = ret.mul(buyableEffect("mc",12));
        ret = ret.mul(tmp.id.revEff);
        ret = ret.mul(buyableEffect("r",31));
        if(hasMilestone("ai",4))ret = ret.mul(buyableEffect("m",23));
        
			if (player.c.unlocked && tmp.c)ret = ret.mul(tmp.c.eff4);
        return ret;
    },
    effectDescription() {
        let eff = this.effect();
        return "每秒生成"+format(eff)+"机械能量";
    },
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    milestones: {
        0: {
            requirementDescription: "1机器能量",
            done() {return player[this.layer].best.gte(1)},
            effectDescription: "每个精通现在给予3倍超级点数/生命精华/超空间能量(原为2.5倍)。自动购买帝国砖块且不重置任何内容。",
        },
        1: {
            requirementDescription: "1e5机器能量",
            done() {return player[this.layer].best.gte(1e5)},
            effectDescription: "自动购买超空间。",
        },
        2: {
            requirementDescription: "1e9机器能量",
            done() {return player[this.layer].best.gte(1e9)},
            effectDescription: "解锁一个机器可购买项。",
        },
        3: {
            requirementDescription: "1e11机器能量",
            done() {return player[this.layer].best.gte(1e11)},
            effectDescription: "第一个机器可购买项更便宜。",
        },
        4: {
            requirementDescription: "1机器升级",
            unlocked() {return hasMilestone("ne",2)},
            done() {return player[this.layer].buyables[13].gte(1)},
            effectDescription: "解锁一个新标签页。",
        },
        5: {
            requirementDescription: "3机器升级",
            unlocked() {return hasMilestone("ne",2)},
            done() {return player[this.layer].buyables[13].gte(3)},
            effectDescription: "机器升级影响前2个齿轮可购买项。",
        },
        6: {
            requirementDescription: "5机器升级",
            unlocked() {return hasMilestone("ne",2)},
            done() {return player[this.layer].buyables[13].gte(5)},
            effectDescription: "解锁端口。",
        },
        7: {
            requirementDescription: "10机器升级",
            unlocked() {return hasMilestone("ne",2)},
            done() {return player[this.layer].buyables[13].gte(10)},
            effectDescription: "解锁北桥。",
        },
        8: {
            requirementDescription: "14机器升级",
            unlocked() {return hasMilestone("ne",2)},
            done() {return player[this.layer].buyables[13].gte(14)},
            effectDescription: "解锁南桥。",
        },
        9: {
            requirementDescription: "15机器升级",
            unlocked() {return hasMilestone("ne",2)},
            done() {return player[this.layer].buyables[13].gte(15)},
            effectDescription: "每秒获得100%机器能量增益。",
        },
        10: {
            requirementDescription: "17机器升级",
            unlocked() {return hasMilestone("ne",2)},
            done() {return player[this.layer].buyables[13].gte(17)},
            effectDescription: "主板自动购买。",
        },
    },
    update(diff){
        if(player.ma.points.gte(22))player.mc.mechEn = player.mc.mechEn.add(tmp.mc.effect.mul(diff));
        else player.mc.mechEn = tmp.mc.effect.times(100).sub(tmp.mc.effect.times(100).sub(player.mc.mechEn).mul(Decimal.pow(0.99,diff)));
        if(hasMilestone("mc",10)){
            player.mc.buyables[21]=player.mc.buyables[21].add(player.mc.mechEn.mul(diff));
            player.mc.buyables[22]=player.mc.buyables[22].add(player.mc.mechEn.mul(diff));
            player.mc.buyables[31]=player.mc.buyables[31].add(player.mc.mechEn.mul(diff));
            player.mc.buyables[32]=player.mc.buyables[32].add(player.mc.mechEn.mul(diff));
        }
    },
	 tabFormat: {"Main Tab":{"content":["main-display",
        "prestige-button", "resource-display",
        ["blank", "5px"],
        ["display-text",
            function() {
                return '你有' + format(player.mc.mechEn) + '机械能量，将超空间能量指数乘以' + format(tmp.mc.mechEff);
            },
            {}],
            ["display-text",function(){if(player.ma.points.gte(22))return "";return "你的机械能量正以每秒1%的速度流失。"}],
            ["row",[["buyable",11],["buyable",12],["buyable",13]]],
            "upgrades",
            "milestones",
    ]},
     "The Motherboard":{"content":["main-display",
        "prestige-button", "resource-display",
        ["blank", "5px"],
        ["display-text",
            function() {
                return '你有' + format(player.mc.mechEn) + '机械能量，将超空间能量指数乘以' + format(tmp.mc.mechEff);
            },
            {}],
            ["display-text","你的机械能量正以每秒1%的速度流失。"],
            ["row",[["buyable",21],["buyable",22]]],
            ["row",[["buyable",31],["buyable",32]]],
    ],unlocked(){return hasMilestone("mc",4)}
    },
    },
    mechEff(){
        let ret=player.mc.mechEn.add(1).log10().div(10).add(1);
        return ret;
    },
    buyables: {
        rows: 1,
        cols: 3,
        11: {
            title: "机器速度",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(2, x.add(hasMilestone("mc",3)?0:7).pow(1.5));
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = Decimal.pow(buyableEffect("ge",13).mul(buyableEffect("mc",13)).mul(2), x);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "成本: " + format(data.cost) + " 机器能量\n\
                等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
                "当前: 机械能量获取乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("mc",2) }, 
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        12: {
            title: "机器效率",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = Decimal.pow(10, x.pow(1.5));
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = Decimal.pow(buyableEffect("ge",13).mul(buyableEffect("mc",13)).mul(2), x);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "成本: " + format(data.cost) + " 机械能量\n\
                等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
                "当前: 机械能量获取乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("ne",1) }, 
            canAfford() {
                return player[this.layer].mechEn.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].mechEn= player[this.layer].mechEn.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        13: {
            title: "机器升级",
            cost(x=player[this.layer].buyables[this.id]) {
                let cost = new Decimal(hasUpgrade("ai",21)?1e40:1e50).pow(Decimal.pow(1.1,x));
                return cost
            },
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = x.div(20).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "成本: " + format(data.cost) + " 机械能量\n\
                等级: " + format(player[this.layer].buyables[this.id]) + "\n"+
                "当前: 前2个机器可购买项的基础乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("ne",2) }, 
            canAfford() {
                return player[this.layer].mechEn.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].mechEn= player[this.layer].mechEn.sub(cost)    
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
        },
        21: {
            title: "CPU",
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = player[this.layer].buyables[this.id].add(1).log10().pow(player[this.layer].buyables[13]).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "激活: " + format(player[this.layer].buyables[this.id]) + " 机械能量\n\
                当前: 机器升级等级将超级点数乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("mc",4) }, 
            canAfford() {
                return player[this.layer].mechEn.gte(player[this.layer].buyables[this.id])
            },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(player[this.layer].mechEn)
                player[this.layer].mechEn = new Decimal(0)
            },
        },
        22: {
            title: "端口",
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = player[this.layer].buyables[this.id].add(1).log10().pow(player[this.layer].buyables[13].sqrt()).add(1).pow(0.2);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "激活: " + format(player[this.layer].buyables[this.id]) + " 机械能量\n\
                当前: 机器升级等级将齿轮和机器能量乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("mc",6) }, 
            canAfford() {
                return player[this.layer].mechEn.gte(player[this.layer].buyables[this.id])
            },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(player[this.layer].mechEn)
                player[this.layer].mechEn = new Decimal(0)
            },
        },
        31: {
            title: "北桥",
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = player[this.layer].buyables[this.id].add(1).log10().pow(player[this.layer].buyables[13].pow(0.6)).add(1).pow(0.3);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "激活: " + format(player[this.layer].buyables[this.id]) + " 机械能量\n\
                当前: 机器升级等级将超空间能量乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("mc",7) }, 
            canAfford() {
                return player[this.layer].mechEn.gte(player[this.layer].buyables[this.id])
            },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(player[this.layer].mechEn)
                player[this.layer].mechEn = new Decimal(0)
            },
        },
        32: {
            title: "南桥",
            effect(x=player[this.layer].buyables[this.id]) {
                let eff = player[this.layer].buyables[this.id].add(1).log10().pow(player[this.layer].buyables[13]).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "激活: " + format(player[this.layer].buyables[this.id]) + " 机械能量\n\
                当前: 机器升级等级将生命精华乘以"+format(data.effect)+"倍";
            },
            unlocked() { return hasMilestone("mc",8) }, 
            canAfford() {
                return player[this.layer].mechEn.gte(player[this.layer].buyables[this.id])
            },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(player[this.layer].mechEn)
                player[this.layer].mechEn = new Decimal(0)
            },
        },
    },
    passiveGeneration() { return (hasMilestone("mc", 9)?1:0) },
    marked: function(){return player.ma.points.gte(22)}
});

addLayer("ne", {
    name: "神经元",
    symbol: "NE",
    position: 4,
    row: 4,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        signals: new Decimal(0),
        thoughts: new Decimal(0),
    }},
    color: "#ded9ff",
    requires() { if(hasMilestone("ai",0))return new Decimal(1); if(hasUpgrade("q",25))return new Decimal(1); return new Decimal("1e370") },
    resource: "神经元",
    baseResource: "子空间",
    baseAmount() {return player.ss.subspace},
    type: "static",
    exponent: new Decimal(2),
    base(){ 
        let a = new Decimal("1e100");
        if(hasUpgrade("q",43))a = a.root(2);
        if(hasUpgrade("ai",12))a = a.root(2.5);
        if(player.ma.points.gte(23))a = a.root(2);
        return a;
    },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    canBuyMax() { return false },
    row: 4,
    hotkeys: [
        {key: "U", description: "按下U进行神经元重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.mc.unlocked},
    doReset(resettingLayer){ 
        let keep = ["milestones","challenges"];
        if (layers[resettingLayer].row<7&&resettingLayer!="id"&&resettingLayer!="ai"&&resettingLayer!="c") {
            keep.push("thoughts")
            keep.push("buyables")
        }
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    branches: ["ss", "sg"],
    update(diff) {
        if (player.ne.unlocked && player.ne.activeChallenge==11) {
            player.ne.challenges[11]=player.points.max(player.ne.challenges[11]).toNumber();
        }
        
        if (player.ne.unlocked && (player.ne.activeChallenge==11 || hasMilestone("id",3))) {
            player.ne.signals = player.ne.signals.plus(layers.ne.challenges[11].amt().times(diff)).min((hasMilestone("ne", 4)||hasMilestone("id", 0))?(Decimal.dInf):tmp.ne.signalLim);
            if (player.ne.signals.gte(tmp.ne.signalLim.times(0.999))) {
                if (hasMilestone("id", 0)) player.ne.thoughts = player.ne.thoughts.max(tmp.ne.thoughtTarg);
                else {
                    if (!hasMilestone("ne", 4)) player.ne.signals = new Decimal(0);
                    player.ne.thoughts = player.ne.thoughts.plus(1);
                }
            }
            if (hasMilestone("ai", 2)) layers.ne.buyables[11].buyMax();
        }
    },
    effect() {
        let eff = player[this.layer].points;
        if(hasMilestone("ne", 3))eff = eff.times(Decimal.pow(2,player[this.layer].points));
        return eff;
    },
    effectDescription() { return "将信号获取速度乘以<h2 style='color: #ded9ff; text-shadow: #ded9ff 0px 0px 10px;'>"+format(tmp[this.layer].effect)+"</h2>倍。" },
    signalLimThresholdInc() {
        let inc = new Decimal(player.ma.points.gte(23)?1.96:hasMilestone("ne", 4)?2:(hasMilestone("ne", 3)?2.5:(hasMilestone("ne", 2)?3:5)));
        if (player.id.unlocked) inc = inc.sub(layers.id.effect());
        return inc;
    },
    signalLimThresholdDiv() {
        let div = new Decimal(1);
			if (player.c.unlocked && tmp.c) div = div.times(tmp.c.eff2);
        return div;
    },
    signalLim() { return Decimal.pow(layers[this.layer].signalLimThresholdInc(), player.ne.thoughts).times(100).div(layers[this.layer].signalLimThresholdDiv()) },
    thoughtEff2() { return player.ne.thoughts.add(1).log10().div(hasMilestone("id", 2)?85:hasMilestone("id", 1)?97:100).add(1).pow(hasMilestone("ne", 2)?2:1).pow(hasMilestone("i", 6)?2:1); },
    thoughtEff3() { return Decimal.pow(1.2, player.ne.thoughts.times(hasMilestone("id", 2)?3:hasMilestone("id", 1)?2:hasMilestone("ne", 5)?1:0).sqrt()) },
    thoughtTarg() { return player.ne.signals.times(layers[this.layer].signalLimThresholdDiv()).div(100).max(1).log(layers[this.layer].signalLimThresholdInc()).plus(1).floor() },
    challenges: {
        rows: 1,
        cols: 1,
        11: {
            name: "大脑",
            challengeDescription: "阻碍精神的奖励加成效果为0；声望升级2、助推器和生成器被禁用。<br>",
            unlocked() { return player.ne.unlocked && player.ne.points.gt(0) },
            gainMult() { 
                let mult = tmp.ne.effect.times(player.ne.signals.plus(1).log10().plus(1));
                if (hasMilestone("ne", 0)) mult = mult.times(player.ss.points.plus(1).sqrt());
                if (hasMilestone("ne", 2)) mult = mult.times(player.ne.points.max(1));
                if (player.en.unlocked && hasMilestone("en", 3)) mult = mult.times(tmp.en.mwEff);
                mult = mult.times(buyableEffect("r",12));
                if(hasUpgrade("q",25))mult = mult.times(2);
                if(hasUpgrade("q",43))mult = mult.times(2);
                mult = mult.times(buyableEffect("l",15));
                mult = mult.mul(tmp.ai.conscEff1);
                if(hasMilestone("ai",4))mult = mult.mul(buyableEffect("m",33));
                if(hasUpgrade("ai",31))mult = mult.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
                return mult;
            },
            amt() { 
                let a = Decimal.pow(10, player.points.div(20).pow(3));
                if(a.gte(16.91))a = Decimal.pow(10, player.points.div(19).pow(3.5));
                if(hasMilestone("id",3))a = Decimal.pow(10, Decimal.div(player.ne.challenges[11],18).pow(4));
                a = a.pow(tmp.ne.buyables[11].effect).times(tmp.ne.challenges[11].gainMult);
                if (!a.eq(a)) return new Decimal(0);
                return a;
            },
            canComplete: false,
            completionLimit: Infinity,
            goalDescription(){return format(player[this.layer].challenges[this.id],4)},
            rewardDescription() { let ret="基于大脑中"+(hasMilestone("id",3)?"最高":"")+"点数获取信号。<br>信号: <h3 style='color: #ded9ff'>"+formatWhole(player.ne.signals)+"/"+formatWhole(tmp.ne.signalLim)+"</h3> "+("(+"+formatWhole((player.ne.activeChallenge==11 || hasMilestone("id",3))?tmp.ne.challenges[11].amt:0)+"/秒)")+"<br><br><br>思考: <h3 style='color: #ffbafa'>"+formatWhole(player.ne.thoughts)+"</h3> (下一个在"+formatWhole(tmp.ne.signalLim)+"信号)<br><br>效果<br>子空间能量基于思考变得更便宜(10 -> "+format(tmp.ss.requires)+")";
            if(hasMilestone("ne",1))ret = ret+"<br>将子空间和SG基础乘以"+format(tmp.ne.thoughtEff2)+"倍";
            if(hasMilestone("ne",5))ret = ret+"<br>将能量获取乘以"+format(tmp.ne.thoughtEff3)+"倍";
            return ret;
            },
            onEnter(){
                doReset("m",true);
                player.ne.activeChallenge=11;
            },
            style() { return {'background-color': "#484659", filter: "brightness("+(100+player.ne.signals.plus(1).log10().div(tmp.ne.signalLim.plus(1).log10()).times(50).toNumber())+"%)", color: "white", 'border-radius': "25px", height: "400px", width: "400px"}},
        },
    },
    buyables: {
        rows: 1,
        cols: 1,
        11: {
            title: "神经网络",
            cost(x=player[this.layer].buyables[this.id]) {
                x = Decimal.pow(10, x.add(1).log10().pow(1.5));
                return Decimal.pow(4, x.pow(1.2)).times(1e3);
            },
            bulk(r=player.ne.signals) {
                let b = r.div(1e3).max(1).log(4).root(1.2);
                b = Decimal.pow(10, b.max(1).log10().root(1.5));
                return b.floor().max(0);
            },
            power() {
                    let p = new Decimal(1);
					if (player.c.unlocked && tmp.c) p = p.times(tmp.c.eff5);
					return p;
            },
            effect() { return player[this.layer].buyables[this.id].times(tmp.ne.buyables[11].power).div(3).plus(1) },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                let cost = data.cost;
                let amt = player[this.layer].buyables[this.id];
                let display = "成本: "+format(cost)+" 信号<br><br>等级: "+formatWhole(amt)+"<br><br>效果: 来自点数的信号获取提升^"+format(data.effect);
                return display;
            },
            unlocked() { return hasMilestone("ne", 0) }, 
            canAfford() {
                if (!tmp[this.layer].buyables[this.id].unlocked) return false;
                return player[this.layer].unlocked && player.ne.signals.gte(layers[this.layer].buyables[this.id].cost());
            },
            buy() { 
                player.ne.signals = player.ne.signals.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                player.ne.buyables[this.id] = player.ne.buyables[this.id].plus(1);
            },
            buyMax() { player.ne.buyables[this.id] = player.ne.buyables[this.id].max(tmp.ne.buyables[11].bulk) },
            style: {'height':'250px', 'width':'250px', 'background-color'() { return tmp.ne.buyables[11].canAfford?'#a2cade':'#bf8f8f' }, "border-color": "#a2cade"},
        },
    },
    milestones: {
        0: {
            requirementDescription: "2,000信号",
            done() { return player.ne.signals.gte(2000) || player.ne.milestones.includes(0) },
            effectDescription() { return "子空间能量乘以信号获取("+format(player.ss.points.plus(1).sqrt())+"倍)，精通里程碑提升机器能量并解锁神经网络。" },
        },
        1: {
            requirementDescription: "80,000信号",
            done() { return player.ne.signals.gte(8e4) || player.ne.milestones.includes(1) },
            effectDescription() { return "解锁新的思考效果，并解锁第2个机器可购买项。" },
        },
        2: {
            requirementDescription: "3,000,000信号",
            done() { return player.ne.signals.gte(3e6) || player.ne.milestones.includes(2) },
            effectDescription() { return "思考需求增长变慢(5倍 -> 3倍)，第二个思考效果被平方，并将信号获取乘以你的神经元，并解锁第3个机器可购买项。" },
        },
        3: {
            requirementDescription: "100,000,000信号",
            done() { return player.ne.signals.gte(1e8) || player.ne.milestones.includes(3) },
            effectDescription() { return "思考需求增长更慢(3倍 -> 2.5倍)，并且神经元效果使用更好的公式。" },
        },
        4: {
            requirementDescription: "2.5e9信号",
            done() { return player.ne.signals.gte(2.5e9) || player.ne.milestones.includes(4) },
            effectDescription() { return "思考需求增长更慢(2.5倍 -> 2倍)，并且获得思考不会重置信号" },
        },
        5: {
            requirementDescription: "1e16信号",
            done() { return player.ne.signals.gte(1e16) || player.ne.milestones.includes(5) },
            effectDescription() { return "第一个思考效果达到最大。解锁新的思考效果。" },
        },
    },
    canBuyMax() { return hasMilestone("ai",0) },
    autoPrestige() { return hasMilestone("ai",0) },
    resetsNothing() { return hasMilestone("ai",0) },
    marked: function(){return player.ma.points.gte(23)}
});

addLayer("en", {
    name: "能量",
    symbol: "EN",
    position: 0,
    row: 4,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        bestOnReset: new Decimal(0),
        total: new Decimal(0),
        stored: new Decimal(0),
        target: 0,
        tw: new Decimal(0),
        ow: new Decimal(0),
        sw: new Decimal(0),
        mw: new Decimal(0),
    }},
    color: "#fbff05",
    resource: "能量",
    type: "normal",
    baseResource: "太阳能量",
    baseAmount() { return player.o.points },
    requires() { 
        if(hasMilestone("c",0))return new Decimal(1);
        if(player.ma.points.gte(24))return new Decimal(1);
        if (hasMilestone("r", 3))return Decimal.pow("1e162",Decimal.pow(0.95,player.r.total.add(1).log10()));
        return new Decimal("1e162")
    },
    exponent() { return new Decimal(0.1) },
    passiveGeneration() { return hasMilestone("en", 0)?buyableEffect("r",11).mul(0.1).min(1).toNumber():0 },
    canReset() {
        if(!tmp.en.resetGain.gte)tmp.en.resetGain=new Decimal(0);
        if(tmp.en.resetGain.gte(1) && hasMilestone("r",1))return true;
        return player.o.points.gte(tmp.en.req) && tmp.en.resetGain.gte(1) && (hasMilestone("en", 0)?player.en.points.lt(tmp.en.resetGain):player.en.points.eq(0))
    },
    prestigeNotify() {
        if(!tmp.en.resetGain.gte)tmp.en.resetGain=new Decimal(0);
        if (!canReset("en")) return false;
        if (tmp.en.resetGain.gte(player.o.points.times(0.1).max(1)) && !tmp.en.passiveGeneration) return true;
        else return false;
    },
    row: 4,
    hotkeys: [
        {key: "Y", description: "按下Y进行能量重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = ["milestones","target"];
        if (resettingLayer==this.layer) player.en.target = player.en.target%(hasMilestone("en", 3)?4:3)+1;
        if (layers[resettingLayer].row<7 && resettingLayer!="r" && resettingLayer!="ai" && resettingLayer!="c") {
            keep.push("tw");
            keep.push("sw");
            keep.push("ow");
            keep.push("mw");
        }
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    gainMult() {
        let mult = new Decimal(1);
        if (hasMilestone("en", 0)) mult = mult.times(2);
        if (hasMilestone("en", 2)) mult = mult.times(player.o.points.plus(1).log10().plus(1).log10().plus(1));
        mult = mult.mul(tmp.en.clickables[11].eff);
        mult = mult.times(buyableEffect("r",11));
        if (hasMilestone("i", 7)) mult = mult.times(player.i.points.add(1));
        if(hasMilestone("ne",5))mult = mult.times(tmp.ne.thoughtEff3);
        if(hasMilestone("h",44))mult = mult.times(layers.h.getHCBoost());
        mult = mult.mul(tmp.ai.conscEff1);
        if(player.ma.points.gte(24))mult = mult.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        return mult;
    },
    onPrestige(gain) { player.en.bestOnReset = player.en.bestOnReset.max(gain) },
    layerShown(){return player.ne.unlocked },
    branches: ["sb","o"],
    update(diff) {
        if (!player[this.layer].unlocked) return;
        let subbed = new Decimal(0);
        if (player.en.points.gt(0)) {
            subbed = player.en.points.times(Decimal.sub(1, Decimal.pow(0.75, diff))).plus(diff);
            player.en.points = player.en.points.times(Decimal.pow(0.75, diff)).sub(diff).max(0);
            if (hasMilestone("en", 1)) player.en.stored = player.en.stored.plus(subbed.div(5));
        }
			let sw_mw_exp = hasUpgrade("ai", 42)?0.6:1
        if (hasMilestone("r", 2) || player.ma.points.gte(24)) {
            if (hasMilestone("r", 3))subbed = subbed.times(buyableEffect("r",11).max(1));
            player.en.tw = player.en.tw.pow(1.5).plus(subbed.div((player.en.target==1 || player.ma.points.gte(24))?1:3)).root(1.5);
            player.en.ow = player.en.ow.pow(1.5).plus(subbed.div((player.en.target==2 || player.ma.points.gte(24))?1:3)).root(1.5);
            player.en.sw = player.en.sw.pow(sw_mw_exp*(hasMilestone("en", 4)?2.5:4)).plus(subbed.div((player.en.target==3 || player.ma.points.gte(24))?1:3)).root(sw_mw_exp*(hasMilestone("en", 4)?2.5:4));
            if (hasMilestone("en", 3)) player.en.mw = player.en.mw.pow(sw_mw_exp*(player.ma.points.gte(24)?2.5:hasMilestone("en", 4)?5.5:7)).plus(subbed.div((player.en.target==4 || player.ma.points.gte(24))?1:3)).root(sw_mw_exp*(player.ma.points.gte(24)?2.5:hasMilestone("en", 4)?5.5:7));
            
        } else switch(player.en.target) {
            case 1: 
                player.en.tw = player.en.tw.pow(1.5).plus(subbed).root(1.5);
                break;
            case 2: 
                player.en.ow = player.en.ow.pow(1.5).plus(subbed).root(1.5);
                break;
            case 3: 
                player.en.sw = player.en.sw.pow(sw_mw_exp*(hasMilestone("en", 4)?2.5:4)).plus(subbed).root(sw_mw_exp*(hasMilestone("en", 4)?2.5:4));
                break;
            case 4: 
                if (hasMilestone("en", 3)) player.en.mw = player.en.mw.pow(sw_mw_exp*(hasMilestone("en", 4)?5.5:7)).plus(subbed).root(sw_mw_exp*(hasMilestone("en", 4)?5.5:7));
                break;
        }
    },
    storageLimit() { return player.en.total.div(2) },
		twEff() { if(hasUpgrade("ai", 42))return player.en.tw.plus(1).log10().plus(1); return player.en.tw.plus(1).log10().plus(1).log10().plus(1) },
    owEff() { return player.en.ow.plus(1).log10().plus(1).log10().plus(1).log10().plus(1) },
    swEff() { return player.en.sw.plus(1).log10().plus(1).log10().div(10).plus(1) },
    mwEff() { return hasMilestone("en", 3)?player.en.mw.plus(1).log10().plus(1).log10().plus(1).pow(3):new Decimal(1) },
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display", "blank",
        "milestones",
        "blank", "blank", 
        "clickables",
        "blank", "blank",
        ["row", [
            ["column", [["display-text", function() { return "<h3 style='color: "+((player.en.target==1 || player.ma.points.gte(24))?"#e1ffde;":"#8cfa82;")+"'>"+((player.en.target==1 || player.ma.points.gte(24))?"时间瓦特":"时间瓦特")+"</h3>" }], ["display-text", function() { return "<h4 style='color: #8cfa82;'>"+formatWhole(player.en.tw)+"</h4><br><br>时间胶囊基础x<span style='color: #8cfa82; font-weight: bold; font-size: 20px;'>"+format(tmp.en.twEff)+"</span>" }]], {width: "100%"}],
            ]], "blank", "blank", ["row", [
            ["column", [["display-text", function() { return "<h3 style='color: "+((player.en.target==2 || player.ma.points.gte(24))?"#fff0d9":"#ffd187;")+"'>"+((player.en.target==2 || player.ma.points.gte(24))?"太阳瓦特":"太阳瓦特")+"</h3>" }], ["display-text", function() { return "<h4 style='color: #ffd187;'>"+formatWhole(player.en.ow)+"</h4><br><br>太阳能量获取指数x<span style='color: #ffd187; font-weight: bold; font-size: 20px;'>"+format(tmp.en.owEff)+"</span>" }]], {width: "50%"}],
            ["column", [["display-text", function() { return "<h3 style='color: "+((player.en.target==3 || player.ma.points.gte(24))?"#dbfcff;":"#8cf5ff;")+"'>"+((player.en.target==3 || player.ma.points.gte(24))?"超级瓦特":"超级瓦特")+"</h3>" }], ["display-text", function() { return "<h4 style='color: #8cf5ff;'>"+formatWhole(player.en.sw)+"</h4><br><br>超级助推器基础x<span style='color: #8cf5ff; font-weight: bold: font-size: 20px;'>"+format(tmp.en.swEff)+"</span>" }]], {width: "50%"}],
            ]], "blank", "blank", ["row", [
            ["column", [["display-text", function() { return hasMilestone("en", 3)?("<h3 style='color: "+((player.en.target==4 || player.ma.points.gte(24))?"#f4deff;":"#d182ff;")+"'>"+((player.en.target==4 || player.ma.points.gte(24))?"心灵瓦特":"心灵瓦特")+"</h3>"):"" }], ["display-text", function() { return hasMilestone("en", 3)?("<h4 style='color: #d182ff;'>"+formatWhole(player.en.mw)+"</h4><br><br>将信号获取乘以<span style='color: #d182ff; font-weight: bold; font-size: 20px;'>"+format(tmp.en.mwEff)+"</span>"):"" }]], {width: "75%"}],
        ], function() { return {display: hasMilestone("en", 3)?"none":""} }],
        "blank", "blank", "blank",
    ],
    clickables: {
        rows: 1,
        cols: 2,
        11: {
            title: "储存能量",
            display(){
                return "储存能量: <span style='font-size: 20px; font-weight: bold;'>"+formatWhole(player.en.stored)+" / "+formatWhole(tmp.en.storageLimit)+"</span><br><br>"+(tmp.nerdMode?("效果公式: log(log(x+1)+1)/5"):("将能量获取乘以<span style='font-size: 20px; font-weight: bold;'>"+format(tmp.en.clickables[11].eff)+"倍</span>"))
            },
            eff() { 
                let e = player.en.stored.sqrt().add(1);
                return e;
            },
            unlocked() { return player.en.unlocked },
            canClick() { return player.en.unlocked && player.en.points.gt(0) },
            onClick() { 
                player.en.stored = player.en.stored.plus(player.en.points).min(tmp.en.storageLimit);
                player.en.points = new Decimal(0);
            },
            style: {width: "160px", height: "160px"},
        },
        12: {
            title: "释放能量",
            display: "",
            unlocked() { return player.en.unlocked },
            canClick() { return player.en.unlocked && player.en.stored.gt(0) },
            onClick() { 
                player.en.points = player.en.points.plus(player.en.stored);
                player.en.best = player.en.best.max(player.en.points);
                player.en.stored = new Decimal(0);
            },
            style: {width: "80px", height: "80px"},
        },
    },
    milestones: {
        0: {
            requirementDescription: "单次重置获得100能量",
            done() { return player.en.bestOnReset.gte(100) },
            effectDescription: "每秒获得10%能量增益，当能量获取低于100%时仍可重置，能量获取翻倍。精通里程碑提升齿轮。",
        },
        1: {
            requirementDescription: "单次重置获得22,500能量",
            done() { return player.en.bestOnReset.gte(22500) },
            effectDescription: "随时间流失的能量的20%会被储存。解锁一个齿轮可购买项。",
        },
        2: {
            requirementDescription: "单次重置获得335,000能量",
            done() { return player.en.bestOnReset.gte(335e3) },
            effectDescription() { return "能量获取乘以太阳能量的双对数("+format(player.o.points.plus(1).log10().plus(1).log10().plus(1))+"倍)。解锁一个齿轮可购买项。" },
        },
        3: {
            requirementDescription: "单次重置获得1e8能量",
            done() { return player.en.bestOnReset.gte(1e8) },
            effectDescription() { return "解锁心灵瓦特。" },
        },
        4: {
            requirementDescription: "单次重置获得1e10能量",
            done() { return player.en.bestOnReset.gte(1e10) },
            effectDescription() { return "心灵瓦特和超级瓦特的获取根数减少1.5" },
        },
    },
    marked: function(){return player.ma.points.gte(24)}
});



addLayer("r", {
    name: "机器人", // 中文层名称
    symbol: "R", // 保持原符号不变
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#00ccff",
    requires(){
        if(hasMilestone("c",0))return new Decimal(1);
        if(hasMilestone("i",9))return new Decimal(1);
        return Decimal.pow(3e12,Decimal.pow(0.001,player.points.sub(25)));
    },
    resource: "机器人", // 中文资源名称
    baseResource: "总能量", // 中文基础资源名称
    baseAmount() {return player.en.total},
    type: "normal",
    exponent: 0.1,
    gainMult() {
        mult = new Decimal(1);
        if(hasMilestone("r",4))mult = mult.mul(buyableEffect("m",32));
        if (hasMilestone("i", 8)) mult = mult.times(player.i.points.add(1));
        if(hasMilestone("l",17))mult = mult.times(buyableEffect("l", 16));
        mult = mult.mul(buyableEffect("r",33));
        mult = mult.mul(tmp.ai.conscEff1);
        if(player.ma.points.gte(25))mult = mult.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        return mult;
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 5,
    hotkeys: [
        {key: "R", description: "R: 重置机器人", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if (layers[resettingLayer].row > this.row+1 || resettingLayer=="ai") layerDataReset(this.layer, keep)
    },
    layerShown(){return player.en.unlocked },
    branches: ["en"],
    tabFormat: {
            "Main Tab": {
            content: ["main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "buyables",
        ]
        },
            "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones"]
        },
    },
    milestones: {
        0: {
            requirementDescription: "1总机器人",
            done() { return player.r.total.gte(1)},
            effectDescription: "每秒获得100%的齿轮获取量",
        },
        1: {
            requirementDescription: "2总机器人",
            done() { return player.r.total.gte(2)},
            effectDescription: "解锁心智机器人。你可以随时进行能量重置",
        },
        2: {
            requirementDescription: "20总机器人",
            done() { return player.r.total.gte(20)},
            effectDescription: "未选中的瓦特仍会生成(但速度慢3倍)",
        },
        3: {
            requirementDescription: "100总机器人",
            done() { return player.r.total.gte(100)},
            effectDescription: "能量机器人提升瓦特获取，能量需求基于总机器人减少",
        },
        4: {
            requirementDescription: "300总机器人",
            done() { return player.r.total.gte(300)},
            effectDescription: "解锁一个新法术",
        },
        5: {
            requirementDescription: "2,000总机器人",
            done() { return player.r.total.gte(2000)},
            effectDescription: "解锁齿轮机器人",
        },
        6: {
            requirementDescription: "10,000总机器人",
            done() { return player.r.total.gte(10000)},
            effectDescription: "解锁太阳机器人",
        },
        7: {
            requirementDescription: "40,000总机器人",
            done() { return player.r.total.gte(40000)},
            effectDescription: "解锁超级机器人",
        },
        8: {
            requirementDescription: "100,000总机器人",
            done() { return player.r.total.gte(100000)},
            effectDescription: "解锁超空间机器人",
        },
        9: {
            requirementDescription: "2e6总机器人",
            done() { return player.r.total.gte(2e6)},
            effectDescription: "太阳机器人效果增强",
        },
        10: {
            requirementDescription: "5e6总机器人",
            done() { return player.r.total.gte(5e6)},
            effectDescription: "超级机器人效果增强",
        },
        11: {
            requirementDescription: "1e8总机器人",
            done() { return player.r.total.gte(1e8)},
            effectDescription: "能量机器人效果增强",
        },
        12: {
            requirementDescription: "1e12总机器人",
            done() { return player.r.total.gte(1e12)},
            effectDescription: "解锁机械机器人",
        },
        13: {
            requirementDescription: "5e12总机器人",
            done() { return player.r.total.gte(5e12)},
            effectDescription: "解锁生命机器人",
        },
        14: {
            requirementDescription: "1e14总机器人",
            done() { return player.r.total.gte(1e14)},
            effectDescription: "解锁元机器人",
        },
        15: {
            requirementDescription: "3e15总机器人",
            done() { return player.r.total.gte(3e15)},
            effectDescription: "能量机器人效果增强",
        },
        16: {
            requirementDescription: "2e16总机器人",
            done() { return player.r.total.gte(2e16)},
            effectDescription: "齿轮机器人效果增强",
        },
        17: {
            requirementDescription: "5e16总机器人",
            done() { return player.r.total.gte(5e16)},
            effectDescription: "每秒获得100%的机器人获取量",
        },
        18: {
            requirementDescription: "5e17总机器人",
            done() { return player.r.total.gte(5e17)},
            effectDescription: "机械机器人效果增强",
        },
        19: {
            requirementDescription: "2e18总机器人",
            done() { return player.r.total.gte(2e18)},
            effectDescription: "超空间机器人效果增强",
        },
        20: {
            requirementDescription: "8e18总机器人",
            done() { return player.r.total.gte(8e18)},
            effectDescription: "元机器人效果增强",
        },
        21: {
            requirementDescription: "1e20总机器人",
            done() { return player.r.total.gte(1e20)},
            effectDescription: "自动分配100%的机器人到所有9种类型而不消耗你的机器人",
        },
        22: {
            requirementDescription: "1e36总机器人",
            done() { return player.r.total.gte(1e36)},
            effectDescription: "心智机器人效果增强",
        },
    },
    buyables: {
        rows: 3,
        cols: 3,
        11: {
            title: "能量机器人",
            gain() { return player[this.layer].points },
            effect() { 
                if(hasUpgrade("sp",51))return player[this.layer].buyables[this.id].add(1);
                if(hasMilestone("r",15))return player[this.layer].buyables[this.id].pow(0.25).add(1);
                let eff = player[this.layer].buyables[this.id].mul(100).add(1).log10().add(1);
                if(hasMilestone("r",11))eff = eff.pow(2);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 能量机器人\n效果: 将能量获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍，被动能量获取乘以"+format(tmp[this.layer].buyables[this.id].effect.min(10))+"倍"))
                return display;
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
        12: {
            title: "心智机器人",
            gain() { return player[this.layer].points },
            effect() { 
                if(hasUpgrade("sp",51))return player[this.layer].buyables[this.id].add(1);
                if(player.ma.points.gte(25))return Decimal.pow(10,player[this.layer].buyables[this.id].add(1).log10().sqrt());
                if(hasMilestone("r",22))return Decimal.pow(10,player[this.layer].buyables[this.id].add(1).log10().root(3));
                let eff = player[this.layer].buyables[this.id].mul(100).add(1).log10().add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 心智机器人\n效果: 将信号获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍"));
                return display;
            },
            unlocked() { return hasMilestone(this.layer,1) }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
        13: {
            title: "齿轮机器人",
            gain() { return player[this.layer].points },
            effect() { 
                if(hasUpgrade("sp",51))return player[this.layer].buyables[this.id].add(1);
                if(hasMilestone("r",15))return Decimal.pow(10,player[this.layer].buyables[this.id].add(1).log10().sqrt());
                let eff = player[this.layer].buyables[this.id].mul(100).add(1).log10().add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 齿轮机器人\n效果: 将齿轮和旋转获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍"));
                return display;
            },
            unlocked() { return hasMilestone(this.layer,5) }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
        21: {
            title: "太阳机器人",
            gain() { return player[this.layer].points },
            effect() { 
                if(hasUpgrade("sp",51))return player[this.layer].buyables[this.id].add(1).pow(2);
                if(hasMilestone("r",9))return player[this.layer].buyables[this.id].add(1).pow(1.5);
                let eff = player[this.layer].buyables[this.id].mul(100).add(1).log10().add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 太阳机器人\n效果: 将太阳能量和太阳能量获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍"));
                return display;
            },
            unlocked() { return hasMilestone(this.layer,6) }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
        22: {
            title: "超级机器人",
            gain() { return player[this.layer].points },
            effect() { 
                if(hasUpgrade("sp",51))return player[this.layer].buyables[this.id].add(1).pow(2);
                if(player.ma.points.gte(25))return player[this.layer].buyables[this.id].pow(1.1).add(1);
                if(hasMilestone("r",10))return player[this.layer].buyables[this.id].mul(2).add(1);
                let eff = player[this.layer].buyables[this.id].mul(100).add(1).log10().add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 超级机器人\n效果: 将超级点数获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍"));
                return display;
            },
            unlocked() { return hasMilestone(this.layer,7) }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
        23: {
            title: "超空间机器人",
            gain() { return player[this.layer].points },
            effect() { 
                if(player.ma.points.gte(25))return player[this.layer].buyables[this.id].pow(1.1).add(1);
                if(hasMilestone("r",19))return Decimal.pow(10,player[this.layer].buyables[this.id].add(1).log10().sqrt());
                let eff = player[this.layer].buyables[this.id].mul(100).add(1).log10().add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 超空间机器人\n效果: 将超空间能量获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍"));
                return display;
            },
            unlocked() { return hasMilestone(this.layer,8) }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
        31: {
            title: "机械机器人",
            gain() { return player[this.layer].points },
            effect() { 
                if(hasUpgrade("sp",51))return player[this.layer].buyables[this.id].add(1);
                if(hasMilestone("r",18))return Decimal.pow(10,player[this.layer].buyables[this.id].add(1).log10().sqrt());
                let eff = player[this.layer].buyables[this.id].mul(100).add(1).log10().add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 机械机器人\n效果: 将机器能量和机械能量获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍"));
                return display;
            },
            unlocked() { return hasMilestone(this.layer,12) }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
        32: {
            title: "生命机器人",
            gain() { return player[this.layer].points },
            effect() { 
                if(player.ma.points.gte(25))return player[this.layer].buyables[this.id].pow(1.1).add(1);
                let eff = player[this.layer].buyables[this.id].mul(10).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 生命机器人\n效果: 将生命精华和生命能量获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍"));
                return display;
            },
            unlocked() { return hasMilestone(this.layer,13) }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
        33: {
            title: "元机器人",
            gain() { return player[this.layer].points },
            effect() { 
                let eff = player[this.layer].buyables[this.id].pow(hasMilestone("r",20)?0.2:0.1).add(1);
                return eff;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                let display = ("你有 " + formatWhole(player[this.layer].buyables[this.id])+(" 元机器人\n效果: 将机器人获取乘以"+format(tmp[this.layer].buyables[this.id].effect)+"倍"));
                return display;
            },
            unlocked() { return hasMilestone(this.layer,14) }, 
            canAfford() { return player[this.layer].points.gt(0) },
            buy() { 
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(player[this.layer].points);
                player[this.layer].points = new Decimal(0);
            },
        },
    },
    passiveGeneration() { return (hasMilestone("r", 17)?1:0) },
    update(diff) {
        if (!player.r.unlocked) return; 
        if(hasMilestone("r",21)){
            player.r.buyables[11]=player.r.buyables[11].add(player.r.points.times(diff));
            player.r.buyables[12]=player.r.buyables[12].add(player.r.points.times(diff));
            player.r.buyables[13]=player.r.buyables[13].add(player.r.points.times(diff));
            player.r.buyables[21]=player.r.buyables[21].add(player.r.points.times(diff));
            player.r.buyables[22]=player.r.buyables[22].add(player.r.points.times(diff));
            player.r.buyables[23]=player.r.buyables[23].add(player.r.points.times(diff));
            player.r.buyables[31]=player.r.buyables[31].add(player.r.points.times(diff));
            player.r.buyables[32]=player.r.buyables[32].add(player.r.points.times(diff));
            player.r.buyables[33]=player.r.buyables[33].add(player.r.points.times(diff));
        }
    },
    marked: function(){return player.ma.points.gte(25)}
});
addLayer("id", {
    name: "灵感",
    symbol: "ID",
    position: 5,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#fad682",
    requires() { 
        if(hasMilestone("ai",0))return new Decimal(1);
        let req=Decimal.pow(70,Decimal.pow(0.01,player.points.sub(26))).ceil();
        if(player.points.gte(26.1))req=Decimal.pow(70,Decimal.pow(0.01,player.points.sub(26)));
        return req;
    },
    resource: "灵感",
    baseResource: "思考",
    baseAmount() {return player.ne.thoughts},
    roundUpCost: true,
    type: "static",
    exponent: new Decimal(1.4),
    base: new Decimal(1.2),
    row: 5,
    hotkeys: [
        {key: "I", description: "Shift+I: 灵感重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if (layers[resettingLayer].row<7&&resettingLayer!="ai"&&resettingLayer!="c") {
            keep.push("points");
            keep.push("best");
        }
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
effect() { if(player.ma.points.gte(26))return new Decimal(0.95);
        return Decimal.sub(0.95, Decimal.div(0.95, player.id.points.plus(1).log10().times(hasMilestone("id", 4)?1.5:1).times(hasMilestone("id", 5)?1.75:1).plus(1))) },
    effectDescription() { return "将思考需求的增长减少<h2 style='color: #fad682; text-shadow: #fad682 0px 0px 10px;'>"+format(tmp.id.effect)+"</h2>" },
    rev() { return player.ne.signals.plus(1).log10().div(10).pow(.75).times(player.id.points).pow(hasMilestone("id",0)?2:1).times(hasUpgrade("ai",32)?1.5:1).floor() },
    revEff() { return tmp.id.rev.add(1).pow(hasUpgrade("ai",32)?upgradeEffect("ai",32):1); },
    layerShown(){return player.r.unlocked},
    branches: ["ne"],
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display", "blank", 
        "milestones", "blank", "blank",
        ["display-text", function() { return "启示: <h2>"+formatWhole(tmp.id.rev)+"</h2> (基于灵感和信号)"}],
        ["display-text", function() { return "效果: 将机械能量乘<h2>"+format(tmp.id.revEff)+"</h2>倍" } ], "blank",
    ],
    milestones: {
        0: {
            requirementDescription: "2灵感和3启示",
            done() { return (player.id.points.gte(2) && tmp.id.rev.gte(3)) },
            effectDescription: "可以批量获取思考，且启示会被平方",
        },
        1: {
            requirementDescription: "2灵感和12启示",
            done() { return (player.id.points.gte(2) && tmp.id.rev.gte(12)) },
            effectDescription: "第2-3个思考效果更好",
        },
        2: {
            requirementDescription: "5灵感和80启示",
            done() { return (player.id.points.gte(5) && tmp.id.rev.gte(80)) },
            effectDescription: "第2-3个思考效果更好",
        },
        3: {
            requirementDescription: "7灵感和170启示",
            done() { return (player.id.points.gte(7) && tmp.id.rev.gte(170)) },
            effectDescription: "信号获取现在使用你在脑中的最高点数",
        },
        4: {
            requirementDescription: "11灵感",
            done() { return player.id.points.gte(11) },
            effectDescription: "灵感效果提高50%",
        },
        5: {
            requirementDescription: "13灵感",
            done() { return player.id.points.gte(13) },
            effectDescription: "灵感效果提高75%",
        },
    },
    canBuyMax() { return hasMilestone("ai",0) },
    autoPrestige() { return hasMilestone("ai",0) },
    resetsNothing() { return hasMilestone("ai",0) },
        marked: function(){return player.ma.points.gte(26)}
});

addLayer("ai", {
    name: "人工智能", // 中文层名称
    symbol: "AI", // 保持原符号不变
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        consc: new Decimal(0),
    }},
    color: "#e6ffcc",
    nodeStyle() { return {
        background: (player.ai.unlocked||canReset("ai"))?("radial-gradient(circle, #e6ffcc 0%, #566b65 100%)"):"#bf8f8f",
    }},
    componentStyles: {
        "prestige-button": {
            background() { return (canReset("ai"))?("radial-gradient(circle, #e6ffcc 0%, #566b65 100%)"):"#bf8f8f" },
        },
    },
    requires(){
        if(hasMilestone("c",0))return new Decimal(1);
        if(player.points.gte(27.1))return Decimal.pow(800,Decimal.sub(28.1,player.points)).max(1);
        return new Decimal(800);
    },
    resource: "超级智能", // 中文资源名称
    baseResource: "启示", // 中文基础资源名称
    baseAmount() {return tmp.id.rev},
    type: "normal",
    exponent: new Decimal(3),
    roundUpCost: true,
    gainMult() {
        mult = new Decimal(1);
        if(hasMilestone("ai",6))mult = mult.mul(Decimal.pow(2,player.c.points));
        if(player.ma.points.gte(27))mult = mult.mul(Decimal.pow(tmp.ma.milestoneBase,player.ma.points));
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 6,
    hotkeys: [
        {key: "R", description: "按下Shift+R进行AI重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    passiveGeneration() { return player.ma.points.gte(27)?1:0 },
    doReset(resettingLayer){ 
        let keep = ["milestones"];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
effect() { if(player.ma.points.gte(26))return new Decimal(0.95)},
    layerShown(){return player.r.unlocked && player.id.unlocked },
    branches: ["r", ["id", 3]],
    update(diff) {
        player.ai.consc = player.ai.consc.add(buyableEffect("ai",11).mul(diff));
    },
    conscEff1() { return player.ai.consc.plus(1) },
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display", "blank",
        ["buyable", 11], "blank",
        ["display-text", function() { return "<h3>"+format(player.ai.consc)+"</h3> 人工意识" }], 
        ["display-text", function() { return "效果: 将能量、信号和机器人获取乘以"+format(tmp.ai.conscEff1)+"倍" }],"blank", "blank",
        ["clickable", 11],
        "upgrades", "blank", "milestones"
    ],
    buyables: {
        rows: 1,
        cols: 1,
        11: {
            title: "AI网络",
            cost(x=player[this.layer].buyables[this.id]) {
                return Decimal.pow(2, x.pow(1.5)).floor();
            },
            effect() { return player[this.layer].buyables[this.id].mul(player[this.layer].points.add(1)).mul(Decimal.pow(2,player[this.layer].buyables[this.id])).mul(player.ma.points.gte(27)?Decimal.pow(tmp.ma.milestoneBase,player.ma.points):1); },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                let cost = data.cost;
                let amt = player[this.layer].buyables[this.id];
                let display = formatWhole(player.ai.points)+" / "+formatWhole(cost)+" 超级智能<br><br>等级: "+formatWhole(amt)+"<br><br>奖励: 每秒生成"+formatWhole(data.effect)+"人工意识";
                return display;
            },
            unlocked() { return player[this.layer].unlocked }, 
            canAfford() {
                if (!tmp[this.layer].buyables[this.id].unlocked) return false;
                let cost = layers[this.layer].buyables[this.id].cost();
                return player[this.layer].unlocked && player.ai.points.gte(cost);
            },
            buy() { 
                let cost = tmp[this.layer].buyables[this.id].cost;
                player.ai.points = player.ai.points.sub(cost);
                player.ai.buyables[this.id] = player.ai.buyables[this.id].plus(1);
            },
            style: {'height':'200px', 'width':'200px'},
            autoed() { return false },
        },
    },
    upgrades: {
        rows: 4,
        cols: 4,
        11: {
            title: "节点AA",
            description: "点数软上限开始得更晚",
            cost: new Decimal(2),
            unlocked() { return player.ai.best.gte(3) },
            style: {height: '150px', width: '150px'},
        },
        12: {
            title: "节点AB",
            description: "神经元更便宜",
            cost: new Decimal(15),
            unlocked() { return player.ai.best.gte(20) },
            style: {height: '150px', width: '150px'},
        },
        13: {
            title: "节点AC",
            description: "<b>时间逆转</b>和<b>子空间扩展</b>效果更好",
            cost: new Decimal(1e6),
            unlocked() { return player.ai.best.gte(2e4) },
            style: {height: '150px', width: '150px'},
        },
        14: {
            title: "节点AD",
            description: "人口更便宜且获得更多启示",
            cost: new Decimal(1e19),
            unlocked() { return player.ai.best.gte(1e17) },
            style: {height: '150px', width: '150px'},
        },
        21: {
            title: "节点BA",
            description: "齿轮进化和机器升级更便宜",
            currencyDisplayName: "人工意识",
            currencyInternalName: "consc",
            currencyLayer: "ai",
            cost: new Decimal(100000),
            unlocked() { return player.ai.best.gte(20) },
            style: {height: '150px', width: '150px'},
        },
        22: {
            title: "节点BB",
            description: "启示提升齿轮、机器能量和旋转",
            currencyDisplayName: "人工意识",
            currencyInternalName: "consc",
            currencyLayer: "ai",
            cost: new Decimal(5e6),
            unlocked() { return player.ai.best.gte(20) },
            style: {height: '150px', width: '150px'},
        },
        23: {
            title: "节点BC",
            description: "时间胶囊和空间能量更便宜",
            currencyDisplayName: "人工意识",
            currencyInternalName: "consc",
            currencyLayer: "ai",
            cost: new Decimal(2e9),
            unlocked() { return player.ai.best.gte(2e4) },
            style: {height: '150px', width: '150px'},
        },
        24: {
            title: "节点BD",
            description: "齿轮进化和机器升级更便宜",
            currencyDisplayName: "人工意识",
            currencyInternalName: "consc",
            currencyLayer: "ai",
            cost: new Decimal(1e30),
            unlocked() { return player.ai.best.gte(1e17) },
            style: {height: '150px', width: '150px'},
        },
        31: {
            title: "节点CA",
            description: "精通里程碑提升信号",
            cost: new Decimal(1e7),
            unlocked() { return player.ai.best.gte(2e4) },
            style: {height: '150px', width: '150px'},
        },
        32: {
            title: "节点CB",
            description: "超级智能提升启示效果，并获得50%更多启示",
            cost: new Decimal(1e10),
            unlocked() { return player.ai.best.gte(2e4) },
            style: {height: '150px', width: '150px'},
            effect() { return player.ai.points.plus(1).log10().div(10).add(1); },
            effectDisplay() { return "^"+format(tmp.ai.upgrades[32].effect) },
        },
        33: {
            title: "节点CC",
            description: "生命助推器3效果更好",
            cost: new Decimal(2e12),
            unlocked() { return player.ai.best.gte(2e4) },
            style: {height: '150px', width: '150px'},
        },
        34: {
            title: "节点CD",
            description: "助推器和超空间需求为1。人口更便宜",
            cost: new Decimal(1e23),
            unlocked() { return player.ai.best.gte(1e17) },
            style: {height: '150px', width: '150px'},
        },
        41: {
            title: "节点DA",
            description: "CPU和南桥效果更好",
            currencyDisplayName: "人工意识",
            currencyInternalName: "consc",
            currencyLayer: "ai",
            cost: new Decimal(1e40),
            unlocked() { return player.ai.best.gte(1e30) },
            style: {height: '150px', width: '150px'},
        },
        42: {
            title: "节点DB",
            description: "超级瓦特和心灵瓦特获取更好，所有能量效果增强",
            currencyDisplayName: "人工意识",
            currencyInternalName: "consc",
            currencyLayer: "ai",
            cost: new Decimal(1e49),
            unlocked() { return player.ai.best.gte(1e30) },
            style: {height: '150px', width: '150px'},
        },
        43: {
            title: "节点DC",
            description: "第二时间能量效果更好",
            currencyDisplayName: "人工意识",
            currencyInternalName: "consc",
            currencyLayer: "ai",
            cost: new Decimal(5e50),
            unlocked() { return player.ai.best.gte(1e30) },
            style: {height: '150px', width: '150px'},
        },
        44: {
            title: "节点DD",
            description: "点数软上限开始得更晚",
            currencyDisplayName: "人工意识",
            currencyInternalName: "consc",
            currencyLayer: "ai",
            cost: new Decimal(1e52),
            unlocked() { return player.ai.best.gte(1e30) },
            style: {height: '150px', width: '150px'},
        },
    },
    milestones: {
        0: {
            requirementDescription: "1超级智能",
            done() { return (player.ai.best.gte(1)) },
            effectDescription: "自动购买神经元和灵感，神经元和灵感需求为1，神经元和灵感不重置任何内容",
        },
        1: {
            requirementDescription: "3超级智能",
            done() { return (player.ai.best.gte(3)) },
            effectDescription: "解锁一个AI节点",
        },
        2: {
            requirementDescription: "6超级智能",
            done() { return (player.ai.best.gte(6)) },
            effectDescription: "自动购买神经网络",
        },
        3: {
            requirementDescription: "20超级智能",
            done() { return (player.ai.best.gte(20)) },
            effectDescription: "解锁3个AI节点",
        },
        4: {
            requirementDescription: "1000超级智能",
            done() { return (player.ai.best.gte(1000)) },
            effectDescription: "解锁2个新法术",
        },
        5: {
            requirementDescription: "2e4超级智能",
            done() { return (player.ai.best.gte(2e4)) },
            effectDescription: "解锁5个AI节点",
        },
        6: {
            requirementDescription: "1e13超级智能",
            unlocked() {return player.c.unlocked},
            done() {return player.c.unlocked && (player.ai.best.gte(1e13))},
            effectDescription: "每点文明能量使超级智能获取提升2倍",
        },
        7: {
            requirementDescription: "1e17超级智能",
            unlocked() {return player.c.unlocked},
            done() {return player.c.unlocked && (player.ai.best.gte(1e17))},
            effectDescription: "解锁3个AI节点",
        },
        8: {
            requirementDescription: "1e25超级智能",
            unlocked() {return player.c.unlocked},
            done() {return player.c.unlocked && (player.ai.best.gte(1e25))},
            effectDescription: "T/S需求为1",
        },
        9: {
            requirementDescription: "1e26超级智能",
            unlocked() {return player.c.unlocked},
            done() {return player.c.unlocked && (player.ai.best.gte(1e26))},
            effectDescription: "生成器需求为1",
        },
        10: {
            requirementDescription: "1e30超级智能",
            unlocked() {return player.c.unlocked},
            done() {return player.c.unlocked && (player.ai.best.gte(1e30))},
            effectDescription: "解锁4个AI节点",
        },
    },
    marked: function(){return player.ma.points.gte(27)}
});
addLayer("c", {
    name: "文明", // 中文名称
    symbol: "C", // 保持原符号
    position: 4,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        assigned: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        gainedPower: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
        first: 0,
    }},
    color: "#edb3ff",
    requires() { if(hasMilestone("c",1))return new Decimal(1);return Decimal.mul(184,Decimal.sub(28.5,player.points).max(0).pow(3)).add(1); },
    resource: "文明能量", // 中文资源名称
    baseResource: "帝国砖块", // 中文基础资源名称
    baseAmount() {return player.i.points},
    roundUpCost: true,
    type: "static",
    exponent: new Decimal(1.2),
    base: new Decimal(1.025),
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    canBuyMax() { return false },
    row: 6,
    hotkeys: [
        {key: "C", description: "按下Shift+C进行文明重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    resetsNothing() { return false },
    doReset(resettingLayer){ 
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    autoPrestige() { return false },
    layerShown(){return player.ai.unlocked},
    branches: [["i", 2], "id"],
    update(diff) {
        if (!player.c.unlocked) return;
        for (let i=0;i<5;i++) player.c.gainedPower[i] = Decimal.pow(2, player.c.gainedPower[i]).pow(3).plus(Decimal.pow(2, player.c.assigned[i]).sub(1).max(0).times(diff/100)).cbrt().log2();
    },
    power() {
        let data = [];
        for (let i=1;i<=5;i++){
            data[i] = player.c.points.sub(i).div(5).plus(1).floor().max(0).sqrt().plus(player.c.gainedPower[i-1]);
            if(hasMilestone("c",2))data[i] = player.c.points.max(0).sqrt().plus(player.c.gainedPower[i-1]);
            if(hasMilestone("c",3))data[i] = player.c.points.max(0).pow(0.72).plus(player.c.gainedPower[i-1]);
        }
        return data;
    },
    totalAssigned() { return player.c.assigned.reduce((a,c) => Decimal.add(a, c)) },
    minAssigned() { return player.c.assigned.reduce((a,c) => Decimal.min(a, c)) },
    eff1() { return tmp.c.power[1].times(50) },
    eff2() { return Decimal.pow(1e20, tmp.c.power[2]) },
    eff3() { return Decimal.pow(1e15, tmp.c.power[3]) },
    eff4() { return Decimal.pow(1e5, tmp.c.power[4]) },
    eff5() { return tmp.c.power[5].plus(1).log(4).plus(1) },
    tabFormat: ["main-display",
        "prestige-button",
        "resource-display", "blank",
        ["row", [
            ["column", [
                ["display-text", "<h3>文明<sub>1</sub></h3>"],
                ["display-text", function() { return (player.c.assigned[0].gt(0)?("人口: "+formatWhole(player.c.assigned[0])+"<br>"):"")+"能量: "+format(tmp.c.power[1].times(100))+"%" }], "blank",
                ["display-text", function() { return "效果: 减少点数缩放并使点数软上限出现得更晚" }],
                "blank", ["clickable", 11],
            ], function() { return {width: "9em", visibility: player.c.points.gte(1)?"visible":"hidden"}}],
            ["tall-display-text", "<div class='vl2'></div>", function() { return {height: "223.667px", visibility: player.c.points.gte(2)?"visible":"hidden"}}],
            ["column", [
                ["display-text", "<h3>文明<sub>2</sub></h3>"],
                ["display-text", function() { return (player.c.assigned[1].gt(0)?("人口: "+formatWhole(player.c.assigned[1])+"<br>"):"")+"能量: "+format(tmp.c.power[2].times(100))+"%" }], "blank",
                ["display-text", function() { return "效果: 将思想需求除以"+format(tmp.c.eff2) }],
                "blank", ["clickable", 12],
            ], function() { return {width: "9em", visibility: player.c.points.gte(2)?"visible":"hidden"}}],
            ["tall-display-text", "<div class='vl2'></div>", function() { return {height: "223.667px", visibility: player.c.points.gte(3)?"visible":"hidden"}}],
            ["column", [
                ["display-text", "<h3>文明<sub>3</sub></h3>"],
                ["display-text", function() { return (player.c.assigned[2].gt(0)?("人口: "+formatWhole(player.c.assigned[2])+"<br>"):"")+"能量: "+format(tmp.c.power[3].times(100))+"%" }], "blank",
                ["display-text", function() { return "效果: 将信号获取乘以"+format(tmp.c.eff3) }],
                "blank", ["clickable", 13],
            ], function() { return {width: "9em", visibility: player.c.points.gte(3)?"visible":"hidden"}}],
            ["tall-display-text", "<div class='vl2'></div>", function() { return {height: "223.667px", visibility: player.c.points.gte(4)?"visible":"hidden"}}],
            ["column", [
                ["display-text", "<h3>文明<sub>4</sub></h3>"],
                ["display-text", function() { return (player.c.assigned[3].gt(0)?("人口: "+formatWhole(player.c.assigned[3])+"<br>"):"")+"能量: "+format(tmp.c.power[4].times(100))+"%" }], "blank",
                ["display-text", function() { return "效果: 将旋转次数和机械能量获取乘以"+format(tmp.c.eff4) }],
                "blank", ["clickable", 14],
            ], function() { return {width: "9em", visibility: player.c.points.gte(4)?"visible":"hidden"}}],
            ["tall-display-text", "<div class='vl2'></div>", function() { return {height: "223.667px", visibility: player.c.points.gte(5)?"visible":"hidden"}}],
            ["column", [
                ["display-text", "<h3>文明<sub>5</sub></h3>"],
                ["display-text", function() { return (player.c.assigned[4].gt(0)?("人口: "+formatWhole(player.c.assigned[4])+"<br>"):"")+"能量: "+format(tmp.c.power[5].times(100))+"%" }], "blank",
                ["display-text", function() { return "效果: 神经网络增强"+format(tmp.c.eff5.sub(1).times(100))+"%" }],
                "blank", ["clickable", 15],
            ], function() { return {width: "9em", visibility: player.c.points.gte(5)?"visible":"hidden"}}],
        ], function() { return {visibility: player.c.unlocked?"visible":"hidden"} }], "blank", "blank",
        "buyables","milestones"
    ],
    buyables: {
        showRespec() { return player.c.points.gte(6) },
        respec() {
            player[this.layer].points = player[this.layer].points.add(player[this.layer].spentOnBuyables);
            player.c.assigned = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
            player.c.gainedPower = [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)];
            doReset(this.layer, true);
        },
        respecText: "重置人口",
        rows: 1,
        cols: 1,
        11: {
            title: "人口",
            cost(x=player[this.layer].buyables[this.id]) {
                if(hasMilestone("c",0)){
                    return Decimal.pow(1.5, x.pow(1.1)).div(Decimal.pow(hasMilestone("c",1)?9:3,player.c.points));
                }
                return Decimal.pow(1.5, x.pow(1.1)).times(hasUpgrade("ai",34)?1:hasUpgrade("ai",14)?1e8:1e11).round();
            },
            cap() { 
                let cap = player.c.points.sub(5).max(0).mul(5);
                return cap;
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                let cost = data.cost;
                let amt = player[this.layer].buyables[this.id];
                let display = formatWhole(player.ai.points)+" / "+formatWhole(cost)+" 超级智能<br><br>人口: "+formatWhole(amt)+" / "+formatWhole(data.cap);
                return display;
            },
            unlocked() { return player.c.points.gte(6) }, 
            canAfford() {
                if (!tmp[this.layer].buyables[this.id].unlocked) return false;
                let cost = layers[this.layer].buyables[this.id].cost();
                return player[this.layer].unlocked && player.ai.points.gte(cost) && player.c.buyables[this.id].lt(tmp[this.layer].buyables[this.id].cap);
            },
            buy() { 
                let cost = tmp[this.layer].buyables[this.id].cost;
                player.ai.points = player.ai.points.sub(cost);
                player.c.buyables[this.id] = player.c.buyables[this.id].plus(1);
            },
            style: {'height':'140px', 'width':'140px'},
            autoed() { return false },
        },
    },
    clickables: {
        rows: 1,
        cols: 5,
        11: {
            title: "+1 人口",
            display: "",
            unlocked() { return player.c.unlocked && player.c.points.gte(6) },
            canClick() { return player.c.unlocked && player.c.points.gte(6) && layers.c.totalAssigned().lt(player.c.buyables[11]) && layers.c.minAssigned().eq(player.c.assigned[0]) },
            onClick() { 
                player.c.assigned[0] = player.c.assigned[0].plus(1);
            },
            style: {width: "120px", height: "50px", "border-radius": "0px"},
        },
        12: {
            title: "+1 人口",
            display: "",
            unlocked() { return player.c.unlocked && player.c.points.gte(6) },
            canClick() { return player.c.unlocked && player.c.points.gte(6) && layers.c.totalAssigned().lt(player.c.buyables[11]) && layers.c.minAssigned().eq(player.c.assigned[1]) },
            onClick() { 
                player.c.assigned[1] = player.c.assigned[1].plus(1);
            },
            style: {width: "120px", height: "50px", "border-radius": "0px"},
        },
        13: {
            title: "+1 人口",
            display: "",
            unlocked() { return player.c.unlocked && player.c.points.gte(6) },
            canClick() { return player.c.unlocked && player.c.points.gte(6) && layers.c.totalAssigned().lt(player.c.buyables[11]) && layers.c.minAssigned().eq(player.c.assigned[2]) },
            onClick() { 
                player.c.assigned[2] = player.c.assigned[2].plus(1);
            },
            style: {width: "120px", height: "50px", "border-radius": "0px"},
        },
        14: {
            title: "+1 人口",
            display: "",
            unlocked() { return player.c.unlocked && player.c.points.gte(6) },
            canClick() { return player.c.unlocked && player.c.points.gte(6) && layers.c.totalAssigned().lt(player.c.buyables[11]) && layers.c.minAssigned().eq(player.c.assigned[3]) },
            onClick() { 
                player.c.assigned[3] = player.c.assigned[3].plus(1);
            },
            style: {width: "120px", height: "50px", "border-radius": "0px"},
        },
        15: {
            title: "+1 人口",
            display: "",
            unlocked() { return player.c.unlocked && player.c.points.gte(6) },
            canClick() { return player.c.unlocked && player.c.points.gte(6) && layers.c.totalAssigned().lt(player.c.buyables[11]) && layers.c.minAssigned().eq(player.c.assigned[4]) },
            onClick() { 
                player.c.assigned[4] = player.c.assigned[4].plus(1);
            },
            style: {width: "120px", height: "50px", "border-radius": "0px"},
        },
    },
    milestones: {
        0: {
            requirementDescription: "32 文明能量",
            done() { return (player.c.best.gte(32)) },
            effectDescription: "第1-6行所有层需求为1。超级智能需求为1。提升器更便宜。每点文明能量将人口成本除以3。",
        },
        1: {
            requirementDescription: "40 文明能量",
            done() { return (player.c.best.gte(40)) },
            effectDescription: "除Mastery外，第7行所有层需求为1。每点文明能量将人口成本除以3。",
        },
        2: {
            requirementDescription: "65 文明能量",
            done() { return (player.c.best.gte(65)) },
            effectDescription: "文明能量效果增强。",
        },
        3: {
            requirementDescription: "67 文明能量",
            done() { return (player.c.best.gte(67)) },
            effectDescription: "文明能量效果增强。",
        },
    },
})

// Variables
const draggable = document.querySelector("#draggable")
const trash = document.querySelector("#deleteItem")
const music = new Audio("./sfx/music.mp3")
const whoo = new Audio("./sfx/whoo.mp3")
const trashSFX = new Audio ("./sfx/trash.mp3")
var lastTouchX, lastTouchY

// Tiers
const botList = [
    ["cliffjumper"],
    ["bumblebee", "bugbite"],
    ["ramjet"],
    ["thrust"],
    ["dirge"],
    ["shockwave", "sg_shockwave"],
    ["bluestreak"],
    ["soundwave", "sg_soundwave"],
    ["megatron", "sg_megatron", "g2_megatron"],
    ["sunstreaker"],
    ["sideswipe", "sg_sideswipe"],
    ["red_alert"],
    ["mirage", "wfc_mirage"],
    ["starscream"], ["skywarp"], ["thundercracker"],
    ["rumble", "frenzy"],
    ["prowl"],
    ["prime", "sg_prime", "nemesis_prime"]
]
const chanceList = {
    bumblebee: [70, 30],
    shockwave: [80, 20],
    soundwave: [80, 20],
    megatron: [85, 10, 5],
    sideswipe: [80, 20],
    mirage: [67, 33],
    rumble: [50, 50],
    prime: [85, 10, 5]
}
const botDefault = botList[0][0]

// Play music
var musicPlaying = false
function playMusic(el) {
    if (musicPlaying == false) {
        musicPlaying = true
        music.loop = true
        music.volume = 0.5
        music.play()
        el.innerText = "stop epic music"
    } else {
        el.innerText = "play epic music"
        musicPlaying = false
        music.pause()
    }
}

// Weighted Random
function weightedRandom(items, weights) {
    if (items.length !== weights.length) {
    throw new Error('Items and weights must be of the same size');
    }

    if (!items.length) {
    throw new Error('Items must not be empty');
    }

    const cumulativeWeights = [];
    for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
    }

    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
    const randomNumber = maxCumulativeWeight * Math.random();

    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    if (cumulativeWeights[itemIndex] >= randomNumber) {
        return {
        item: items[itemIndex],
        index: itemIndex,
        };
    }
    }

}

// Toggle SFX
var sfxEnabled = true
function toggleSFX(el) {
    if (sfxEnabled == true) {
        el.innerText = "turn on sfx"
        sfxEnabled = false
    } else {
        el.innerText = "turn off sfx"
        sfxEnabled = true
    }
}  

// Storage
function saveInventory() {
    // Check browser support
    if (typeof(Storage) !== "undefined") {

    // Store inv
    for (let i = 0; i < document.getElementsByClassName("inventoryItem").length; i++) {
        var item = document.getElementsByClassName("inventoryItem")[i]
        if (item.hasAttribute("id")) {
            localStorage.setItem("inv" + i, item.id);
        } else {localStorage.removeItem("inv" + i)}
    }
    
    } else {console.warn("No storage,,");}
}

// Upgrade bot
function upgradeBot(id) {
    var tier, listI, item

    // Search bot and tier
    for (let i = 0; i < botList.length; i++) {
        var group = botList[i];
        if (group.indexOf(id) !== -1) {
            listI = i
            tier = (group.indexOf(id))
            item = [botList[listI][tier]]
        }
    }
    
    if (listI < botList.length - 1) {
        switch (tier) {
        // Tier 0
        case 0:
            listI += 1
            item = botList[listI][0]

            // Multiple tiers available
            if (botList[listI].length >= 2) {
                var chance = chanceList[botList[listI][0]]
                var result = weightedRandom(botList[listI], chance)
                listI = result.index
                item = result.item
            }
            break;
        // Tier 1
        case 1:
            // Find next item with tiers
            var freezeResult
            for (let i = 0; i < botList.length; i++) {
                var group = botList[i];
                if (group.length >= 2 && i > listI && !freezeResult) {
                    freezeResult = true
                    listI = i
                    tier = 1
                }
            }
            
            var chance = chanceList[botList[listI][0]]
            var result = weightedRandom(botList[listI], chance)
            listI = result.index
            item = result.item
            break;
        // Tier 2
        case 2:
            // Find next item with tiers
            var freezeResult
            for (let i = 0; i < botList.length; i++) {
                var group = botList[i];
                if (group.length == 3 && i > listI && !freezeResult) {
                    freezeResult = true
                    listI = i
                    tier = 2
                }
            }

            var chance = chanceList[botList[listI][0]]
            var result = weightedRandom(botList[listI], chance)
            listI = result.index
            item = result.item
            break;
        default:
            break;
        }
    } else if (listI == botList.length - 1) {
        tier += 1
        item = botList[listI][tier]
        if (tier == 3) {
            listI += 1
            tier = 0
            item = "jazz"

            new Audio("./sfx/yay.mp3").play()
        }
    }

    return [listI, item]
}

// On click
function itemClicked(e) {
    if (this.getAttribute("id") == null) {return}
    if (e.touches) {e = e.touches[0]}

    var obj = this
    var dRect = draggable.getBoundingClientRect()
    obj.style.backgroundImage = null

    draggable.style.backgroundImage = "url(./mochibots/" + this.id + ".png)"
    draggable.style.top = e.clientY - (dRect.height / 2) + window.scrollY + "px"
    draggable.style.left = e.clientX - (dRect.width / 2) + "px"

    function moved(ex) {
        if (ex.touches) {
            ex.preventDefault()
            ex = ex.touches[0]

            // Mobile scrolll fix
            document.body.classList.add("lock-scroll")
        }
        draggable.style.top = ex.clientY - (dRect.height / 2) + window.scrollY + "px"
        draggable.style.left = ex.clientX - (dRect.width / 2) +  "px"
        lastTouchX = ex.clientX
        lastTouchY = ex.clientY
    }

    function final(ex) {
        if (ex.touches) {
            ex = ex.touches[0]
            document.body.classList.remove("lock-scroll")
        }
        obj.style.backgroundImage = "url(./mochibots/" + obj.id + ".png)"
        draggable.style.top = "-1000px"
        draggable.style.left = "-1000px"
        
        // Find any item above it
        var resultingX = lastTouchX
        var resultingY = lastTouchY
        var hoverOver
        
        // Check if item is above a game item
        for (let i = 0; i < document.getElementsByClassName("gameItem").length; i++) {
            var item = document.getElementsByClassName("gameItem")[i]
            var itemRect = item.getBoundingClientRect()
            var maxX = (itemRect.left + itemRect.width)
            var maxY = (itemRect.top + itemRect.height)

            if (itemRect.left < resultingX && resultingX < maxX && itemRect.top < resultingY && resultingY < maxY) {
                hoverOver = item
            }
        }

        // Check if allowed to upgrade (Game items)
        if (hoverOver && hoverOver.id == obj.id && hoverOver != obj && obj.id !== "jazz") {
            obj.removeAttribute("id")
            obj.style.backgroundImage = null

            var result = upgradeBot(hoverOver.id)

            // Play funny audio
            if (sfxEnabled == true) {
                var audioI = result[0] + 1
                if (audioI > 9) {audioI = 9}
                var bing = new Audio("./sfx/bing" + audioI + ".mp3")
                bing.play()
                
                bing.addEventListener('ended', function() {
                    bing.pause()
                    bing.src = ''
                    bing.load()
                    bing = null
                    console.log("hi")
                }, {once: true})
            }

            hoverOver.id = result[1]
            hoverOver.style.backgroundImage = "url(./mochibots/" + result[1] + ".png)" 
        
        // Move item to another place
        } else if (hoverOver && !hoverOver.id) {
            hoverOver.id = obj.id
            hoverOver.style.backgroundImage = "url(./mochibots/" + obj.id + ".png)" 

            obj.removeAttribute("id")
            obj.style.backgroundImage = null
        }

        // Check if item is above an inventory item
        for (let i = 0; i < document.getElementsByClassName("inventoryItem").length; i++) {
            var item = document.getElementsByClassName("inventoryItem")[i]
            var itemRect = item.getBoundingClientRect()
            var maxX = (itemRect.left + itemRect.width)
            var maxY = (itemRect.top + itemRect.height)

            if (itemRect.left < resultingX && resultingX < maxX && itemRect.top < resultingY && resultingY < maxY) {
                hoverOver = item
            }
        }

         // Add to inventory
        if (hoverOver && hoverOver.className == "inventoryItem" && !hoverOver.id) {
            hoverOver.id = obj.id
            hoverOver.style.backgroundImage = "url(./mochibots/" + obj.id + ".png)"

            obj.removeAttribute("id")
            obj.style.backgroundImage = null
        }

        // Delete item
        var trashRect = trash.getBoundingClientRect()
        var maxX = (trashRect.left + trashRect.width)
        var maxY = (trashRect.top + trashRect.height)
        if (trashRect.left < resultingX && resultingX < maxX && trashRect.top < resultingY && resultingY < maxY) {
            obj.removeAttribute("id")
            obj.style.backgroundImage = null

            if (sfxEnabled == true) {
                trashSFX.play()
            }
        }

        saveInventory()
        document.onmousemove = null
        document.onmouseup = null
        document.ontouchend = null

        document.removeEventListener("touchmove", moved);
    }

    document.onmousemove = moved
    document.addEventListener("touchmove", moved, {passive: false});
    document.onmouseup = final
    document.ontouchend = final
}

// Get new mochis
function newMochis() {
    if (sfxEnabled == true) {whoo.play()}
    for (let i = 0; i < document.getElementsByClassName("gameItem").length; i++) {
        var item = document.getElementsByClassName("gameItem")[i]

        if (!item.id) {
            item.id = botDefault
            item.style.backgroundImage = "url(./mochibots/" + botDefault +".png)"
        }
    }
}

// Load mochis
function loadMochis() {
    // Resize draggable element
    var oRect = document.getElementsByClassName("gameItem")[0].getBoundingClientRect()
    draggable.style.width = oRect.width + "px"
    draggable.style.height = oRect.height + "px"

    // Connect items
    for (let i = 0; i < document.getElementsByClassName("gameItem").length; i++) {
        var item = document.getElementsByClassName("gameItem")[i]
        item.id = botDefault
        item.style.backgroundImage = "url(./mochibots/" + botDefault +".png)" 
        item.addEventListener("mousedown", itemClicked)
        item.addEventListener("touchstart", itemClicked)
    }
    // Connect inventory
    for (let i = 0; i < document.getElementsByClassName("inventoryItem").length; i++) {
        var item = document.getElementsByClassName("inventoryItem")[i]

        // Storage check
        if (typeof(Storage) !== "undefined" && (localStorage.getItem("inv" + i) == null) == false) {
            item.id = localStorage.getItem("inv" + i)
            item.style.backgroundImage = "url(./mochibots/" + item.id +".png)" 
        }

        // Connections
        item.addEventListener("mousedown", itemClicked)
        item.addEventListener("touchstart", itemClicked)
    }
}
loadMochis()

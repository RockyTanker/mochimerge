// Variables
const draggable = document.querySelector("#draggable")
const music = new Audio("./sfx/music.mp3")

// Priority list
const bots = ["bluestreak", "bugbite", "bumblebee", "cliffjumper", "dirge", "frenzy", "g2_megatron", "jazz", "megatron", "mirage", "nemesis_prime", "prime", "prowl", "ramjet", "red_alert", "rumble", "sg_megatron", "sg_prime", "sg_shockwave",  "sg_sideswipe", "sg_soundwave", "shockwave", "sideswipe", "skywarp", "smokescreen", "soundwave", "starscream", "sunstreaker", "thrust", "thundercracker", "wfc_mirage"]

// Play music
function playMusic() {
    music.loop = true
    music.volume = 0.5
    music.play()
}

// On click
function itemClicked(e) {
    if (this.getAttribute("id") == null) {return}
    var obj = this
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var dRect = draggable.getBoundingClientRect()
    obj.style.backgroundImage = null

    draggable.style.backgroundImage = "url(./mochibots/" + this.id + ".png)"
    draggable.style.top = e.clientY - (dRect.height / 2) + "px"
    draggable.style.left = e.clientX - (dRect.width / 2) + "px"

    document.onmousemove = function(e) {
        // calculate the new cursor position:
        draggable.style.top = e.clientY - (dRect.height / 2) + "px"
        draggable.style.left = e.clientX - (dRect.width / 2) + "px"
    }
    
    // On mouse relase
    document.onmouseup = function(e) {
        obj.style.backgroundImage = "url(./mochibots/" + obj.id + ".png)"
        draggable.style.top = "-1000px"
        draggable.style.left = "-1000px"
        
        // Find any item above it
        var resultingX = e.clientX
        var resultingY = e.clientY
        var hoverOver = 0
        
        for (let i = 0; i < 9; i++) {
            var item = document.getElementsByClassName("gameItem")[i]
            var itemRect = item.getBoundingClientRect()
            var maxX = (itemRect.left + itemRect.width)
            var maxY = (itemRect.top + itemRect.height)

            if (itemRect.left < resultingX && resultingX < maxX && itemRect.top < resultingY && resultingY < maxY) {
                hoverOver = item
            }
        }

        // Check if allowed to upgrade
        if (hoverOver.id == obj.id && hoverOver != obj) {
            obj.removeAttribute("id")
            obj.style.backgroundImage = null
            var botI = bots.indexOf(hoverOver.id) + 1
            if (botI in bots == false) {botI -= 1}

            // Play funny audio
            var audioI = botI
            if (audioI > 9) {
                audioI = 9
            }
            var audio = new Audio("./sfx/bing" + audioI + ".mp3")
            audio.play()

            hoverOver.id = bots[botI]
            hoverOver.style.backgroundImage = "url(./mochibots/" + hoverOver.id + ".png)" 
        }

        document.onmousemove = null
        document.onmouseup = null
    }
}

// Get new mochis
function newMochis() {
    for (let i = 0; i < 9; i++) {
        var item = document.getElementsByClassName("gameItem")[i]

        if (!item.id) {
            item.id = "bluestreak"
            item.style.backgroundImage = "url(./mochibots/bluestreak.png)" 
        }
    }
}

// Load mochis
function loadMochis() {
    for (let i = 0; i < 9; i++) {
        var item = document.getElementsByClassName("gameItem")[i]
        item.id = "bluestreak"
        item.style.backgroundImage = "url(./mochibots/bluestreak.png)" 
        item.addEventListener("mousedown", itemClicked)
    }
}
loadMochis()
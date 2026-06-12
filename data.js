/* All documentation content + navigation tree. One source of truth. */
/* Each page has { id, title, category, sections: [{ id, title, kind, ... }] } */
/* Kinds: 'prose' | 'api' | 'faq' | 'colors' | 'easings' */

const NAV = [
  {
    title: "Overview",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "getting-started", label: "Getting Started" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { id: "event-callbacks", label: "Event Callbacks" },
      { id: "se-sprites", label: "Sprite Functions" },
      { id: "se-animation", label: "Animation Functions" },
      { id: "se-tween", label: "Tween Functions" },
      { id: "se-reflection", label: "Reflection API" },
      { id: "se-sound", label: "Sound Functions" },
      { id: "se-video", label: "Video Functions" },
      { id: "se-camera", label: "Camera Functions" },
      { id: "se-text", label: "Text Functions" },
      { id: "se-input", label: "Input Functions" },
      { id: "se-score", label: "Score & Health" },
      { id: "se-character", label: "Character Functions" },
      { id: "se-playstate", label: "PlayState Functions" },
      { id: "se-timer", label: "Timer Functions" },
      { id: "se-shader", label: "Shader Functions" },
      { id: "se-script", label: "Script Management" },
      { id: "se-hscript", label: "HScript Integration" },
      { id: "se-substate", label: "Scripted State/Substate" },
      { id: "se-save", label: "Save Data" },
      { id: "se-file", label: "File I/O" },
      { id: "se-precache", label: "Precaching" },
      { id: "se-mobile", label: "Mobile Functions" },
      { id: "se-discord", label: "Discord RPC" },
      { id: "se-deprecated", label: "Deprecated Functions" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "se-variables", label: "Built-in Variables" },
      { id: "easings", label: "Easing Names" },
      { id: "colors", label: "Color Format" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "examples", label: "Examples" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

/* shortcut helpers */
const P = (id, title, body) => ({ id, title, kind: "prose", body });
const API = (cfg) => ({ ...cfg, kind: "api" });

const PAGES = {
  /* ---------------- Introduction ---------------- */
  "introduction": {
    title: "Introduction",
    category: "Overview",
    hero: true,
    sections: [
      {
        id: "what",
        title: "What is Shadow Engine?",
        kind: "prose",
        body: `Shadow Engine is a <strong>Friday Night Funkin'-style rhythm-game engine</strong> with a built-in Lua scripting layer. Scripts can create sprites, tween their properties, read and write engine state via reflection, and hook into the conductor as the song plays.

Scripts live under <code>scripts/</code>, <code>stages/</code>, <code>characters/</code>, and other folders, loaded at runtime.`,
      },
    ],
  },

  /* ---------------- Installation ---------------- */

  /* ---------------- Getting Started ---------------- */
  "getting-started": {
    title: "Getting Started",
    category: "Overview",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy of a script",
        kind: "prose",
        body: `A Shadow Engine script is a plain Lua file. Define any of the <a href="#" data-go="event-callbacks">event callbacks</a> at top level and they will be invoked by the engine. Inside those callbacks, create and manipulate sprites and tweens using flat global functions.`,
        code: {
          lang: "lua",
          filename: "mods/scripts/intro.lua",
          source: `-- 1. create a sprite with the tag 'logo'
function onCreate()
    makeLuaSprite('logo', 'myimages/logo', 200, 50)
    addLuaSprite('logo')
end

-- 2. animate it on every beat
function onBeatHit(beat)
    doTweenAngle('spin', 'logo', 360, 0.4, 'quadOut')
end

-- 3. clean up when the state tears down
function onDestroy()
    print("bye!")
end`,
          highlight: [1, 6, 12],
        },
      },
      {
        id: "lifecycle",
        title: "Lifecycle",
        kind: "prose",
        body: `Scripts share their lifecycle with <code>MusicBeatState</code>:

<ol>
  <li><strong>Discovery</strong> — every <code>.lua</code> under <code>mods/scripts/</code> is registered when the state is created.</li>
  <li><strong>onCreate()</strong> — fired right after the state's <code>create()</code> returns.</li>
  <li><strong>Per-frame &amp; conductor callbacks</strong> — <code>onUpdate</code>, <code>onBeatHit</code>, <code>onStepHit</code>, <code>onSectionHit</code>.</li>
  <li><strong>onDestroy()</strong> — fired when the state tears down.</li>
</ol>`,
      },
      {
        id: "next",
        title: "What to read next",
        kind: "prose",
        body: `<ul>
  <li><a href="#" data-go="se-sprites">Sprite Functions</a> — every drawing function</li>
  <li><a href="#" data-go="se-tween">Tween Functions</a> — every tween function</li>
  <li><a href="#" data-go="se-reflection">Reflection API</a> — read &amp; write engine state</li>
  <li><a href="#" data-go="examples">Full examples</a> — beat-reactive scenes and effects</li>
</ul>`,
      },
    ],
  },

  /* ---------------- Event Callbacks ---------------- */
  "event-callbacks": {
    title: "Event Callbacks",
    category: "API Reference",
    sections: [
      {
        id: "intro",
        title: "Overview",
        kind: "prose",
        body: `The engine drives scripts through lifecycle callbacks. <code>MusicBeatState</code> broadcasts each one to every registered script that defines it; if a script omits a callback, nothing happens.

<b>Core callbacks:</b>
<table class="tbl">
  <thead><tr><th>Callback</th><th>Parameters</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td>onCreate()</td><td>—</td><td>Set up sprites, tweens and state here.</td></tr>
    <tr><td>onCreatePost()</td><td>—</td><td>Fires after create() is fully done.</td></tr>
    <tr><td>onNew()</td><td>—</td><td>Fires in constructor before create.</td></tr>
    <tr><td>onNewPost()</td><td>—</td><td>Fires after constructor.</td></tr>
    <tr><td>onUpdate(elapsed)</td><td>Float</td><td>Per-frame logic.</td></tr>
    <tr><td>onUpdatePost(elapsed)</td><td>Float</td><td>Per-frame logic after super.update.</td></tr>
    <tr><td>onStepHit()</td><td>—</td><td>Every quarter beat.</td></tr>
    <tr><td>onBeatHit(beat)</td><td>Int</td><td>Every beat.</td></tr>
    <tr><td>onSectionHit()</td><td>—</td><td>Every measure.</td></tr>
    <tr><td>onTweenCompleted(tag)</td><td>String</td><td>Fires when a tween finishes.</td></tr>
    <tr><td>onTimerCompleted(tag, loops, left)</td><td>String, Int, Int</td><td>Fires when a timer completes.</td></tr>
    <tr><td>onSoundFinished(tag)</td><td>String</td><td>Fires when a tagged sound finishes.</td></tr>
    <tr><td>onVideoFinished(tag)</td><td>String</td><td>Fires when a tagged video finishes playback.</td></tr>
    <tr><td>onEvent(name, v1, v2)</td><td>String, String, String</td><td>Fires on chart events.</td></tr>
    <tr><td>onCountdownStarted()</td><td>—</td><td>Fires when countdown begins.</td></tr>
    <tr><td>onCountdownEnded()</td><td>—</td><td>Fires when countdown ends.</td></tr>
    <tr><td>onEndSong()</td><td>—</td><td>Can return Function_Stop to prevent ending.</td></tr>
    <tr><td>onNoteHit(noteData)</td><td>Int</td><td>Player hits a note.</td></tr>
    <tr><td>onNoteMiss(dir)</td><td>Int</td><td>Player misses.</td></tr>
    <tr><td>onGhostTap(dir)</td><td>Int</td><td>Player presses nothing.</td></tr>
    <tr><td>onGameOver()</td><td>—</td><td>Fires on death.</td></tr>
    <tr><td>onOpenSubState()</td><td>—</td><td>Fires when a substate opens.</td></tr>
    <tr><td>onCloseSubState()</td><td>—</td><td>Fires when a substate closes.</td></tr>
    <tr><td>goodNoteHit(noteData, note, sustain)</td><td>Int, Note, Bool</td><td>Fires when player hits a note (after hit)</td></tr>
    <tr><td>opponentNoteHit(noteData, note, sustain)</td><td>Int, Note, Bool</td><td>Fires when opponent hits a note</td></tr>
    <tr><td>goodNoteHitPre(noteData, note, sustain)</td><td>Int, Note, Bool</td><td>Fires before player note hit (can cancel)</td></tr>
    <tr><td>opponentNoteHitPre(noteData, note, sustain)</td><td>Int, Note, Bool</td><td>Fires before opponent note hit (can cancel)</td></tr>
    <tr><td>onSongStart()</td><td>—</td><td>Fires when song begins playing</td></tr>
    <tr><td>onStartCountdown()</td><td>—</td><td>Fires when countdown is about to start</td></tr>
    <tr><td>onCountdownTick(tick)</td><td>Int</td><td>Fires on each countdown tick</td></tr>
    <tr><td>onPause()</td><td>—</td><td>Fires when game is paused</td></tr>
    <tr><td>onGameOverStart()</td><td>—</td><td>Fires on game over start</td></tr>
    <tr><td>onGameOverConfirm()</td><td>—</td><td>Fires on game over confirm (retry/exit)</td></tr>
    <tr><td>onSpawnNote(noteData, note)</td><td>Int, Note</td><td>Fires when a note spawns</td></tr>
    <tr><td>onKeyPress(dir)</td><td>Int</td><td>Fires on gameplay key press</td></tr>
    <tr><td>onKeyRelease(dir)</td><td>Int</td><td>Fires on gameplay key release</td></tr>
    <tr><td>onRecalculateRating()</td><td>—</td><td>Fires when score rating is recalculated</td></tr>
    <tr><td>onDestroy()</td><td>—</td><td>Final cleanup.</td></tr>
  </tbody>
</table>`,
      },
      {
        id: "callbacks",
        title: "Callback list",
        kind: "prose",
        body: `<table class="tbl">
  <thead><tr><th>Callback</th><th>Parameters</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td>onCreate()</td><td>—</td><td>Set up sprites, tweens and state here.</td></tr>
    <tr><td>onCreatePost()</td><td>—</td><td>Fires after create() is fully done.</td></tr>
    <tr><td>onNew()</td><td>—</td><td>Fires in constructor before create.</td></tr>
    <tr><td>onNewPost()</td><td>—</td><td>Fires after constructor.</td></tr>
    <tr><td>onUpdate(elapsed)</td><td>Float</td><td>Per-frame logic.</td></tr>
    <tr><td>onUpdatePost(elapsed)</td><td>Float</td><td>Per-frame logic after super.update.</td></tr>
    <tr><td>onStepHit()</td><td>—</td><td>Every quarter beat.</td></tr>
    <tr><td>onBeatHit(beat)</td><td>Int</td><td>Every beat.</td></tr>
    <tr><td>onSectionHit()</td><td>—</td><td>Every measure.</td></tr>
    <tr><td>onTweenCompleted(tag)</td><td>String</td><td>Fires when a tween finishes.</td></tr>
    <tr><td>onTimerCompleted(tag, loops, left)</td><td>String, Int, Int</td><td>Fires when a timer completes.</td></tr>
    <tr><td>onSoundFinished(tag)</td><td>String</td><td>Fires when a tagged sound finishes.</td></tr>
    <tr><td>onVideoFinished(tag)</td><td>String</td><td>Fires when a tagged video finishes playback.</td></tr>
    <tr><td>onEvent(name, v1, v2)</td><td>String, String, String</td><td>Fires on chart events.</td></tr>
    <tr><td>onCountdownStarted()</td><td>—</td><td>Fires when countdown begins.</td></tr>
    <tr><td>onCountdownEnded()</td><td>—</td><td>Fires when countdown ends.</td></tr>
    <tr><td>onEndSong()</td><td>—</td><td>Can return Function_Stop to prevent ending.</td></tr>
    <tr><td>onNoteHit(noteData)</td><td>Int</td><td>Player hits a note.</td></tr>
    <tr><td>onNoteMiss(dir)</td><td>Int</td><td>Player misses.</td></tr>
    <tr><td>onGhostTap(dir)</td><td>Int</td><td>Player presses nothing.</td></tr>
    <tr><td>onGameOver()</td><td>—</td><td>Fires on death.</td></tr>
    <tr><td>onOpenSubState()</td><td>—</td><td>Fires when a substate opens.</td></tr>
    <tr><td>onCloseSubState()</td><td>—</td><td>Fires when a substate closes.</td></tr>
    <tr><td>goodNoteHit(noteData, note, sustain)</td><td>Int, Note, Bool</td><td>Fires when player hits a note (after hit)</td></tr>
    <tr><td>opponentNoteHit(noteData, note, sustain)</td><td>Int, Note, Bool</td><td>Fires when opponent hits a note</td></tr>
    <tr><td>goodNoteHitPre(noteData, note, sustain)</td><td>Int, Note, Bool</td><td>Fires before player note hit (can cancel)</td></tr>
    <tr><td>opponentNoteHitPre(noteData, note, sustain)</td><td>Int, Note, Bool</td><td>Fires before opponent note hit (can cancel)</td></tr>
    <tr><td>onSongStart()</td><td>—</td><td>Fires when song begins playing</td></tr>
    <tr><td>onStartCountdown()</td><td>—</td><td>Fires when countdown is about to start</td></tr>
    <tr><td>onCountdownTick(tick)</td><td>Int</td><td>Fires on each countdown tick</td></tr>
    <tr><td>onPause()</td><td>—</td><td>Fires when game is paused</td></tr>
    <tr><td>onGameOverStart()</td><td>—</td><td>Fires on game over start</td></tr>
    <tr><td>onGameOverConfirm()</td><td>—</td><td>Fires on game over confirm (retry/exit)</td></tr>
    <tr><td>onSpawnNote(noteData, note)</td><td>Int, Note</td><td>Fires when a note spawns</td></tr>
    <tr><td>onKeyPress(dir)</td><td>Int</td><td>Fires on gameplay key press</td></tr>
    <tr><td>onKeyRelease(dir)</td><td>Int</td><td>Fires on gameplay key release</td></tr>
    <tr><td>onRecalculateRating()</td><td>—</td><td>Fires when score rating is recalculated</td></tr>
    <tr><td>onDestroy()</td><td>—</td><td>Final cleanup.</td></tr>
  </tbody>
</table>`,
        code: {
          lang: "lua",
          filename: "callbacks.lua",
          source: `function onCreate()
    print("script loaded")
    makeLuaSprite('box')
    makeGraphic('box', 200, 50, 'FF6699')
    addLuaSprite('box')
end

function onBeatHit(beat)
    print("BEAT " .. beat)
end

function onDestroy()
    print("script unloaded")
end`,
        },
      },
    ],
  },

  /* ---------------- se-sprites ---------------- */
  "se-sprites": {
    title: "Sprite Functions",
    category: "API Reference",
    subtitle: "Functions to create, configure, and destroy drawable objects. Every sprite is identified by a string <code>tag</code> that you choose at creation time.",
    sections: [
      {
        id: "creation",
        title: "Creation & Addition",
        kind: "prose",
        body: "These functions create sprites and add them to the display list. Sprites are not visible until <code>addLuaSprite</code> is called.",
      },
      API({
        id: "makeLuaSprite",
        signature: "makeLuaSprite(tag, ?image, ?x, ?y)",
        params: [["tag","String","Unique sprite identifier"],["image","String","Image path (no extension), resolved through <code>Paths.image</code>","optional"],["x","Float","Initial X position","default 0"],["y","Float","Initial Y position","default 0"]],
        returns: "Void",
        description: "Creates a static sprite. If <code>image</code> is omitted or nil, creates an empty sprite (use <code>makeGraphic</code> to give it a rectangle).",
        code: { lang: "lua", source: `makeLuaSprite('logo', 'menus/logo', 100, 50)
addLuaSprite('logo')` },
      }),
      API({
        id: "makeAnimatedLuaSprite",
        signature: "makeAnimatedLuaSprite(tag, ?image, ?x, ?y, ?spriteType, ?swfMode, ?cacheOnLoad)",
        params: [["tag","String","Unique sprite identifier"],["image","String","Image path (no extension)","optional"],["x","Float","X position","default 0"],["y","Float","Y position","default 0"],["spriteType","String","<code>'sparrow'</code>, <code>'packer'</code>, or <code>'aseprite'</code>","default 'sparrow'"],["swfMode","Bool","SWF-style animation mode","default false"],["cacheOnLoad","Bool","Cache frames on load","default false"]],
        returns: "Void",
        description: "Creates an animated sprite from a sparrow/packer/aseprite atlas. Use <code>addAnimationByPrefix</code> etc. to define animations.",
        code: { lang: "lua", source: `makeAnimatedLuaSprite('bf', 'characters/bf', 400, 300, 'sparrow')
addLuaSprite('bf')
addAnimationByPrefix('bf', 'idle', 'BF idle dance', 24, true)` },
      }),
      API({
        id: "makeGraphic",
        signature: "makeGraphic(obj, ?width, ?height, ?color)",
        params: [["obj","String","Sprite tag"],["width","Int","Rectangle width","default 100"],["height","Int","Rectangle height","default 100"],["color","String","Fill color hex (<code>'RRGGBB'</code>)","default 'FFFFFF'"]],
        returns: "Void",
        description: "Replaces the sprite's graphic with a solid-color rectangle. Useful for overlay boxes, bars, and placeholders.",
        code: { lang: "lua", source: `makeLuaSprite('box')
makeGraphic('box', 200, 80, 'FF6699')
addLuaSprite('box')` },
      }),
      API({
        id: "addLuaSprite",
        signature: "addLuaSprite(tag, ?front)",
        params: [["tag","String","Sprite tag to add to the display list"],["front","Bool","If true, adds to the front layer","default false"]],
        returns: "Void",
        description: "Adds a previously-created sprite to the state's draw list. Sprites are invisible until added.",
        code: { lang: "lua", source: `makeLuaSprite('bg', 'stages/field', 0, 0)
addLuaSprite('bg')` },
      }),
      API({
        id: "removeLuaSprite",
        signature: "removeLuaSprite(tag, ?destroy)",
        params: [["tag","String","Sprite tag to remove"],["destroy","Bool","If true, also destroys the sprite","default false"]],
        returns: "Void",
        description: "Removes a sprite from the display list. Optionally destroys it.",
        code: { lang: "lua", source: `removeLuaSprite('old_bg', true)` },
      }),
      API({
        id: "luaSpriteExists",
        signature: "luaSpriteExists(tag)",
        params: [["tag","String","Sprite tag to check"]],
        returns: "Bool",
        description: "Returns <code>true</code> if a sprite with the given tag has been created (regardless of whether it was added to the display list).",
        code: { lang: "lua", source: `if luaSpriteExists('logo') then
    print('logo exists')
end` },
      }),
      {
        id: "transforms",
        title: "Position & Transform",
        kind: "prose",
        body: "Functions that move, scale, and center sprites.",
      },
      API({
        id: "setObjectCamera",
        signature: "setObjectCamera(obj, ?camera)",
        params: [["obj","String","Sprite tag"],["camera","String","Camera name: <code>'game'</code>, <code>'hud'</code>, <code>'other'</code>. Empty = game camera","default 'game'"]],
        returns: "Void",
        description: "Assigns the sprite to a camera. Sprites default to the game camera.",
        code: { lang: "lua", source: `setObjectCamera('score_display', 'hud')` },
      }),
      API({
        id: "setBlendMode",
        signature: "setBlendMode(obj, ?blend)",
        params: [["obj","String","Sprite tag"],["blend","String","Blend mode: <code>'add'</code>, <code>'multiply'</code>, <code>'screen'</code>, etc. Empty resets to normal","default ''"]],
        returns: "Void",
        description: "Sets the sprite's blend mode for compositing.",
        code: { lang: "lua", source: `setBlendMode('glow_overlay', 'add')` },
      }),
      API({
        id: "setScrollFactor",
        signature: "setScrollFactor(obj, scrollX, scrollY)",
        params: [["obj","String","Sprite tag"],["scrollX","Float","Horizontal scroll factor","default 1"],["scrollY","Float","Vertical scroll factor","default 1"]],
        returns: "Void",
        description: "Sets how strongly the sprite follows camera movement. <code>0</code> = screen-locked (HUD), <code>1</code> = full parallax.",
        code: { lang: "lua", source: `setScrollFactor('bg_sky', 0.1, 0.1)
setScrollFactor('hud_bar', 0, 0)` },
      }),
      API({
        id: "screenCenter",
        signature: "screenCenter(obj, ?pos)",
        params: [["obj","String","Sprite tag"],["pos","String","Axis: <code>'x'</code>, <code>'y'</code>, or omitted for both","optional"]],
        returns: "Void",
        description: "Centers the sprite on screen. Without <code>pos</code>, centers on both axes.",
        code: { lang: "lua", source: `screenCenter('logo')         -- both axes
screenCenter('logo', 'x')     -- horizontal only` },
      }),
      API({
        id: "setGraphicSize",
        signature: "setGraphicSize(obj, x, ?y, ?updateHitbox)",
        params: [["obj","String","Sprite tag"],["x","Int","Target width in pixels"],["y","Int","Target height (omitted = square)","optional"],["updateHitbox","Bool","Recalculate hitbox after resize","default false"]],
        returns: "Void",
        description: "Sets the sprite's pixel dimensions directly.",
        code: { lang: "lua", source: `setGraphicSize('logo', 320, 240, true)` },
      }),
      API({
        id: "scaleObject",
        signature: "scaleObject(obj, x, y, ?updateHitbox)",
        params: [["obj","String","Sprite tag"],["x","Float","Horizontal scale multiplier"],["y","Float","Vertical scale multiplier"],["updateHitbox","Bool","Recalculate hitbox after scaling","default false"]],
        returns: "Void",
        description: "Scales the sprite by a multiplier. <code>1.0</code> = original size, <code>2.0</code> = double.",
        code: { lang: "lua", source: `scaleObject('logo', 1.5, 1.5, true)` },
      }),
      API({
        id: "updateHitbox",
        signature: "updateHitbox(obj)",
        params: [["obj","String","Sprite tag"]],
        returns: "Void",
        description: "Recalculates the sprite's hitbox to match its current scale/graphic size.",
        code: { lang: "lua", source: `scaleObject('logo', 2.0, 2.0)
updateHitbox('logo')` },
      }),
      API({
        id: "updateHitboxFromGroup",
        signature: "updateHitboxFromGroup(group, index)",
        params: [["group","String","Group tag"],["index","Int","Member index within the group"]],
        returns: "Void",
        description: "Updates the hitbox of a specific member within a sprite group.",
        code: { lang: "lua", source: `updateHitboxFromGroup('note_splashes', 3)` },
      }),
      {
        id: "ordering",
        title: "Draw Order",
        kind: "prose",
        body: "Control the Z-order of sprites within their display list.",
      },
      API({
        id: "setObjectOrder",
        signature: "setObjectOrder(obj, position, ?group)",
        params: [["obj","String","Sprite tag"],["position","Int","Target draw index"],["group","String","Group to reorder within","optional"]],
        returns: "Void",
        description: "Moves the sprite to a specific draw order index. Lower indices are drawn first (behind).",
        code: { lang: "lua", source: `setObjectOrder('logo', 0)   -- draw first (back)
setObjectOrder('player', 10) -- draw later (front)` },
      }),
      API({
        id: "getObjectOrder",
        signature: "getObjectOrder(obj, ?group)",
        params: [["obj","String","Sprite tag"],["group","String","Group to look the object up in instead of the state","optional"]],
        returns: "Int",
        description: "Returns the sprite's current draw order index.",
        code: { lang: "lua", source: `local order = getObjectOrder('logo')` },
      }),
      API({
        id: "objectsOverlap",
        signature: "objectsOverlap(obj1, obj2)",
        params: [["obj1","String","First sprite tag"],["obj2","String","Second sprite tag"]],
        returns: "Bool",
        description: "Returns <code>true</code> if the two sprites' hitboxes overlap.",
        code: { lang: "lua", source: `if objectsOverlap('cursor', 'button') then
    print('hovering!')
end` },
      }),
      {
        id: "queries",
        title: "Position Queries",
        kind: "prose",
        body: "Read positional values from sprites.",
      },
      API({
        id: "getMidpointX",
        signature: "getMidpointX(variable)",
        params: [["variable","String","Sprite tag"]],
        returns: "Float",
        description: "Returns the X coordinate of the sprite's midpoint (center of the sprite's bounding box in world space).",
        code: { lang: "lua", source: `local mx = getMidpointX('player')` },
      }),
      API({
        id: "getMidpointY",
        signature: "getMidpointY(variable)",
        params: [["variable","String","Sprite tag"]],
        returns: "Float",
        description: "Returns the Y coordinate of the sprite's midpoint.",
        code: { lang: "lua", source: `local my = getMidpointY('player')` },
      }),
      API({
        id: "getGraphicMidpointX",
        signature: "getGraphicMidpointX(variable)",
        params: [["variable","String","Sprite tag"]],
        returns: "Float",
        description: "Returns the X coordinate of the graphic's midpoint (center of the texture, ignoring offsets).",
        code: { lang: "lua", source: `local gmx = getGraphicMidpointX('player')` },
      }),
      API({
        id: "getGraphicMidpointY",
        signature: "getGraphicMidpointY(variable)",
        params: [["variable","String","Sprite tag"]],
        returns: "Float",
        description: "Returns the Y coordinate of the graphic's midpoint.",
        code: { lang: "lua", source: `local gmy = getGraphicMidpointY('player')` },
      }),
      API({
        id: "getScreenPositionX",
        signature: "getScreenPositionX(variable, ?camera)",
        params: [["variable","String","Sprite tag"],["camera","String","Camera name (<code>'game'</code>/<code>'hud'</code>)","optional"]],
        returns: "Float",
        description: "Returns the sprite's X position in screen coordinates for the given camera.",
        code: { lang: "lua", source: `local sx = getScreenPositionX('hud_element', 'hud')` },
      }),
      API({
        id: "getScreenPositionY",
        signature: "getScreenPositionY(variable, ?camera)",
        params: [["variable","String","Sprite tag"],["camera","String","Camera name","optional"]],
        returns: "Float",
        description: "Returns the sprite's Y position in screen coordinates for the given camera.",
        code: { lang: "lua", source: `local sy = getScreenPositionY('hud_element', 'hud')` },
      }),
      {
        id: "pixel",
        title: "Pixel & Graphic Loading",
        kind: "prose",
        body: "Read pixel data from sprites and swap their graphics at runtime.",
      },
      API({
        id: "getPixelColor",
        signature: "getPixelColor(obj, x, y)",
        params: [["obj","String","Sprite tag"],["x","Int","X coordinate within the sprite's bitmap"],["y","Int","Y coordinate within the sprite's bitmap"]],
        returns: "Int",
        description: "Returns the color of a specific pixel on the sprite's bitmap as an ARGB integer.",
        code: { lang: "lua", source: `local col = getPixelColor('logo', 50, 30)` },
      }),
      API({
        id: "loadGraphic",
        signature: "loadGraphic(variable, image, ?gridX, ?gridY)",
        params: [["variable","String","Sprite tag"],["image","String","Image path (no extension)"],["gridX","Int","Frame width for sprite sheet grid","default 0"],["gridY","Int","Frame height for sprite sheet grid","default 0"]],
        returns: "Void",
        description: "Loads a new image onto an existing sprite, optionally splitting it into a grid of frames.",
        code: { lang: "lua", source: `loadGraphic('player', 'characters/bf_dance', 150, 150)` },
      }),
      API({
        id: "loadFrames",
        signature: "loadFrames(variable, image, ?spriteType)",
        params: [["variable","String","Sprite tag"],["image","String","Image path (no extension)"],["spriteType","String","<code>'sparrow'</code>, <code>'packer'</code>, or <code>'aseprite'</code>","default 'sparrow'"]],
        returns: "Void",
        description: "Loads animated frames onto an existing sprite from an atlas.",
        code: { lang: "lua", source: `loadFrames('bf', 'characters/bf')` },
      }),
      {
        id: "utility",
        title: "Utility Functions",
        kind: "prose",
        body: `<table class="tbl">
  <thead><tr><th>Function</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>FlxColor(colorString)</code></td><td>Creates a FlxColor from string (alias for getColorFromString)</td></tr>
    <tr><td><code>getColorFromName(colorString)</code></td><td>Creates color from string name</td></tr>
    <tr><td><code>getColorFromString(colorString)</code></td><td>Creates color from string</td></tr>
    <tr><td><code>getColorFromHex(hex)</code></td><td>Creates color from hex string (auto-prepends #)</td></tr>
    <tr><td><code>stringStartsWith(str, prefix)</code></td><td>String starts with check</td></tr>
    <tr><td><code>stringEndsWith(str, suffix)</code></td><td>String ends with check</td></tr>
    <tr><td><code>stringSplit(str, delimiter)</code></td><td>Splits string into table</td></tr>
    <tr><td><code>stringTrim(str)</code></td><td>Trims whitespace</td></tr>
    <tr><td><code>getRandomInt(min, max, ?exclude)</code></td><td>Random integer</td></tr>
    <tr><td><code>getRandomFloat(min, max, ?exclude)</code></td><td>Random float</td></tr>
    <tr><td><code>getRandomBool()</code></td><td>Random boolean</td></tr>
    <tr><td><code>debugPrint(text, ?color)</code></td><td>Prints debug text to screen</td></tr>
  </tbody>
</table>`,
      },
    ],
  },

  /* ---------------- se-animation ---------------- */
  "se-animation": {
    title: "Animation Functions",
    category: "API Reference",
    subtitle: "Define and play animations on animated sprites. Animations are identified by a <code>name</code> string you choose when adding them.",
    sections: [
      {
        id: "anim-create",
        title: "Adding Animations",
        kind: "prose",
        body: "These functions register animations on animated sprites created with <code>makeAnimatedLuaSprite</code>.",
      },
      API({
        id: "addAnimationByPrefix",
        signature: "addAnimationByPrefix(obj, name, prefix, ?framerate, ?loop)",
        params: [["obj","String","Sprite tag"],["name","String","Animation name (used with <code>playAnim</code>)"],["prefix","String","Frame prefix in the sparrow/packer XML"],["framerate","Int","Frames per second","default 24"],["loop","Bool","Whether the animation loops","default true"]],
        returns: "Void",
        description: "Adds an animation by matching frame names that start with <code>prefix</code>. The standard sparrow-style method.",
        code: { lang: "lua", source: `addAnimationByPrefix('bf', 'idle', 'BF idle dance', 24, true)
addAnimationByPrefix('bf', 'singUP', 'BF notes up', 24, false)` },
      }),
      API({
        id: "addAnimation",
        signature: "addAnimation(obj, name, frames, ?framerate, ?loop)",
        params: [["obj","String","Sprite tag"],["name","String","Animation name"],["frames","Table","Array of frame indices, e.g. <code>{0,1,2,3}</code>"],["framerate","Int","Frames per second","default 24"],["loop","Bool","Whether the animation loops","default true"]],
        returns: "Void",
        description: "Adds an animation by specifying exact frame indices.",
        code: { lang: "lua", source: `addAnimation('bf', 'blink', {0, 1}, 4, false)` },
      }),
      API({
        id: "addAnimationByIndices",
        signature: "addAnimationByIndices(obj, name, prefix, indices, ?framerate, ?loop)",
        params: [["obj","String","Sprite tag"],["name","String","Animation name"],["prefix","String","Frame prefix"],["indices","String","Comma-separated frame indices, e.g. <code>'0,2,4,6'</code>"],["framerate","Int","FPS","default 24"],["loop","Bool","Looping","default true"]],
        returns: "Void",
        description: "Adds an animation by prefix + comma-separated index string.",
        code: { lang: "lua", source: `addAnimationByIndices('bf', 'dodge', 'BF dodge', '0,3,5', 12, false)` },
      }),
      API({
        id: "addAnimationBySymbol",
        signature: "addAnimationBySymbol(obj, name, symbol, ?framerate, ?loop)",
        params: [["obj","String","Sprite tag"],["name","String","Animation name"],["symbol","String","Symbol name from flixel animate atlas"],["framerate","Int","FPS","default 24"],["loop","Bool","Looping","default true"]],
        returns: "Void",
        description: "Adds an animation by flixel animate symbol (for animate-atlas sprites).",
        code: { lang: "lua", source: `addAnimationBySymbol('character', 'walk', 'walk_cycle', 12, true)` },
      }),
      API({
        id: "addAnimationBySymbolIndices",
        signature: "addAnimationBySymbolIndices(obj, name, symbol, indices, ?framerate, ?loop)",
        params: [["obj","String","Sprite tag"],["name","String","Animation name"],["symbol","String","Symbol name"],["indices","String","Comma-separated frame indices"],["framerate","Int","FPS","default 24"],["loop","Bool","Looping","default true"]],
        returns: "Void",
        description: "Adds an animation by symbol + specific frame indices.",
        code: { lang: "lua", source: `addAnimationBySymbolIndices('character', 'jump', 'jump_anim', '0,2,5', 12, false)` },
      }),
      API({
        id: "addAnimationByFrameLabel",
        signature: "addAnimationByFrameLabel(obj, name, label, ?framerate, ?loop)",
        params: [["obj","String","Sprite tag"],["name","String","Animation name"],["label","String","Frame label from the atlas"],["framerate","Int","FPS","default 24"],["loop","Bool","Looping","default true"]],
        returns: "Void",
        description: "Adds an animation by frame label (for labeled atlas frames).",
        code: { lang: "lua", source: `addAnimationByFrameLabel('character', 'taunt', 'taunt_start', 12, false)` },
      }),
      API({
        id: "addAnimationByFrameLabelIndices",
        signature: "addAnimationByFrameLabelIndices(obj, name, label, indices, ?framerate, ?loop)",
        params: [["obj","String","Sprite tag"],["name","String","Animation name"],["label","String","Frame label from the atlas"],["indices","String","Comma-separated frame indices within the label"],["framerate","Int","FPS","default 24"],["loop","Bool","Looping","default true"]],
        returns: "Void",
        description: "Adds an animation from specific frame indices inside a labeled atlas section (flixel animate atlases) — the index-picking variant of <code>addAnimationByFrameLabel</code>.",
        code: { lang: "lua", source: `addAnimationByFrameLabelIndices('character', 'wave', 'wave_loop', '0,1,2,3', 24, true)` },
      }),
      {
        id: "playback",
        title: "Playback & Offsets",
        kind: "prose",
        body: "Control animation playback and add positional offsets.",
      },
      API({
        id: "playAnim",
        signature: "playAnim(obj, name, ?forced, ?reverse, ?startFrame)",
        params: [["obj","String","Sprite tag"],["name","String","Animation name to play"],["forced","Bool","Force restart even if already playing","default false"],["reverse","Bool","Play in reverse","default false"],["startFrame","Int","Frame index to start from","default 0"]],
        returns: "Void",
        description: "Plays a registered animation. If <code>forced</code> is false and the animation is already playing, it won't restart.",
        code: { lang: "lua", source: `playAnim('bf', 'singUP', true)` },
      }),
      API({
        id: "addOffset",
        signature: "addOffset(obj, anim, x, y)",
        params: [["obj","String","Sprite tag"],["anim","String","Animation name"],["x","Float","Horizontal offset in pixels"],["y","Float","Vertical offset in pixels"]],
        returns: "Void",
        description: "Adds a positional offset to an animation. Useful for centering or adjusting specific animations without affecting the sprite's main position.",
        code: { lang: "lua", source: `addOffset('bf', 'singLEFT', -20, 0)` },
      }),
    ],
  },

  /* ---------------- se-tween ---------------- */
  "se-tween": {
    title: "Tween Functions",
    category: "API Reference",
    subtitle: "Animate sprite properties over time. Each tween is keyed by a string <code>tag</code> — starting a new tween with an existing tag cancels the previous one automatically.",
    sections: [
      {
        id: "tween-gen",
        title: "Generic & Convenience Tweens",
        kind: "prose",
        body: "Tween any numeric property or use the convenience wrappers for common properties.",
      },
      API({
        id: "startTween",
        signature: "startTween(tag, vars, values, duration, ?options)",
        params: [["tag","String","Tween identifier (cancels previous with same tag)"],["vars","String","Sprite tag (or dotted path like <code>'logo.scale'</code>)"],["values","Table","Target values, e.g. <code>{alpha = 0, x = 100}</code>"],["duration","Float","Duration in seconds"],["options","Table","Optional: <code>{ease, type, startDelay, loopDelay, onUpdate, onStart, onComplete}</code>","optional"]],
        returns: "Void",
        description: "Generic tween for any numeric properties. The <code>options</code> table supports: <code>ease</code> (string), <code>type</code> (FlxTween type constant: PERSIST=1, LOOPING=2, PINGPONG=4, ONESHOT=8), <code>startDelay</code>, <code>loopDelay</code>, <code>onUpdate</code>, <code>onStart</code>, <code>onComplete</code> (functions).",
        code: { lang: "lua", source: `startTween('logoFade', 'logo', {alpha = 0}, 1.5, {ease = 'quadOut'})
startTween('spin', 'logo', {angle = 360}, 2.0, {type = 4})` },
      }),
      API({
        id: "doTweenX",
        signature: "doTweenX(tag, vars, value, duration, ease)",
        params: [["tag","String","Tween tag"],["vars","String","Sprite tag"],["value","Float","Target X position"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens horizontal position.",
        code: { lang: "lua", source: `doTweenX('slide', 'logo', 800, 2.0, 'cubeInOut')` },
      }),
      API({
        id: "doTweenY",
        signature: "doTweenY(tag, vars, value, duration, ease)",
        params: [["tag","String","Tween tag"],["vars","String","Sprite tag"],["value","Float","Target Y position"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens vertical position.",
        code: { lang: "lua", source: `doTweenY('drop', 'box', 600, 1.0, 'bounceOut')` },
      }),
      API({
        id: "doTweenAngle",
        signature: "doTweenAngle(tag, vars, value, duration, ease)",
        params: [["tag","String","Tween tag"],["vars","String","Sprite tag"],["value","Float","Target rotation in degrees"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens rotation angle.",
        code: { lang: "lua", source: `doTweenAngle('spin', 'logo', 90, 0.4, 'quadOut')` },
      }),
      API({
        id: "doTweenAlpha",
        signature: "doTweenAlpha(tag, vars, value, duration, ease)",
        params: [["tag","String","Tween tag"],["vars","String","Sprite tag"],["value","Float","Target alpha (0–1)"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens transparency.",
        code: { lang: "lua", source: `doTweenAlpha('fade', 'box', 0.25, 1.5, 'quadOut')` },
      }),
      API({
        id: "doTweenZoom",
        signature: "doTweenZoom(tag, vars, value, duration, ease)",
        params: [["tag","String","Tween tag"],["vars","String","Camera or object tag"],["value","Float","Target zoom level"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens the zoom of a camera or sprite.",
        code: { lang: "lua", source: `doTweenZoom('camZoom', 'camGame', 1.5, 0.5, 'cubeOut')` },
      }),
      API({
        id: "doTweenColor",
        signature: "doTweenColor(tag, vars, targetColor, duration, ease)",
        params: [["tag","String","Tween tag"],["vars","String","Sprite tag"],["targetColor","String","Target hex color (<code>'RRGGBB'</code>)"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens the sprite's color tint.",
        code: { lang: "lua", source: `doTweenColor('recolor', 'box', '00FFAA', 2.5, 'sineInOut')` },
      }),
      API({
        id: "cancelTween",
        signature: "cancelTween(tag)",
        params: [["tag","String","Tween tag to cancel"]],
        returns: "Void",
        description: "Cancels an active tween by its tag.",
        code: { lang: "lua", source: `cancelTween('spin')` },
      }),
      {
        id: "note-tweens",
        title: "Note / Strumline Tweens",
        kind: "prose",
        body: "Convenience tweens for strumline (note receptor) properties. The <code>note</code> parameter is the strum index (0=left, 1=down, 2=up, 3=right).",
      },
      API({
        id: "noteTweenX",
        signature: "noteTweenX(tag, note, value, duration, ease)",
        params: [["tag","String","Tween tag"],["note","Int","Strum index (0–3)"],["value","Float","Target X position"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens the X position of a strum line.",
        code: { lang: "lua", source: `noteTweenX('slideLeft', 0, -100, 0.5, 'quadOut')` },
      }),
      API({
        id: "noteTweenY",
        signature: "noteTweenY(tag, note, value, duration, ease)",
        params: [["tag","String","Tween tag"],["note","Int","Strum index (0–3)"],["value","Float","Target Y position"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens the Y position of a strum line.",
        code: { lang: "lua", source: `noteTweenY('raiseUp', 1, -50, 0.3, 'backOut')` },
      }),
      API({
        id: "noteTweenAngle",
        signature: "noteTweenAngle(tag, note, value, duration, ease)",
        params: [["tag","String","Tween tag"],["note","Int","Strum index (0–3)"],["value","Float","Target rotation in degrees"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens the rotation angle of a strum line.",
        code: { lang: "lua", source: `noteTweenAngle('spinStrum', 2, 180, 1.0, 'elasticOut')` },
      }),
      API({
        id: "noteTweenAlpha",
        signature: "noteTweenAlpha(tag, note, value, duration, ease)",
        params: [["tag","String","Tween tag"],["note","Int","Strum index (0–3)"],["value","Float","Target alpha (0–1)"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens the alpha of a strum line.",
        code: { lang: "lua", source: `noteTweenAlpha('hideStrum', 3, 0, 0.4, 'quadOut')` },
      }),
      API({
        id: "noteTweenDirection",
        signature: "noteTweenDirection(tag, note, value, duration, ease)",
        params: [["tag","String","Tween tag"],["note","Int","Strum index (0–3)"],["value","Float","Target direction angle"],["duration","Float","Duration in seconds"],["ease","String","Ease name","default 'linear'"]],
        returns: "Void",
        description: "Tweens the direction angle of a strum line.",
        code: { lang: "lua", source: `noteTweenDirection('rotateDir', 1, 90, 0.5, 'sineOut')` },
      }),
    ],
  },

  /* ---------------- se-text ---------------- */
  "se-text": {
    title: "Text Functions",
    category: "API Reference",
    subtitle: "Create, configure, and manage <code>FlxText</code> objects. Text objects are identified by a string <code>tag</code>, just like sprites.",
    sections: [
      {
        id: "text-creation",
        title: "Creation & Lifecycle",
        kind: "prose",
        body: "Create text objects, add/remove them from the display list, and check their existence.",
      },
      API({
        id: "makeLuaText",
        signature: "makeLuaText(tag, text, width, x, y)",
        params: [["tag","String","Unique text identifier"],["text","String","Text content to display"],["width","Int","Field width in pixels (<code>0</code> = auto-size)"],["x","Float","X position","default 0"],["y","Float","Y position","default 0"]],
        returns: "Void",
        description: "Creates a text object. Text is not visible until <code>addLuaText</code> is called.",
        code: { lang: "lua", source: `makeLuaText('title', 'Hello World!', 0, 100, 50)
addLuaText('title')` },
      }),
      API({
        id: "addLuaText",
        signature: "addLuaText(tag)",
        params: [["tag","String","Text tag to add to the display list"]],
        returns: "Void",
        description: "Adds a previously-created text object to the state's draw list.",
        code: { lang: "lua", source: `addLuaText('title')` },
      }),
      API({
        id: "removeLuaText",
        signature: "removeLuaText(tag, ?destroy)",
        params: [["tag","String","Text tag to remove"],["destroy","Bool","If true, also destroys the text object","default false"]],
        returns: "Void",
        description: "Removes a text object from the display list. Optionally destroys it.",
        code: { lang: "lua", source: `removeLuaText('old_label', true)` },
      }),
      API({
        id: "luaTextExists",
        signature: "luaTextExists(tag)",
        params: [["tag","String","Text tag to check"]],
        returns: "Bool",
        description: "Returns <code>true</code> if a text object with the given tag has been created.",
        code: { lang: "lua", source: `if luaTextExists('score') then
    setTextString('score', '1000')
end` },
      }),
      {
        id: "text-mutators",
        title: "Text Mutators",
        kind: "prose",
        body: "Change the text content, appearance, and layout properties.",
      },
      API({
        id: "setTextString",
        signature: "setTextString(tag, text)",
        params: [["tag","String","Text tag"],["text","String","New text content"]],
        returns: "Void",
        description: "Replaces the displayed text content.",
        code: { lang: "lua", source: `setTextString('label', 'Score: ' .. score)` },
      }),
      API({
        id: "setTextSize",
        signature: "setTextSize(tag, size)",
        params: [["tag","String","Text tag"],["size","Int","Font size in points"]],
        returns: "Void",
        description: "Sets the font size.",
        code: { lang: "lua", source: `setTextSize('title', 32)` },
      }),
      API({
        id: "setTextWidth",
        signature: "setTextWidth(tag, width)",
        params: [["tag","String","Text tag"],["width","Int","Field width in pixels"]],
        returns: "Void",
        description: "Sets the text field width. Use <code>0</code> for auto-size.",
        code: { lang: "lua", source: `setTextWidth('description', 400)` },
      }),
      API({
        id: "setTextHeight",
        signature: "setTextHeight(tag, height)",
        params: [["tag","String","Text tag"],["height","Int","Field height in pixels"]],
        returns: "Void",
        description: "Sets the text field height.",
        code: { lang: "lua", source: `setTextHeight('panel', 200)` },
      }),
      API({
        id: "setTextAutoSize",
        signature: "setTextAutoSize(tag, value)",
        params: [["tag","String","Text tag"],["value","Bool","Auto-size enabled?"]],
        returns: "Void",
        description: "Enables or disables automatic width/height based on text content.",
        code: { lang: "lua", source: `setTextAutoSize('title', true)` },
      }),
      API({
        id: "setTextBorder",
        signature: "setTextBorder(tag, size, color, ?style)",
        params: [["tag","String","Text tag"],["size","Float","Border thickness"],["color","String","Border color hex (<code>'RRGGBB'</code>)"],["style","String","<code>'outline'</code>, <code>'shadow'</code>, <code>'outline_fast'</code>, <code>'none'</code>","default 'outline'"]],
        returns: "Void",
        description: "Sets the text border style, thickness, and color.",
        code: { lang: "lua", source: `setTextBorder('title', 2, '000000', 'outline')` },
      }),
      API({
        id: "setTextColor",
        signature: "setTextColor(tag, color)",
        params: [["tag","String","Text tag"],["color","String","Text color hex (<code>'RRGGBB'</code>)"]],
        returns: "Void",
        description: "Sets the text fill color.",
        code: { lang: "lua", source: `setTextColor('title', 'FF6699')` },
      }),
      API({
        id: "setTextFont",
        signature: "setTextFont(tag, newFont)",
        params: [["tag","String","Text tag"],["newFont","String","Font name or path (resolved through <code>Paths.font</code>)"]],
        returns: "Void",
        description: "Sets the text font.",
        code: { lang: "lua", source: `setTextFont('title', 'vcr')` },
      }),
      API({
        id: "setTextItalic",
        signature: "setTextItalic(tag, italic)",
        params: [["tag","String","Text tag"],["italic","Bool","Enable italic style"]],
        returns: "Void",
        description: "Toggles italic text styling.",
        code: { lang: "lua", source: `setTextItalic('quote', true)` },
      }),
      API({
        id: "setTextAlignment",
        signature: "setTextAlignment(tag, ?alignment)",
        params: [["tag","String","Text tag"],["alignment","String","<code>'left'</code>, <code>'center'</code>, <code>'right'</code>","default 'left'"]],
        returns: "Void",
        description: "Sets the text alignment.",
        code: { lang: "lua", source: `setTextAlignment('title', 'center')` },
      }),
      {
        id: "text-getters",
        title: "Text Getters",
        kind: "prose",
        body: "Read properties from existing text objects.",
      },
      API({
        id: "getTextString",
        signature: "getTextString(tag)",
        params: [["tag","String","Text tag"]],
        returns: "String",
        description: "Returns the current text content.",
        code: { lang: "lua", source: `local content = getTextString('label')` },
      }),
      API({
        id: "getTextSize",
        signature: "getTextSize(tag)",
        params: [["tag","String","Text tag"]],
        returns: "Int",
        description: "Returns the current font size.",
        code: { lang: "lua", source: `local size = getTextSize('title')` },
      }),
      API({
        id: "getTextFont",
        signature: "getTextFont(tag)",
        params: [["tag","String","Text tag"]],
        returns: "String",
        description: "Returns the current font name.",
        code: { lang: "lua", source: `local font = getTextFont('title')` },
      }),
      API({
        id: "getTextWidth",
        signature: "getTextWidth(tag)",
        params: [["tag","String","Text tag"]],
        returns: "Int",
        description: "Returns the current text field width.",
        code: { lang: "lua", source: `local w = getTextWidth('panel')` },
      }),
    ],
  },

  /* ---------------- se-input ---------------- */
  "se-input": {
    title: "Input Functions",
    category: "API Reference",
    subtitle: "Query keyboard, mouse, and gamepad input. Keyboard functions accept <code>FlxKey</code> names (case-insensitive) — <code>'SPACE'</code>, <code>'A'</code>, <code>'ENTER'</code>, etc.",
    sections: [
      {
        id: "input-keyboard",
        title: "Keyboard — Game Keys",
        kind: "prose",
        body: "These respect the player's control bindings (LEFT/DOWN/UP/RIGHT). Use these for gameplay input.",
      },
      API({
        id: "keyJustPressed",
        signature: "keyJustPressed(name)",
        params: [["name","String","Game key name: <code>'left'</code>, <code>'down'</code>, <code>'up'</code>, <code>'right'</code>, <code>'accept'</code>, <code>'back'</code>, <code>'pause'</code>, <code>'reset'</code>"]],
        returns: "Bool",
        description: "Returns <code>true</code> on the frame a game key is first pressed.",
        code: { lang: "lua", source: `if keyJustPressed('space') then
    print('jump!')
end` },
      }),
      API({
        id: "keyPressed",
        signature: "keyPressed(name)",
        params: [["name","String","Game key name"]],
        returns: "Bool",
        description: "Returns <code>true</code> while a game key is held down.",
        code: { lang: "lua", source: `if keyPressed('left') then
    moveLeft()
end` },
      }),
      API({
        id: "keyReleased",
        signature: "keyReleased(name)",
        params: [["name","String","Game key name"]],
        returns: "Bool",
        description: "Returns <code>true</code> on the frame a game key is released.",
        code: { lang: "lua", source: `if keyReleased('accept') then
    confirm()
end` },
      }),
      {
        id: "input-raw-keyboard",
        title: "Keyboard — Raw Keys",
        kind: "prose",
        body: "These query the physical keyboard directly, ignoring control bindings.",
      },
      API({
        id: "keyboardJustPressed",
        signature: "keyboardJustPressed(name)",
        params: [["name","String","FlxKey name: <code>'SPACE'</code>, <code>'A'</code>, <code>'F1'</code>, etc."]],
        returns: "Bool",
        description: "Returns <code>true</code> on the frame a physical key is pressed.",
        code: { lang: "lua", source: `if keyboardJustPressed('ESCAPE') then
    openPauseMenu()
end` },
      }),
      API({
        id: "keyboardPressed",
        signature: "keyboardPressed(name)",
        params: [["name","String","FlxKey name"]],
        returns: "Bool",
        description: "Returns <code>true</code> while a physical key is held.",
        code: { lang: "lua", source: `if keyboardPressed('SHIFT') then
    sprint()
end` },
      }),
      API({
        id: "keyboardReleased",
        signature: "keyboardReleased(name)",
        params: [["name","String","FlxKey name"]],
        returns: "Bool",
        description: "Returns <code>true</code> on the frame a physical key is released.",
        code: { lang: "lua", source: `if keyboardReleased('SHIFT') then
    stopSprinting()
end` },
      }),
      {
        id: "input-mouse",
        title: "Mouse",
        kind: "prose",
        body: "Query mouse button states and cursor position.",
      },
      API({
        id: "mouseClicked",
        signature: "mouseClicked(button)",
        params: [["button","String","<code>'left'</code>, <code>'middle'</code>, <code>'right'</code>"]],
        returns: "Bool",
        description: "Returns <code>true</code> on the frame a mouse button is clicked.",
        code: { lang: "lua", source: `if mouseClicked('left') then
    print('clicked!')
end` },
      }),
      API({
        id: "mousePressed",
        signature: "mousePressed(button)",
        params: [["button","String","<code>'left'</code>, <code>'middle'</code>, <code>'right'</code>"]],
        returns: "Bool",
        description: "Returns <code>true</code> while a mouse button is held.",
        code: { lang: "lua", source: `if mousePressed('left') then
    dragObject()
end` },
      }),
      API({
        id: "mouseReleased",
        signature: "mouseReleased(button)",
        params: [["button","String","<code>'left'</code>, <code>'middle'</code>, <code>'right'</code>"]],
        returns: "Bool",
        description: "Returns <code>true</code> on the frame a mouse button is released.",
        code: { lang: "lua", source: `if mouseReleased('left') then
    dropObject()
end` },
      }),
      API({
        id: "getMouseX",
        signature: "getMouseX(camera)",
        params: [["camera","String","Camera name: <code>'game'</code>, <code>'hud'</code>"]],
        returns: "Float",
        description: "Returns the mouse's X position in world coordinates for the given camera.",
        code: { lang: "lua", source: `local mx = getMouseX('game')` },
      }),
      API({
        id: "getMouseY",
        signature: "getMouseY(camera)",
        params: [["camera","String","Camera name"]],
        returns: "Float",
        description: "Returns the mouse's Y position in world coordinates for the given camera.",
        code: { lang: "lua", source: `local my = getMouseY('game')` },
      }),
      {
        id: "input-gamepad",
        title: "Gamepad",
        kind: "prose",
        body: "Query gamepad button states and analog sticks. The <code>name</code> parameter accepts any <code>FlxGamepadInputType</code> value (e.g. <code>'A'</code>, <code>'B'</code>, <code>'X'</code>, <code>'Y'</code>, <code>'LEFT_SHOULDER'</code>, <code>'RIGHT_TRIGGER'</code>).",
      },
      API({
        id: "gamepadJustPressed",
        signature: "gamepadJustPressed(id, name)",
        params: [["id","Int","Gamepad ID (0-based)"],["name","String","Button name"]],
        returns: "Bool",
        description: "Returns <code>true</code> on the frame a specific gamepad's button is pressed.",
        code: { lang: "lua", source: `if gamepadJustPressed(0, 'A') then
    print('jump!')
end` },
      }),
      API({
        id: "gamepadPressed",
        signature: "gamepadPressed(id, name)",
        params: [["id","Int","Gamepad ID"],["name","String","Button name"]],
        returns: "Bool",
        description: "Returns <code>true</code> while a specific gamepad's button is held.",
        code: { lang: "lua", source: `if gamepadPressed(0, 'LEFT_SHOULDER') then
    sprint()
end` },
      }),
      API({
        id: "gamepadReleased",
        signature: "gamepadReleased(id, name)",
        params: [["id","Int","Gamepad ID"],["name","String","Button name"]],
        returns: "Bool",
        description: "Returns <code>true</code> on the frame a specific gamepad's button is released.",
        code: { lang: "lua", source: `if gamepadReleased(0, 'A') then
    stopJump()
end` },
      }),
      API({
        id: "anyGamepadJustPressed",
        signature: "anyGamepadJustPressed(name)",
        params: [["name","String","Button name"]],
        returns: "Bool",
        description: "Returns <code>true</code> when <em>any</em> connected gamepad's button is pressed.",
        code: { lang: "lua", source: `if anyGamepadJustPressed('START') then
    pauseGame()
end` },
      }),
      API({
        id: "anyGamepadPressed",
        signature: "anyGamepadPressed(name)",
        params: [["name","String","Button name"]],
        returns: "Bool",
        description: "Returns <code>true</code> while <em>any</em> connected gamepad's button is held.",
        code: { lang: "lua", source: `if anyGamepadPressed('RIGHT_TRIGGER') then
    turbo()
end` },
      }),
      API({
        id: "anyGamepadReleased",
        signature: "anyGamepadReleased(name)",
        params: [["name","String","Button name"]],
        returns: "Bool",
        description: "Returns <code>true</code> when <em>any</em> connected gamepad's button is released.",
        code: { lang: "lua", source: `if anyGamepadReleased('RIGHT_TRIGGER') then
    stopTurbo()
end` },
      }),
      API({
        id: "gamepadAnalogX",
        signature: "gamepadAnalogX(id, ?leftStick)",
        params: [["id","Int","Gamepad ID"],["leftStick","Bool","<code>true</code> for left stick, <code>false</code> for right stick","default true"]],
        returns: "Float",
        description: "Returns the X-axis value of a gamepad's analog stick (-1 to 1).",
        code: { lang: "lua", source: `local dx = gamepadAnalogX(0)      -- left stick X
local rx = gamepadAnalogX(0, false) -- right stick X` },
      }),
      API({
        id: "gamepadAnalogY",
        signature: "gamepadAnalogY(id, ?leftStick)",
        params: [["id","Int","Gamepad ID"],["leftStick","Bool","<code>true</code> for left stick, <code>false</code> for right stick","default true"]],
        returns: "Float",
        description: "Returns the Y-axis value of a gamepad's analog stick (-1 to 1).",
        code: { lang: "lua", source: `local dy = gamepadAnalogY(0)      -- left stick Y
local ry = gamepadAnalogY(0, false) -- right stick Y` },
      }),
    ],
  },

  /* ---------------- Easings ---------------- */
  "easings": {
    title: "Easing Names",
    category: "Reference",
    subtitle: `<code>ease</code> strings are matched against <code>FlxEase</code> function names. Unknown names (or omitted ease) fall back to <code>linear</code>.`,
    sections: [{ id: "list", kind: "easings" }],
  },

  /* ---------------- Colors ---------------- */
  "colors": {
    title: "Color Format",
    category: "Reference",
    subtitle: "Color arguments accept three equivalent forms. Internally they go through <code>FlxColor.fromString</code> and the result is the same in each case.",
    sections: [{ id: "forms", kind: "colors" }],
  },

  /* ---------------- Examples ---------------- */
  "examples": {
    title: "Examples",
    category: "Guides",
    subtitle: "Full, runnable scripts that exercise the API end to end. Drop any of these into <code>scripts/</code> and they'll be picked up on the next run.",
    sections: [
      {
        id: "intro",
        kind: "prose",
        body: `Each example below is short, focused, and uses only documented APIs. Drop any file into <code>scripts/</code> and it'll be picked up on the next run.`,
      },
      {
        id: "static-sprite",
        title: "1. Creating and displaying a sprite",
        kind: "prose",
        body: `Create a static sprite from an image, add it to the display list, center it on screen.`,
        code: {
          lang: "lua",
          source: `function onCreate()
    makeLuaSprite('logo', 'menus/logo', 0, 0)
    screenCenter('logo')
    addLuaSprite('logo')
end`,
        },
      },
      {
        id: "animated-sprite",
        title: "2. Animated sprite with idle + sing",
        kind: "prose",
        body: `Create an animated sprite and define two animations. Play different animations based on input.`,
        code: {
          lang: "lua",
          filename: "scripts/animated.lua",
          source: `function onCreate()
    makeAnimatedLuaSprite('bf', 'characters/bf', 400, 300, 'sparrow')
    addLuaSprite('bf')
    addAnimationByPrefix('bf', 'idle', 'BF idle dance', 24, true)
    addAnimationByPrefix('bf', 'singUP', 'BF notes up', 24, false)
    playAnim('bf', 'idle')
end

function onNoteHit(noteData)
    playAnim('bf', 'singUP', true)
end`,
        },
      },
      {
        id: "tween-basic",
        title: "3. Tween sprite properties",
        kind: "prose",
        body: `Tween a sprite's position, alpha, and angle — all in one script. Note that reusing a tween tag cancels the previous tween automatically.`,
        code: {
          lang: "lua",
          filename: "scripts/tween_demo.lua",
          source: `function onCreate()
    makeLuaSprite('box')
    makeGraphic('box', 200, 120, 'FF6699')
    addLuaSprite('box')
    screenCenter('box')

    doTweenAlpha('fadeIn', 'box', 1, 1.0, 'quadOut')
    doTweenX('slide', 'box', 600, 2.0, 'cubeInOut')
    doTweenAngle('spin', 'box', 360, 2.0, 'quadOut')
end`,
        },
      },
      {
        id: "tween-pulse",
        title: "4. Beat-reactive pulse tween",
        kind: "prose",
        body: `Pulse a sprite on every beat. Starting a new tween with the same tag cancels the previous one — no manual cleanup needed.`,
        code: {
          lang: "lua",
          filename: "scripts/pulse.lua",
          source: `function onCreate()
    makeLuaSprite('logo')
    makeGraphic('logo', 200, 120, 'FF6699')
    addLuaSprite('logo')
    screenCenter('logo')
end

function onBeatHit(beat)
    startTween('logoGrow', 'logo', {scale = {x = 1.2, y = 1.2}}, 0.1, {ease = 'expoOut'})
    startTween('logoSettle', 'logo', {scale = {x = 1, y = 1}}, 0.3, {ease = 'quadOut'})
end`,
        },
      },
      {
        id: "input-basic",
        title: "5. React to key presses",
        kind: "prose",
        body: `Use <code>keyJustPressed</code> for discrete actions (one shot per press). Great for jumps, menu actions, toggles.`,
        code: {
          lang: "lua",
          source: `function onUpdate(elapsed)
    if keyJustPressed('accept') then
        print('confirmed!')
    end
end`,
        },
      },
      {
        id: "hold-vs-tap",
        title: "6. Hold vs tap detection",
        kind: "prose",
        body: `Use <code>keyPressed</code> for continuous actions while held, and <code>keyJustPressed</code> / <code>keyReleased</code> for edge-triggered actions.`,
        code: {
          lang: "lua",
          source: `function onUpdate(elapsed)
    if keyPressed('left') then
        print('moving left...')
    end
    if keyJustPressed('accept') then
        print('tap!')
    end
    if keyReleased('accept') then
        print('released!')
    end
end`,
        },
      },
      {
        id: "text-basic",
        title: "7. Display and update text",
        kind: "prose",
        body: `Create a text label and update it on every beat to show the current beat number.`,
        code: {
          lang: "lua",
          filename: "scripts/beat_counter.lua",
          source: `function onCreate()
    makeLuaText('beatLabel', 'Beat: 0', 200, 20, 20)
    setTextSize('beatLabel', 24)
    setTextBorder('beatLabel', 1, '000000', 'outline')
    addLuaText('beatLabel')
end

function onBeatHit(beat)
    setTextString('beatLabel', 'Beat: ' .. beat)
end`,
        },
      },
      {
        id: "hud-overlay",
        title: "8. HUD overlay locked to screen",
        kind: "prose",
        body: `Create a top bar pinned to the screen using <code>setScrollFactor</code>. Camera scrolling won't move it.`,
        code: {
          lang: "lua",
          filename: "scripts/hud.lua",
          source: `function onCreate()
    makeLuaSprite('hud_bg')
    makeGraphic('hud_bg', 1280, 60, '000000')
    addLuaSprite('hud_bg')
    setScrollFactor('hud_bg', 0, 0)
    setProperty('hud_bg.alpha', 0.6)

    makeLuaText('hud_score', 'Score: 0', 200, 20, 16)
    setTextSize('hud_score', 22)
    addLuaText('hud_score')
    setScrollFactor('hud_score', 0, 0)
end

function onBeatHit(beat)
    setTextString('hud_score', 'Beat: ' .. beat)
end`,
        },
      },
      {
        id: "parallax",
        title: "9. Three-layer parallax background",
        kind: "prose",
        body: `Different <code>setScrollFactor</code> values give a depth-of-field feel as the camera moves.`,
        code: {
          lang: "lua",
          filename: "scripts/parallax.lua",
          source: `function onCreate()
    makeLuaSprite('sky')
    makeGraphic('sky', 1680, 720, '113355')
    addLuaSprite('sky')
    setScrollFactor('sky', 0.1, 0.0)

    makeLuaSprite('hills')
    makeGraphic('hills', 1680, 360, '226677')
    addLuaSprite('hills')
    setProperty('hills.y', 360)
    setScrollFactor('hills', 0.4, 0.2)

    makeLuaSprite('grass')
    makeGraphic('grass', 1680, 120, '224422')
    addLuaSprite('grass')
    setProperty('grass.y', 600)
    setScrollFactor('grass', 1.0, 1.0)
end`,
        },
      },
      {
        id: "glow-burst",
        title: "10. Glow burst on beat (blend mode + tween)",
        kind: "prose",
        body: `Stack two sprites — a base image and a white glow copy on <code>add</code> blend. Pulse the glow's alpha on each beat.`,
        code: {
          lang: "lua",
          filename: "scripts/glow.lua",
          source: `function onCreate()
    makeLuaSprite('logo')
    makeGraphic('logo', 200, 120, '6699FF')
    addLuaSprite('logo')
    screenCenter('logo')

    makeLuaSprite('logo_glow')
    makeGraphic('logo_glow', 200, 120, 'FFFFFF')
    addLuaSprite('logo_glow')
    screenCenter('logo_glow')
    setBlendMode('logo_glow', 'add')
    setProperty('logo_glow.alpha', 0)
end

function onBeatHit(beat)
    setProperty('logo_glow.alpha', 1)
    doTweenAlpha('glowFade', 'logo_glow', 0, 0.35, 'expoOut')
end`,
        },
      },
      {
        id: "color-cycle",
        title: "11. Color cycling on beats",
        kind: "prose",
        body: `Tween through a palette of colors on each beat using <code>doTweenColor</code>.`,
        code: {
          lang: "lua",
          filename: "scripts/colorbeat.lua",
          source: `local palette = { 'FF6699', '66CCFF', 'FFEE88', '88FFAA', 'AA77FF' }

function onCreate()
    makeLuaSprite('box')
    makeGraphic('box', 200, 160, 'FFFFFF')
    addLuaSprite('box')
    screenCenter('box')
end

function onBeatHit(beat)
    local hex = palette[(beat % #palette) + 1]
    doTweenColor('boxColor', 'box', hex, 0.4, 'quadOut')
end`,
        },
      },
      {
        id: "countdown",
        title: "12. Three-second countdown with runTimer",
        kind: "prose",
        body: `Use <code>runTimer</code> with staggered times to create a countdown sequence. Each timer fires <code>onTimerCompleted</code>.`,
        code: {
          lang: "lua",
          filename: "scripts/countdown.lua",
          source: `function onCreate()
    makeLuaText('cd', '3', 200, 540, 320)
    setTextSize('cd', 96)
    addLuaText('cd')
    runTimer('cd1', 1.0)
    runTimer('cd2', 2.0)
    runTimer('cd3', 3.0)
end

function onTimerCompleted(tag)
    if tag == 'cd1' then setTextString('cd', '2')
    elseif tag == 'cd2' then setTextString('cd', '1')
    elseif tag == 'cd3' then setTextString('cd', 'GO!')
    end
end

function onDestroy()
    cancelTimer('cd1')
    cancelTimer('cd2')
    cancelTimer('cd3')
end`,
        },
      },
      {
        id: "pulsing-clock",
        title: "13. Pulsing beat indicator",
        kind: "prose",
        body: `A looping timer drives a color pulse every 0.5 seconds.`,
        code: {
          lang: "lua",
          filename: "scripts/clock.lua",
          source: `function onCreate()
    makeLuaSprite('dot')
    makeGraphic('dot', 40, 40, 'FF6699')
    addLuaSprite('dot')
    screenCenter('dot')

    runTimer('tick', 0.5, 0)  -- infinite loop
end

function onTimerCompleted(tag)
    if tag == 'tick' then
        setProperty('dot.alpha', 1)
        doTweenAlpha('fade', 'dot', 0.3, 0.4, 'quadOut')
    end
end

function onDestroy()
    cancelTimer('tick')
end`,
        },
      },
      {
        id: "midpoint",
        title: "14. Using midpoint queries",
        kind: "prose",
        body: `Read the center position of one sprite and position another relative to it.`,
        code: {
          lang: "lua",
          filename: "scripts/midpoint.lua",
          source: `function onCreate()
    makeLuaSprite('player')
    makeGraphic('player', 100, 150, '66CCFF')
    addLuaSprite('player')
    setProperty('player.x', 400)
    setProperty('player.y', 300)

    makeLuaSprite('hat')
    makeGraphic('hat', 60, 20, 'FF6699')
    addLuaSprite('hat')
    setProperty('hat.x', getMidpointX('player') - 30)
    setProperty('hat.y', getMidpointY('player') - 90)
end`,
        },
      },
      {
        id: "overlap-check",
        title: "15. Overlap detection",
        kind: "prose",
        body: `Check whether two sprites' hitboxes overlap.`,
        code: {
          lang: "lua",
          filename: "scripts/overlap.lua",
          source: `function onCreate()
    makeLuaSprite('box1')
    makeGraphic('box1', 100, 100, 'FF6699')
    addLuaSprite('box1')
    setProperty('box1.x', 200)
    setProperty('box1.y', 200)

    makeLuaSprite('box2')
    makeGraphic('box2', 100, 100, '66CCFF')
    addLuaSprite('box2')
    setProperty('box2.x', 250)
    setProperty('box2.y', 250)
end

function onUpdate(elapsed)
    if objectsOverlap('box1', 'box2') then
        print('overlapping!')
    end
end`,
        },
      },
    ],
  },

  /* ---------------- se-playstate ---------------- */
  "se-playstate": {
    title: "PlayState Functions",
    category: "API Reference",
    subtitle: "Functions that control song lifecycle, cutscenes, and gameplay state transitions.",
    sections: [
      {
        id: "playstate-intro",
        kind: "prose",
        body: `These globals control the current PlayState — starting/ending songs, triggering events, and managing cutscenes.`,
      },
      API({
        id: "startCountdown",
        signature: "startCountdown()",
        params: [],
        returns: "Void",
        description: "Starts the countdown before the song begins. Usually called from <code>onCreate</code> or after a pre-song cutscene finishes.",
        code: { lang: "lua", source: `function onCreate()
    startCountdown()
end` },
      }),
      API({
        id: "endSong",
        signature: "endSong()",
        params: [],
        returns: "Void",
        description: "Ends the current song and transitions out. Can be prevented by returning <code>Function_Stop</code> from <code>onEndSong</code>.",
        code: { lang: "lua", source: `function onEndSong()
    if score < 10000 then
        return Function_Stop
    end
end` },
      }),
      API({
        id: "restartSong",
        signature: "restartSong(?skipTransition)",
        params: [["skipTransition","Bool","Skip the transition animation","default false"]],
        returns: "Void",
        description: "Restarts the current song from the beginning.",
        code: { lang: "lua", source: `restartSong()  -- full restart
restartSong(true)  -- instant restart` },
      }),
      API({
        id: "exitSong",
        signature: "exitSong(?skipTransition)",
        params: [["skipTransition","Bool","Skip the transition animation","default false"]],
        returns: "Void",
        description: "Exits to the Freeplay or Story Menu.",
        code: { lang: "lua", source: `exitSong()` },
      }),
      API({
        id: "loadSong",
        signature: "loadSong(?name, ?difficultyNum)",
        params: [["name","String","Song name","optional"],["difficultyNum","Int","Difficulty index (0=Easy,1=Normal,2=Hard)","optional"]],
        returns: "Void",
        description: "Loads a song chart and switches to PlayState for that song.",
        code: { lang: "lua", source: `loadSong('bopeebo', 1)  -- load bopeebo on Normal` },
      }),
      API({
        id: "getSongPosition",
        signature: "getSongPosition()",
        params: [],
        returns: "Float",
        description: "Returns the current song playback position in milliseconds.",
        code: { lang: "lua", source: `local pos = getSongPosition()
print('current ms:', pos)` },
      }),
      API({
        id: "triggerEvent",
        signature: "triggerEvent(name, ?value1, ?value2)",
        params: [["name","String","Event name"],["value1","String","First event parameter","default ''"],["value2","String","Second event parameter","default ''"]],
        returns: "Void",
        description: "Fires a chart event as if it were encountered in the timeline. All scripts receive the <code>onEvent</code> callback.",
        code: { lang: "lua", source: `triggerEvent('Focus Camera', 'dad', '0.5')` },
      }),
      API({
        id: "setHealthBarColors",
        signature: "setHealthBarColors(left, right)",
        params: [["left","String","Left (opponent) health bar hex color"],["right","String","Right (player) health bar hex color"]],
        returns: "Void",
        description: "Changes the health bar gradient colors.",
        code: { lang: "lua", source: `setHealthBarColors('FF0000', '00FF00')` },
      }),
      API({
        id: "setTimeBarColors",
        signature: "setTimeBarColors(left, right)",
        params: [["left","String","Time bar left color hex"],["right","String","Time bar right color hex"]],
        returns: "Void",
        description: "Changes the time bar gradient colors.",
        code: { lang: "lua", source: `setTimeBarColors('FFFFFF', 'AAAAAA')` },
      }),
      API({
        id: "startDialogue",
        signature: "startDialogue(dialogueFile, ?music)",
        params: [["dialogueFile","String","JSON dialogue file path (no extension)"],["music","String","Background music for the dialogue","optional"]],
        returns: "Void",
        description: "Starts a dialogue cutscene from a JSON dialogue file.",
        code: { lang: "lua", source: `startDialogue('data/dialogue/intro', 'dialogueMusic')` },
      }),
      API({
        id: "startVideo",
        signature: "startVideo(videoFile, ?canSkip, ?forMidSong, ?shouldLoop, ?playOnLoad)",
        params: [["videoFile","String","Video file path (no extension)"],["canSkip","Bool","Whether the player can skip the video","default true"],["forMidSong","Bool","Whether this is a mid-song cutscene","default false"],["shouldLoop","Bool","Loop the video playback","default false"],["playOnLoad","Bool","Start playing as soon as the video loads","default true"]],
        returns: "Void",
        description: "Plays a video cutscene. Use <code>forMidSong = true</code> for videos that play in the middle of a song.",
        code: { lang: "lua", source: `startVideo('videos/intro', true)` },
      }),
      {
        id: "playstate-score",
        title: "Score Functions",
        kind: "prose",
        body: `Read and modify score, misses, hits, health, and rating during gameplay with the functions on the <a href="#" data-go="se-score">Score &amp; Health</a> page.`,
      },
    ],
  },

  /* ---------------- se-timer ---------------- */
  "se-timer": {
    title: "Timer Functions",
    category: "API Reference",
    subtitle: "Named <code>FlxTimer</code> wrappers — each timer is keyed by a string <code>tag</code>. Starting a new timer with an existing tag cancels the previous one automatically.",
    sections: [
      {
        id: "timer-intro",
        kind: "prose",
        body: `Timers fire the <code>onTimerCompleted(tag, loops, left)</code> callback when they finish. Use <code>runTimer</code> to start one and <code>cancelTimer</code> to stop it early.`,
      },
      API({
        id: "runTimer",
        signature: "runTimer(tag, time, ?loops)",
        params: [["tag","String","Timer identifier (cancels previous with same tag)"],["time","Float","Delay in seconds before firing"],["loops","Int","Number of times to fire. <code>0</code> = infinite","default 1"]],
        returns: "Void",
        description: "Starts a named timer. When it fires, <code>onTimerCompleted(tag, loops, left)</code> is called on all scripts. Re-using a tag cancels the previous timer first.",
        code: { lang: "lua", source: `runTimer('intro', 3.0)                       -- one-shot 3s timer
runTimer('rapid', 0.25, 8)                  -- 8 ticks, 0.25s apart
runTimer('pulse', 0.5, 0)                   -- infinite (0 = forever)

function onTimerCompleted(tag, loops, left)
    print(tag .. ' fired, ' .. left .. ' remaining')
end` },
      }),
      API({
        id: "cancelTimer",
        signature: "cancelTimer(tag)",
        params: [["tag","String","Timer tag to cancel"]],
        returns: "Void",
        description: "Cancels a named timer. If the timer no longer exists, does nothing.",
        code: { lang: "lua", source: `cancelTimer('rapid')` },
      }),
      {
        id: "cleanup",
        kind: "prose",
        callout: { kind: "warn", text: "Always call <code>cancelTimer(tag)</code> for active timers in <code>onDestroy</code> — they survive a state switch otherwise." },
      },
    ],
  },

  /* ---------------- SE: Built-in Variables ---------------- */
  "se-variables": {
    title: "Built-in Variables",
    category: "Reference",
    subtitle: "Complete list of all variables exposed as Lua globals by Shadow Engine. These can be read/written directly without any function call.",
    sections: [
      {
        id: "se-vars-table",
        title: "All variables",
        kind: "prose",
        body: `<p>These variables are available globally in every Lua script:</p>
<table class="tbl">
  <thead><tr><th>Variable</th><th>Type</th><th>Category</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td>luaDebugMode</td><td>Bool</td><td>Scripting</td><td>Shows errors on screen</td></tr>
    <tr><td>luaDeprecatedWarnings</td><td>Bool</td><td>Scripting</td><td>Deprecation warnings</td></tr>
    <tr><td>scriptName</td><td>String</td><td>Scripting</td><td>Current script path</td></tr>
    <tr><td>modFolder</td><td>String</td><td>Scripting</td><td>Mod folder name</td></tr>
    <tr><td>currentModDirectory</td><td>String</td><td>Scripting</td><td>Active mod directory</td></tr>
    <tr><td>version</td><td>String</td><td>Engine</td><td>Psych Engine version</td></tr>
    <tr><td>shadowVersion</td><td>String</td><td>Engine</td><td>Shadow Engine version</td></tr>
    <tr><td>buildTarget</td><td>String</td><td>Engine</td><td>Platform name</td></tr>
    <tr><td>screenWidth</td><td>Int</td><td>Flixel</td><td>Game width</td></tr>
    <tr><td>screenHeight</td><td>Int</td><td>Flixel</td><td>Game height</td></tr>
    <tr><td>songName</td><td>String</td><td>Song</td><td>Current song name</td></tr>
    <tr><td>songPath</td><td>String</td><td>Song</td><td>Formatted song path</td></tr>
    <tr><td>bpm</td><td>Float</td><td>Song</td><td>Starting BPM</td></tr>
    <tr><td>scrollSpeed</td><td>Float</td><td>Song</td><td>Note scroll speed</td></tr>
    <tr><td>songLength</td><td>Int</td><td>Song</td><td>Duration in ms</td></tr>
    <tr><td>startedCountdown</td><td>Bool</td><td>Song</td><td>Countdown started?</td></tr>
    <tr><td>seenCutscene</td><td>Bool</td><td>Song</td><td>Cutscene already played?</td></tr>
    <tr><td>inGameOver</td><td>Bool</td><td>Song</td><td>On game over screen?</td></tr>
    <tr><td>hasVocals</td><td>Bool</td><td>Song</td><td>Song has vocals?</td></tr>
    <tr><td>curStage</td><td>String</td><td>Chart</td><td>Current stage name</td></tr>
    <tr><td>isStoryMode</td><td>Bool</td><td>Mode</td><td>In story mode?</td></tr>
    <tr><td>difficulty</td><td>Int</td><td>Difficulty</td><td>0=Easy,1=Normal,2=Hard</td></tr>
    <tr><td>difficultyName</td><td>String</td><td>Difficulty</td><td>Display name</td></tr>
    <tr><td>weekRaw</td><td>Int</td><td>Week</td><td>Week ID</td></tr>
    <tr><td>week</td><td>String</td><td>Week</td><td>Week folder name</td></tr>
    <tr><td>curBpm</td><td>Float</td><td>Section</td><td>Current section BPM</td></tr>
    <tr><td>crochet</td><td>Float</td><td>Section</td><td>Beat duration (ms)</td></tr>
    <tr><td>stepCrochet</td><td>Float</td><td>Section</td><td>Step duration (ms)</td></tr>
    <tr><td>curSection</td><td>Int</td><td>Section</td><td>Current section</td></tr>
    <tr><td>curBeat</td><td>Int</td><td>Section</td><td>Current beat</td></tr>
    <tr><td>curStep</td><td>Int</td><td>Section</td><td>Current step</td></tr>
    <tr><td>curDecBeat</td><td>Float</td><td>Section</td><td>Decimal beat</td></tr>
    <tr><td>curDecStep</td><td>Float</td><td>Section</td><td>Decimal step</td></tr>
    <tr><td>mustHitSection</td><td>Bool</td><td>Section</td><td>Player's section?</td></tr>
    <tr><td>altAnim</td><td>Bool</td><td>Section</td><td>Alt animation?</td></tr>
    <tr><td>gfSection</td><td>Bool</td><td>Section</td><td>GF section?</td></tr>
    <tr><td>score</td><td>Int</td><td>Score</td><td>Current score</td></tr>
    <tr><td>misses</td><td>Int</td><td>Score</td><td>Mistakes count</td></tr>
    <tr><td>hits</td><td>Int</td><td>Score</td><td>Hits count</td></tr>
    <tr><td>combo</td><td>Int</td><td>Score</td><td>Current combo</td></tr>
    <tr><td>rating</td><td>Float</td><td>Score</td><td>0-1 percentage</td></tr>
    <tr><td>ratingName</td><td>String</td><td>Score</td><td>Sick!/Good/etc.</td></tr>
    <tr><td>ratingFC</td><td>String</td><td>Score</td><td>FC status</td></tr>
    <tr><td>healthGainMult</td><td>Float</td><td>Modifier</td><td>Health gain multiplier</td></tr>
    <tr><td>healthLossMult</td><td>Float</td><td>Modifier</td><td>Health loss multiplier</td></tr>
    <tr><td>playbackRate</td><td>Float</td><td>Modifier</td><td>Song speed</td></tr>
    <tr><td>instakillOnMiss</td><td>Bool</td><td>Modifier</td><td>Die on miss?</td></tr>
    <tr><td>practice</td><td>Bool</td><td>Modifier</td><td>Practice mode?</td></tr>
    <tr><td>botPlay</td><td>Bool</td><td>Modifier</td><td>Bot playing?</td></tr>
    <tr><td>guitarHeroSustains</td><td>Bool</td><td>Modifier</td><td>GH sustains?</td></tr>
    <tr><td>downscroll</td><td>Bool</td><td>ClientPrefs</td><td>Downscroll</td></tr>
    <tr><td>middlescroll</td><td>Bool</td><td>ClientPrefs</td><td>Middlescroll</td></tr>
    <tr><td>framerate</td><td>Int</td><td>ClientPrefs</td><td>Target FPS</td></tr>
    <tr><td>ghostTapping</td><td>Bool</td><td>ClientPrefs</td><td>Ghost tapping</td></tr>
    <tr><td>hideHud</td><td>Bool</td><td>ClientPrefs</td><td>Hide HUD</td></tr>
    <tr><td>timeBarType</td><td>String</td><td>ClientPrefs</td><td>Time bar display</td></tr>
    <tr><td>cameraZoomOnBeat</td><td>Bool</td><td>ClientPrefs</td><td>Zoom on beat</td></tr>
    <tr><td>flashingLights</td><td>Bool</td><td>ClientPrefs</td><td>Flashing effects</td></tr>
    <tr><td>noteOffset</td><td>Int</td><td>ClientPrefs</td><td>Note offset ms</td></tr>
    <tr><td>healthBarAlpha</td><td>Float</td><td>ClientPrefs</td><td>Health bar opacity</td></tr>
    <tr><td>noResetButton</td><td>Bool</td><td>ClientPrefs</td><td>No reset bind</td></tr>
    <tr><td>lowQuality</td><td>Bool</td><td>ClientPrefs</td><td>Low quality mode</td></tr>
    <tr><td>shadersEnabled</td><td>Bool</td><td>ClientPrefs</td><td>Shaders on/off</td></tr>
    <tr><td>noteSkin</td><td>String</td><td>Noteskin</td><td>Note skin name</td></tr>
    <tr><td>noteSkinPostfix</td><td>String</td><td>Noteskin</td><td>Skin postfix</td></tr>
    <tr><td>splashSkin</td><td>String</td><td>Noteskin</td><td>Splash skin</td></tr>
    <tr><td>splashSkinPostfix</td><td>String</td><td>Noteskin</td><td>Splash postfix</td></tr>
    <tr><td>splashAlpha</td><td>Float</td><td>Noteskin</td><td>Splash opacity</td></tr>
    <tr><td>Function_StopLua</td><td>String</td><td>Control</td><td>Stop current Lua callback chain</td></tr>
    <tr><td>Function_StopHScript</td><td>String</td><td>Control</td><td>Stop current HScript chain</td></tr>
    <tr><td>Function_StopAll</td><td>String</td><td>Control</td><td>Stop all callback chains</td></tr>
    <tr><td>Function_Stop</td><td>String</td><td>Control</td><td>Cancel current action (e.g. endSong)</td></tr>
    <tr><td>Function_Continue</td><td>String</td><td>Control</td><td>Continue callback chain</td></tr>
    <tr><td>inChartEditor</td><td>Bool</td><td>Charting</td><td>In chart editor?</td></tr>
    <tr><td>cameraX</td><td>Float</td><td>Camera</td><td>Camera X position</td></tr>
    <tr><td>cameraY</td><td>Float</td><td>Camera</td><td>Camera Y position</td></tr>
    <tr><td>difficultyPath</td><td>String</td><td>Difficulty</td><td>Lowercase difficulty with hyphen prefix</td></tr>
    <tr><td>defaultPlayerStrumX0-3</td><td>Float</td><td>Strum</td><td>Default player strum X positions (0=left,1=down,2=up,3=right)</td></tr>
    <tr><td>defaultPlayerStrumY0-3</td><td>Float</td><td>Strum</td><td>Default player strum Y positions</td></tr>
    <tr><td>defaultOpponentStrumX0-3</td><td>Float</td><td>Strum</td><td>Default opponent strum X positions</td></tr>
    <tr><td>defaultOpponentStrumY0-3</td><td>Float</td><td>Strum</td><td>Default opponent strum Y positions</td></tr>
    <tr><td>defaultBoyfriendX / defaultBoyfriendY</td><td>Float</td><td>Character</td><td>Default boyfriend group position from stage JSON</td></tr>
    <tr><td>defaultOpponentX / defaultOpponentY</td><td>Float</td><td>Character</td><td>Default opponent group position from stage JSON</td></tr>
    <tr><td>defaultGirlfriendX / defaultGirlfriendY</td><td>Float</td><td>Character</td><td>Default girlfriend group position from stage JSON</td></tr>
    <tr><td>boyfriendName</td><td>String</td><td>Character</td><td>Current player character JSON name</td></tr>
    <tr><td>dadName</td><td>String</td><td>Character</td><td>Current opponent character JSON name</td></tr>
    <tr><td>gfName</td><td>String</td><td>Character</td><td>Current girlfriend character JSON name</td></tr>
  </tbody>
</table>`,
      },
    ],
  },

  /* ---------------- FAQ ---------------- */
  "faq": {
    title: "FAQ",
    category: "Guides",
    sections: [
      {
        id: "questions",
        kind: "faq",
        items: [
          { q: "Where do I put scripts?",
            a: "Anywhere under <code>scripts/</code>. Every <code>.lua</code> file under that directory is always loaded — to exclude one, move it out of <code>scripts/</code>." },
          { q: "Do I need to load scripts manually?",
            a: "No. The engine registers every script automatically. You only need to define the <a href='#' data-go='event-callbacks'>event callbacks</a> you care about — missing callbacks are silently skipped, not errors." },
          { q: "Why does my tween snap instead of animate?",
            a: "Most likely the tag is already in use. Starting a tween with an existing tag <em>cancels</em> the previous one. Either pick a unique tag, or let it override deliberately — it's safe to re-fire the same tween tag every beat." },
          { q: "What's a beat vs a step vs a section?",
            a: "A <strong>step</strong> is one quarter of a beat. A <strong>beat</strong> is one conductor beat (4 steps). A <strong>section</strong> is one measure — 16 steps by default. The three callbacks <code>onStepHit</code>, <code>onBeatHit</code>, <code>onSectionHit</code> fire in that order from the <code>Conductor</code>." },
          { q: "How do I read engine state from a script?",
            a: "Use <code>getProperty(path)</code>. Dotted paths like <code>boyfriend.x</code> walk into the current PlayState via reflection. Use <code>getProperty(variable)</code> for any engine field." },
          { q: "How do I write engine state from a script?",
            a: "Use <code>setProperty(variable, value)</code>. Many built-in variables like <code>score</code>, <code>health</code>, <code>downscroll</code> can be directly assigned through globals too." },
          { q: "What happens if I pass an invalid easing name?",
            a: "It silently falls back to <code>linear</code>. See the <a href='#' data-go='easings'>Easing Names</a> page for the full list of valid values." },
          { q: "Does screenCenter work with the HUD camera?",
            a: "Yes. Combine <code>screenCenter</code> with <code>setObjectCamera(obj, 'hud')</code> to center elements on the HUD camera." },
          { q: "Can two scripts share state?",
            a: "Through <code>callScript()</code> and <code>callOnScripts()</code>. There is no shared global state by default — this keeps each script independent and reload-friendly." },
          { q: "How do I create a solid-color rectangle quickly?",
            a: "Use <code>makeLuaSprite('tag')</code> then <code>makeGraphic('tag', width, height, 'RRGGBB')</code>. No image file needed." },
        ],
      },
    ],
  },

  /* ---------------- SE: Reflection API ---------------- */
  "se-reflection": {
    title: "Reflection API",
    category: "API Reference",
    subtitle: "Read and write any property on any game object using dotted string paths.",
    sections: [
      {
        id: "intro",
        title: "How reflection works",
        kind: "prose",
        body: `Reflection lets a script read or write <em>any</em> field on the current state and its objects by name, without a dedicated function for each one. The lookup starts at the active state — usually <code>PlayState</code> during gameplay.

<ul>
  <li><strong>Dotted paths</strong> walk into nested objects: <code>'boyfriend.x'</code>, <code>'camGame.zoom'</code>, <code>'healthBar.percent'</code>.</li>
  <li><strong><code>allowMaps</code></strong> — pass <code>true</code> when the final field is a Haxe <code>Map</code> you want to index into.</li>
</ul>

These functions use Haxe reflection and are comparatively expensive — cache results in a local instead of calling them every frame where you can.`,
      },
      {
        id: "props",
        title: "Properties",
        kind: "prose",
        body: "Read and write fields on the current state, or static fields on any Haxe class.",
      },
      API({
        id: "getProperty",
        signature: "getProperty(variable, ?allowMaps)",
        params: [["variable","String","Property name or dotted path (e.g. <code>'boyfriend.x'</code>)"],["allowMaps","Bool","Allow indexing into <code>Map</code> fields","default false"]],
        returns: "Dynamic",
        description: "Reads a property from the current state by name. Dotted paths walk into nested objects via reflection.",
        code: { lang: "lua", source: `local x = getProperty('boyfriend.x')
local hp = getProperty('health')` },
      }),
      API({
        id: "setProperty",
        signature: "setProperty(variable, value, ?allowMaps)",
        params: [["variable","String","Property name or dotted path"],["value","Dynamic","New value"],["allowMaps","Bool","Allow indexing into <code>Map</code> fields","default false"]],
        returns: "Dynamic — the value that was set",
        description: "Writes a property on the current state by name. Dotted paths walk into nested objects.",
        code: { lang: "lua", source: `setProperty('boyfriend.x', 770)
setProperty('health', 2)` },
      }),
      API({
        id: "getPropertyFromClass",
        signature: "getPropertyFromClass(classVar, variable, ?allowMaps)",
        params: [["classVar","String","Class name. <code>'ClientPrefs'</code>, <code>'Conductor'</code>, <code>'PlayState'</code>, <code>'GameOverSubstate'</code> are auto-resolved; otherwise use the full package path"],["variable","String","Static field name or dotted path"],["allowMaps","Bool","Allow <code>Map</code> indexing","default false"]],
        returns: "Dynamic",
        description: "Reads a static field from a Haxe class. <code>'ClientPrefs'</code> fields are read from <code>ClientPrefs.data</code> automatically.",
        code: { lang: "lua", source: `local down = getPropertyFromClass('ClientPrefs', 'downScroll')
local beat = getPropertyFromClass('Conductor', 'curBeat')` },
      }),
      API({
        id: "setPropertyFromClass",
        signature: "setPropertyFromClass(classVar, variable, value, ?allowMaps)",
        params: [["classVar","String","Class name (short names auto-resolved)"],["variable","String","Static field name or dotted path"],["value","Dynamic","New value"],["allowMaps","Bool","Allow <code>Map</code> indexing","default false"]],
        returns: "Dynamic — the value that was set",
        description: "Writes a static field on a Haxe class.",
        code: { lang: "lua", source: `setPropertyFromClass('GameOverSubstate', 'characterName', 'bf-dead')` },
      }),
      {
        id: "groups",
        title: "Groups & arrays",
        kind: "prose",
        body: "Reach into the members of a group or array — individual notes, strums, or any custom group on the state.",
      },
      API({
        id: "getPropertyFromGroup",
        signature: "getPropertyFromGroup(obj, index, variable, ?allowMaps)",
        params: [["obj","String","Group or array name (dotted paths allowed)"],["index","Int","Member index within the group/array"],["variable","Dynamic","Field name (String) — or an Int to index a nested array"],["allowMaps","Bool","Allow <code>Map</code> indexing","default false"]],
        returns: "Dynamic",
        description: "Reads a property from a single member of a group or array (e.g. a note or a strum).",
        code: { lang: "lua", source: `local x = getPropertyFromGroup('strumLineNotes', 0, 'x')` },
      }),
      API({
        id: "setPropertyFromGroup",
        signature: "setPropertyFromGroup(obj, index, variable, value, ?allowMaps)",
        params: [["obj","String","Group or array name"],["index","Int","Member index"],["variable","Dynamic","Field name (String) or Int array index"],["value","Dynamic","New value"],["allowMaps","Bool","Allow <code>Map</code> indexing","default false"]],
        returns: "Dynamic — the value that was set",
        description: "Writes a property on a single member of a group or array.",
        code: { lang: "lua", source: `setPropertyFromGroup('strumLineNotes', 0, 'x', 100)` },
      }),
      API({
        id: "addToGroup",
        signature: "addToGroup(group, tag, ?index)",
        params: [["group","String","Target group or array field on the state. The special names <code>'comboGroup'</code>, <code>'uiGroup'</code>, <code>'noteGroup'</code> add directly to the PlayState"],["tag","String","Tag of an existing sprite/object to add"],["index","Int","Insert position; <code>-1</code> appends to the end","default -1"]],
        returns: "Void",
        description: "Adds an existing object into a group or array. Appends by default, or inserts at <code>index</code>.",
        code: { lang: "lua", source: `makeLuaSprite('star', 'star', 0, 0)
addToGroup('myGroup', 'star')` },
      }),
      API({
        id: "removeFromGroup",
        signature: "removeFromGroup(obj, index, ?dontDestroy)",
        params: [["obj","String","Group or array name"],["index","Int","Member index to remove"],["dontDestroy","Bool","Keep the object alive after removing (don't call <code>destroy()</code>)","default false"]],
        returns: "Void",
        description: "Removes the member at <code>index</code> from a group or array. By default the removed object is destroyed.",
        code: { lang: "lua", source: `removeFromGroup('notes', 0)` },
      }),
      {
        id: "instances",
        title: "Methods & runtime instances",
        kind: "prose",
        body: "Call methods on the state or any class, and create Haxe objects at runtime.",
      },
      API({
        id: "callMethod",
        signature: "callMethod(funcToRun, ?args)",
        params: [["funcToRun","String","Method name or dotted path on the current state"],["args","Array","Arguments to pass. Use <code>instanceArg</code> to pass object references","optional"]],
        returns: "Dynamic — the method's return value",
        description: "Calls a method on the current state via reflection.",
        code: { lang: "lua", source: `callMethod('moveCameraToOpponent')
callMethod('boyfriend.playAnim', {'hey', true})` },
      }),
      API({
        id: "callMethodFromClass",
        signature: "callMethodFromClass(className, funcToRun, ?args)",
        params: [["className","String","Full class path"],["funcToRun","String","Static method name or dotted path"],["args","Array","Arguments to pass","optional"]],
        returns: "Dynamic — the method's return value",
        description: "Calls a static method on a Haxe class via reflection.",
        code: { lang: "lua", source: `local p = callMethodFromClass('backend.Paths', 'image', {'logo'})` },
      }),
      API({
        id: "createInstance",
        signature: "createInstance(variableToSave, className, ?args)",
        params: [["variableToSave","String","Variable name to store the new object under (dots are stripped)"],["className","String","Full class path to instantiate"],["args","Array","Constructor arguments","optional"]],
        returns: "Bool — <code>true</code> if created",
        description: "Instantiates a Haxe class at runtime and stores it in script variables under <code>variableToSave</code>. Use <code>addInstance</code> to put it on screen.",
        code: { lang: "lua", source: `createInstance('ring', 'flixel.FlxSprite', {100, 200})
addInstance('ring')` },
      }),
      API({
        id: "addInstance",
        signature: "addInstance(objectName, ?inFront)",
        params: [["objectName","String","Name of a variable created with <code>createInstance</code>"],["inFront","Bool","Add in front of characters instead of behind them","default false"]],
        returns: "Void",
        description: "Adds a runtime-created instance to the current state. In PlayState, objects are inserted behind the characters unless <code>inFront</code> is true.",
        code: { lang: "lua", source: `addInstance('ring', true)` },
      }),
      API({
        id: "instanceArg",
        signature: "instanceArg(instanceName, ?className)",
        params: [["instanceName","String","Variable/object name to reference"],["className","String","Class to resolve the name on instead of the state","optional"]],
        returns: "String — a reference token understood by callMethod/createInstance",
        description: "Wraps an existing object so it can be passed as an argument to <code>callMethod</code>, <code>callMethodFromClass</code>, or <code>createInstance</code> (which otherwise only accept primitive args).",
        code: { lang: "lua", source: `callMethod('add', {instanceArg('mySprite')})` },
      }),
    ],
  },

  /* ---------------- SE: Sound Functions ---------------- */
  "se-sound": {
    title: "Sound Functions",
    category: "API Reference",
    subtitle: "Audio functions for playing and managing sounds.",
    sections: [
      {
        id: "intro",
        title: "Tags",
        kind: "prose",
        body: `Give a sound a <strong>tag</strong> when you play it and you can stop, pause, fade, seek, or re-pitch it later by that name. A tagged sound also fires the <code>onSoundFinished(tag)</code> callback when it ends. The fade and volume functions accept an empty tag (<code>''</code>) to target the main song music instead of a tagged sound.`,
      },
      {
        id: "playback",
        title: "Playback",
        kind: "prose",
        body: "Start and control sounds and music.",
      },
      API({
        id: "playMusic",
        signature: "playMusic(sound, ?volume, ?loop)",
        params: [["sound","String","Music file path under <code>music/</code> (no extension)"],["volume","Float","Start volume 0–1","default 1"],["loop","Bool","Loop the track","default false"]],
        returns: "Void",
        description: "Replaces the current music with a track from the <code>music/</code> folder.",
        code: { lang: "lua", source: `playMusic('breakfast', 1, true)` },
      }),
      API({
        id: "playSound",
        signature: "playSound(sound, ?volume, ?tag)",
        params: [["sound","String","Sound file path under <code>sounds/</code> (no extension)"],["volume","Float","Volume 0–1","default 1"],["tag","String","Tag to track the sound; fires <code>onSoundFinished(tag)</code> when it ends and lets you control it later","optional"]],
        returns: "Void",
        description: "Plays a sound effect. Without a tag it's fire-and-forget; with a tag it can be stopped, paused, faded, or queried. Re-using a tag stops the previous sound first.",
        code: { lang: "lua", source: `playSound('cancelMenu', 0.8)
playSound('confirm', 1, 'sfx_confirm')` },
      }),
      API({
        id: "stopSound",
        signature: "stopSound(tag)",
        params: [["tag","String","Tag of the sound to stop"]],
        returns: "Void",
        description: "Stops and frees a tagged sound.",
        code: { lang: "lua", source: `stopSound('sfx_confirm')` },
      }),
      API({
        id: "pauseSound",
        signature: "pauseSound(tag)",
        params: [["tag","String","Tag of the sound to pause"]],
        returns: "Void",
        description: "Pauses a tagged sound, keeping its position.",
        code: { lang: "lua", source: `pauseSound('sfx_confirm')` },
      }),
      API({
        id: "resumeSound",
        signature: "resumeSound(tag)",
        params: [["tag","String","Tag of the sound to resume"]],
        returns: "Void",
        description: "Resumes a paused tagged sound.",
        code: { lang: "lua", source: `resumeSound('sfx_confirm')` },
      }),
      API({
        id: "luaSoundExists",
        signature: "luaSoundExists(tag)",
        params: [["tag","String","Tag to check"]],
        returns: "Bool",
        description: "Returns <code>true</code> if a tagged sound with this name currently exists.",
        code: { lang: "lua", source: `if luaSoundExists('sfx_confirm') then
    stopSound('sfx_confirm')
end` },
      }),
      {
        id: "fades",
        title: "Fades",
        kind: "prose",
        body: "Fade a sound's volume over time. Pass <code>''</code> as the tag to fade the song's music.",
      },
      API({
        id: "soundFadeIn",
        signature: "soundFadeIn(tag, duration, ?fromValue, ?toValue)",
        params: [["tag","String","Tagged sound, or <code>''</code> for the main song music"],["duration","Float","Fade length in seconds"],["fromValue","Float","Starting volume","default 0"],["toValue","Float","Ending volume","default 1"]],
        returns: "Void",
        description: "Fades a sound's volume up over time.",
        code: { lang: "lua", source: `soundFadeIn('', 2)              -- fade the music in
soundFadeIn('sfx_confirm', 0.5)` },
      }),
      API({
        id: "soundFadeOut",
        signature: "soundFadeOut(tag, duration, ?toValue)",
        params: [["tag","String","Tagged sound, or <code>''</code> for the main song music"],["duration","Float","Fade length in seconds"],["toValue","Float","Ending volume","default 0"]],
        returns: "Void",
        description: "Fades a sound's volume down over time.",
        code: { lang: "lua", source: `soundFadeOut('', 1.5)` },
      }),
      API({
        id: "soundFadeCancel",
        signature: "soundFadeCancel(tag)",
        params: [["tag","String","Tagged sound, or <code>''</code> for the main song music"]],
        returns: "Void",
        description: "Cancels an in-progress fade, leaving the volume where it is.",
        code: { lang: "lua", source: `soundFadeCancel('sfx_confirm')` },
      }),
      {
        id: "vtp",
        title: "Volume, time & pitch",
        kind: "prose",
        body: "Read and write a sound's volume, playback position, and pitch. Time and pitch only apply to <em>tagged</em> sounds.",
      },
      API({
        id: "getSoundVolume",
        signature: "getSoundVolume(tag)",
        params: [["tag","String","Tagged sound, or <code>''</code> for the main song music"]],
        returns: "Float — volume 0–1",
        description: "Returns the current volume of a sound.",
        code: { lang: "lua", source: `local v = getSoundVolume('')` },
      }),
      API({
        id: "setSoundVolume",
        signature: "setSoundVolume(tag, value)",
        params: [["tag","String","Tagged sound, or <code>''</code> for the main song music"],["value","Float","New volume 0–1"]],
        returns: "Void",
        description: "Sets the volume of a sound.",
        code: { lang: "lua", source: `setSoundVolume('sfx_confirm', 0.5)` },
      }),
      API({
        id: "getSoundTime",
        signature: "getSoundTime(tag)",
        params: [["tag","String","Tag of the sound"]],
        returns: "Float — position in milliseconds (0 if not found)",
        description: "Returns the current playback position of a tagged sound, in milliseconds.",
        code: { lang: "lua", source: `local ms = getSoundTime('sfx_confirm')` },
      }),
      API({
        id: "setSoundTime",
        signature: "setSoundTime(tag, value)",
        params: [["tag","String","Tag of the sound"],["value","Float","Position in milliseconds"]],
        returns: "Void",
        description: "Seeks a tagged sound to a position in milliseconds.",
        code: { lang: "lua", source: `setSoundTime('sfx_confirm', 1000)` },
      }),
      API({
        id: "getSoundPitch",
        signature: "getSoundPitch(tag)",
        params: [["tag","String","Tag of the sound"]],
        returns: "Float — pitch multiplier (0 if not found)",
        description: "Returns the pitch multiplier of a tagged sound.",
        code: { lang: "lua", source: `local p = getSoundPitch('sfx_confirm')` },
      }),
      API({
        id: "setSoundPitch",
        signature: "setSoundPitch(tag, value, ?doPause)",
        params: [["tag","String","Tag of the sound"],["value","Float","Pitch multiplier (1 = normal)"],["doPause","Bool","Briefly pause and replay so the change applies cleanly","default false"]],
        returns: "Void",
        description: "Sets the pitch multiplier of a tagged sound.",
        code: { lang: "lua", source: `setSoundPitch('sfx_confirm', 1.5, true)` },
      }),
    ],
  },

  /* ---------------- SE: Camera Functions ---------------- */
  "se-camera": {
    title: "Camera Functions",
    category: "API Reference",
    subtitle: "Camera creation, effects, and control.",
    sections: [
      {
        id: "intro",
        title: "Camera names",
        kind: "prose",
        body: `Built-in cameras are <code>'game'</code> (the world), <code>'hud'</code> (the UI), and <code>'other'</code>. Create your own with <code>makeLuaCamera</code> and target it by tag. Assign a sprite to a camera with <a href="#" data-go="se-sprites">setObjectCamera</a> on the Sprite Functions page.`,
      },
      API({
        id: "makeLuaCamera",
        signature: "makeLuaCamera(tag, ?ddt)",
        params: [["tag","String","Name to store the new camera under"],["ddt","Bool","Use as a default draw target (objects added without an explicit camera render to it)","default false"]],
        returns: "Void",
        description: "Creates a new transparent camera and registers it under <code>tag</code>. Assign sprites to it with <code>setObjectCamera</code>.",
        code: { lang: "lua", source: `makeLuaCamera('overlay')
setObjectCamera('logo', 'overlay')` },
      }),
      API({
        id: "cameraShake",
        signature: "cameraShake(camera, intensity, duration)",
        params: [["camera","String","Camera name (<code>'game'</code>, <code>'hud'</code>, <code>'other'</code>) or a custom tag"],["intensity","Float","Shake strength as a fraction of the screen (e.g. <code>0.01</code>)"],["duration","Float","Shake length in seconds"]],
        returns: "Void",
        description: "Shakes a camera.",
        code: { lang: "lua", source: `cameraShake('game', 0.01, 0.3)` },
      }),
      API({
        id: "cameraFlash",
        signature: "cameraFlash(camera, color, duration, forced)",
        params: [["camera","String","Camera name or custom tag"],["color","String","Flash color hex (<code>'RRGGBB'</code>)"],["duration","Float","Flash length in seconds"],["forced","Bool","Restart the flash even if one is already playing"]],
        returns: "Void",
        description: "Flashes a camera with a solid color that fades out.",
        code: { lang: "lua", source: `cameraFlash('game', 'FFFFFF', 0.5, true)` },
      }),
      API({
        id: "cameraFade",
        signature: "cameraFade(camera, color, duration, forced)",
        params: [["camera","String","Camera name or custom tag"],["color","String","Target color hex (<code>'RRGGBB'</code>)"],["duration","Float","Fade length in seconds"],["forced","Bool","Restart the fade even if one is already playing"]],
        returns: "Void",
        description: "Fades a camera to a solid color and holds it there.",
        code: { lang: "lua", source: `cameraFade('game', '000000', 1, true)` },
      }),
      {
        id: "mouse",
        title: "Mouse position",
        kind: "prose",
        body: `Read the mouse position within a camera's space with <a href="#" data-go="se-input">getMouseX</a> and <a href="#" data-go="se-input">getMouseY</a>, documented on the Input Functions page.`,
      },
      API({
        id: "cameraSetTarget",
        signature: "cameraSetTarget(target)",
        params: [["target","String","<code>'dad'</code> to follow the opponent; anything else follows the player"]],
        returns: "Bool — <code>true</code> if now following the opponent",
        description: "Snaps the gameplay camera to follow a character.",
        code: { lang: "lua", source: `cameraSetTarget('dad')` },
      }),
    ],
  },

  /* ---------------- SE: Score & Health ---------------- */
  "se-score": {
    title: "Score & Health",
    category: "API Reference",
    subtitle: "Score, misses, hits, health, and rating functions.",
    sections: [
      {
        id: "score",
        title: "Score, misses & hits",
        kind: "prose",
        body: "Each setter and adder recalculates the rating (accuracy and letter grade) afterwards. These mirror the read-only <code>score</code>, <code>misses</code>, <code>hits</code> globals.",
      },
      API({
        id: "getScore",
        signature: "getScore()",
        params: [],
        returns: "Int",
        description: "Returns the current song score.",
        code: { lang: "lua", source: `local s = getScore()` },
      }),
      API({
        id: "setScore",
        signature: "setScore(value)",
        params: [["value","Int","New score"]],
        returns: "Void",
        description: "Sets the song score and recalculates the rating.",
        code: { lang: "lua", source: `setScore(0)` },
      }),
      API({
        id: "addScore",
        signature: "addScore(value)",
        params: [["value","Int","Amount to add (may be negative)"]],
        returns: "Void",
        description: "Adds to the song score and recalculates the rating.",
        code: { lang: "lua", source: `addScore(350)` },
      }),
      API({
        id: "getMisses",
        signature: "getMisses()",
        params: [],
        returns: "Int",
        description: "Returns the current miss count.",
        code: { lang: "lua", source: `local m = getMisses()` },
      }),
      API({
        id: "setMisses",
        signature: "setMisses(value)",
        params: [["value","Int","New miss count"]],
        returns: "Void",
        description: "Sets the miss count and recalculates the rating.",
        code: { lang: "lua", source: `setMisses(0)` },
      }),
      API({
        id: "addMisses",
        signature: "addMisses(value)",
        params: [["value","Int","Amount to add"]],
        returns: "Void",
        description: "Adds to the miss count and recalculates the rating.",
        code: { lang: "lua", source: `addMisses(1)` },
      }),
      API({
        id: "getHits",
        signature: "getHits()",
        params: [],
        returns: "Int",
        description: "Returns the current hit count.",
        code: { lang: "lua", source: `local h = getHits()` },
      }),
      API({
        id: "setHits",
        signature: "setHits(value)",
        params: [["value","Int","New hit count"]],
        returns: "Void",
        description: "Sets the hit count and recalculates the rating.",
        code: { lang: "lua", source: `setHits(0)` },
      }),
      API({
        id: "addHits",
        signature: "addHits(value)",
        params: [["value","Int","Amount to add"]],
        returns: "Void",
        description: "Adds to the hit count and recalculates the rating.",
        code: { lang: "lua", source: `addHits(1)` },
      }),
      {
        id: "health",
        title: "Health",
        kind: "prose",
        body: "Health ranges from <code>0</code> (death) to <code>2</code> (full) by default.",
      },
      API({
        id: "getHealth",
        signature: "getHealth()",
        params: [],
        returns: "Float",
        description: "Returns the current health.",
        code: { lang: "lua", source: `local hp = getHealth()` },
      }),
      API({
        id: "setHealth",
        signature: "setHealth(value)",
        params: [["value","Float","New health (0–2)"]],
        returns: "Void",
        description: "Sets the player's health directly.",
        code: { lang: "lua", source: `setHealth(2)` },
      }),
      API({
        id: "addHealth",
        signature: "addHealth(value)",
        params: [["value","Float","Amount to add (may be negative)"]],
        returns: "Void",
        description: "Adds to the player's health.",
        code: { lang: "lua", source: `addHealth(-0.5)` },
      }),
      {
        id: "rating",
        title: "Rating",
        kind: "prose",
        body: "Override the rating values shown after recalculation. The read-only globals are <code>rating</code>, <code>ratingName</code>, and <code>ratingFC</code>.",
      },
      API({
        id: "setRatingPercent",
        signature: "setRatingPercent(value)",
        params: [["value","Float","Accuracy as a fraction 0–1"]],
        returns: "Void",
        description: "Sets the rating percentage (accuracy).",
        code: { lang: "lua", source: `setRatingPercent(1)` },
      }),
      API({
        id: "setRatingName",
        signature: "setRatingName(value)",
        params: [["value","String","Rating label (e.g. <code>'Sick!'</code>, <code>'Good'</code>)"]],
        returns: "Void",
        description: "Sets the rating name text.",
        code: { lang: "lua", source: `setRatingName('Perfect!!')` },
      }),
      API({
        id: "setRatingFC",
        signature: "setRatingFC(value)",
        params: [["value","String","Full-combo label (e.g. <code>'FC'</code>, <code>'SDCB'</code>)"]],
        returns: "Void",
        description: "Sets the full-combo indicator text.",
        code: { lang: "lua", source: `setRatingFC('FC')` },
      }),
      {
        id: "bars",
        title: "Bar colors",
        kind: "prose",
        body: `Recolor the health and time bars with <a href="#" data-go="se-playstate">setHealthBarColors</a> and <a href="#" data-go="se-playstate">setTimeBarColors</a>, documented on the PlayState Functions page.`,
      },
    ],
  },

  /* ---------------- SE: Character Functions ---------------- */
  "se-character": {
    title: "Character Functions",
    category: "API Reference",
    subtitle: "Control character groups, positions, and animations.",
    sections: [
      {
        id: "intro",
        title: "Selecting a character",
        kind: "prose",
        body: `These functions take a character selector string: <code>'dad'</code> / <code>'opponent'</code> for the opponent, <code>'gf'</code> / <code>'girlfriend'</code> for the spectator, and anything else (e.g. <code>'boyfriend'</code>) for the player. To play a named animation on a character, use <a href="#" data-go="se-animation">playAnim('boyfriend', anim)</a>; to follow one with the camera, use <a href="#" data-go="se-camera">cameraSetTarget</a>.`,
      },
      API({
        id: "characterDance",
        signature: "characterDance(character)",
        params: [["character","String","<code>'dad'</code>, <code>'gf'</code>, or anything else for the player"]],
        returns: "Void",
        description: "Plays a character's idle/dance animation (respects left/right dancing characters).",
        code: { lang: "lua", source: `characterDance('gf')` },
      }),
      API({
        id: "getCharacterX",
        signature: "getCharacterX(type)",
        params: [["type","String","Character selector: <code>'dad'</code>/<code>'opponent'</code>, <code>'gf'</code>/<code>'girlfriend'</code>, or anything else for the player"]],
        returns: "Float",
        description: "Returns the X position of a character's group.",
        code: { lang: "lua", source: `local x = getCharacterX('dad')` },
      }),
      API({
        id: "setCharacterX",
        signature: "setCharacterX(type, value)",
        params: [["type","String","Character selector (see <code>getCharacterX</code>)"],["value","Float","New X position of the group"]],
        returns: "Void",
        description: "Sets the X position of a character's group.",
        code: { lang: "lua", source: `setCharacterX('dad', 800)` },
      }),
      API({
        id: "getCharacterY",
        signature: "getCharacterY(type)",
        params: [["type","String","Character selector (see <code>getCharacterX</code>)"]],
        returns: "Float",
        description: "Returns the Y position of a character's group.",
        code: { lang: "lua", source: `local y = getCharacterY('dad')` },
      }),
      API({
        id: "setCharacterY",
        signature: "setCharacterY(type, value)",
        params: [["type","String","Character selector (see <code>getCharacterX</code>)"],["value","Float","New Y position of the group"]],
        returns: "Void",
        description: "Sets the Y position of a character's group.",
        code: { lang: "lua", source: `setCharacterY('dad', 200)` },
      }),
    ],
  },

  /* ---------------- SE: Shader Functions ---------------- */
  "se-shader": {
    title: "Shader Functions",
    category: "API Reference",
    subtitle: "Runtime GLSL shader management. Requires shaders to be enabled in the player's options.",
    sections: [
      {
        id: "intro",
        title: "Overview",
        kind: "prose",
        body: `Drop a <code>name.frag</code> and/or <code>name.vert</code> into a <code>shaders/</code> folder, load it with <code>initLuaShader</code>, then apply it to a sprite (<code>setSpriteShader</code>) or a whole camera (<code>addShaderToCam</code>). Uniform values are read and written with the typed <code>get/setShader*</code> functions.

When targeting a sprite, pass its tag as <code>obj</code>. When targeting a camera shader, pass the <code>index</code> key you gave it in <code>addShaderToCam</code>. All of this is skipped if the player has shaders turned off.`,
      },
      API({
        id: "initLuaShader",
        signature: "initLuaShader(name)",
        params: [["name","String","Shader name — looks for <code>name.frag</code> and/or <code>name.vert</code> in a <code>shaders/</code> folder"]],
        returns: "Bool — <code>true</code> if found and loaded",
        description: "Loads a runtime GLSL shader from a <code>shaders/</code> folder so it can be applied to sprites or cameras. Returns <code>false</code> if shaders are disabled in options or the files are missing.",
        code: { lang: "lua", source: `initLuaShader('grayscale')` },
      }),
      {
        id: "sprites",
        title: "Sprite shaders",
        kind: "prose",
        body: "Apply or clear a shader on a single sprite.",
      },
      API({
        id: "setSpriteShader",
        signature: "setSpriteShader(obj, shader)",
        params: [["obj","String","Sprite tag (dotted paths allowed)"],["shader","String","Shader name; auto-loaded if not already initialised"]],
        returns: "Bool",
        description: "Applies a loaded shader to a sprite.",
        code: { lang: "lua", source: `initLuaShader('grayscale')
setSpriteShader('logo', 'grayscale')` },
      }),
      API({
        id: "removeSpriteShader",
        signature: "removeSpriteShader(obj)",
        params: [["obj","String","Sprite tag"]],
        returns: "Bool",
        description: "Removes any shader from a sprite.",
        code: { lang: "lua", source: `removeSpriteShader('logo')` },
      }),
      {
        id: "cameras",
        title: "Camera shaders",
        kind: "prose",
        body: "Apply shaders to an entire camera as screen filters. The <code>index</code> key identifies the filter for removal and uniform access.",
      },
      API({
        id: "addShaderToCam",
        signature: "addShaderToCam(cam, shader, ?index)",
        params: [["cam","String","Camera name (<code>'game'</code>, <code>'hud'</code>, <code>'other'</code>) or <code>'global'</code> for the whole game window"],["shader","String","Shader name; auto-loaded if needed"],["index","String","Key to store this filter under, used later by <code>removeCamShader</code> and the uniform functions. Defaults to the shader name","optional"]],
        returns: "Bool",
        description: "Applies a shader to an entire camera as a screen filter.",
        code: { lang: "lua", source: `addShaderToCam('game', 'grayscale')` },
      }),
      API({
        id: "removeCamShader",
        signature: "removeCamShader(cam, shader)",
        params: [["cam","String","Camera name or <code>'global'</code>"],["shader","String","The <code>index</code> key the filter was added under"]],
        returns: "Bool",
        description: "Removes a single shader filter from a camera.",
        code: { lang: "lua", source: `removeCamShader('game', 'grayscale')` },
      }),
      API({
        id: "clearCamShaders",
        signature: "clearCamShaders(cam)",
        params: [["cam","String","Camera name or <code>'global'</code>"]],
        returns: "Void",
        description: "Removes all shader filters from a camera.",
        code: { lang: "lua", source: `clearCamShaders('game')` },
      }),
      {
        id: "read-uniforms",
        title: "Read uniforms",
        kind: "prose",
        body: "Read a shader's uniform (variable) values. <code>obj</code> is a sprite tag, or a camera-shader <code>index</code> key.",
      },
      API({
        id: "getShaderBool",
        signature: "getShaderBool(obj, prop)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform (variable) name in the shader"]],
        returns: "Bool",
        description: "Reads a <code>bool</code> uniform.",
        code: { lang: "lua", source: `local on = getShaderBool('logo', 'enabled')` },
      }),
      API({
        id: "getShaderInt",
        signature: "getShaderInt(obj, prop)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"]],
        returns: "Int",
        description: "Reads an <code>int</code> uniform.",
        code: { lang: "lua", source: `local steps = getShaderInt('logo', 'steps')` },
      }),
      API({
        id: "getShaderFloat",
        signature: "getShaderFloat(obj, prop)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"]],
        returns: "Float",
        description: "Reads a <code>float</code> uniform.",
        code: { lang: "lua", source: `local amt = getShaderFloat('logo', 'amount')` },
      }),
      API({
        id: "getShaderBoolArray",
        signature: "getShaderBoolArray(obj, prop)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"]],
        returns: "Array&lt;Bool&gt;",
        description: "Reads a <code>bool[]</code> uniform.",
        code: { lang: "lua", source: `local flags = getShaderBoolArray('logo', 'flags')` },
      }),
      API({
        id: "getShaderIntArray",
        signature: "getShaderIntArray(obj, prop)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"]],
        returns: "Array&lt;Int&gt;",
        description: "Reads an <code>int[]</code> uniform.",
        code: { lang: "lua", source: `local arr = getShaderIntArray('logo', 'offsets')` },
      }),
      API({
        id: "getShaderFloatArray",
        signature: "getShaderFloatArray(obj, prop)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"]],
        returns: "Array&lt;Float&gt;",
        description: "Reads a <code>float[]</code> uniform.",
        code: { lang: "lua", source: `local rgb = getShaderFloatArray('logo', 'tint')` },
      }),
      {
        id: "write-uniforms",
        title: "Write uniforms",
        kind: "prose",
        body: "Set a shader's uniform values. Array setters take a Lua table of values.",
      },
      API({
        id: "setShaderBool",
        signature: "setShaderBool(obj, prop, value)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"],["value","Bool","New value"]],
        returns: "Bool",
        description: "Sets a <code>bool</code> uniform.",
        code: { lang: "lua", source: `setShaderBool('logo', 'enabled', true)` },
      }),
      API({
        id: "setShaderInt",
        signature: "setShaderInt(obj, prop, value)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"],["value","Int","New value"]],
        returns: "Bool",
        description: "Sets an <code>int</code> uniform.",
        code: { lang: "lua", source: `setShaderInt('logo', 'steps', 8)` },
      }),
      API({
        id: "setShaderFloat",
        signature: "setShaderFloat(obj, prop, value)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"],["value","Float","New value"]],
        returns: "Bool",
        description: "Sets a <code>float</code> uniform.",
        code: { lang: "lua", source: `setShaderFloat('logo', 'amount', 0.5)` },
      }),
      API({
        id: "setShaderBoolArray",
        signature: "setShaderBoolArray(obj, prop, values)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"],["values","Table","Array of bools"]],
        returns: "Bool",
        description: "Sets a <code>bool[]</code> uniform.",
        code: { lang: "lua", source: `setShaderBoolArray('logo', 'flags', {true, false, true})` },
      }),
      API({
        id: "setShaderIntArray",
        signature: "setShaderIntArray(obj, prop, values)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"],["values","Table","Array of ints"]],
        returns: "Bool",
        description: "Sets an <code>int[]</code> uniform.",
        code: { lang: "lua", source: `setShaderIntArray('logo', 'offsets', {0, 2, 4})` },
      }),
      API({
        id: "setShaderFloatArray",
        signature: "setShaderFloatArray(obj, prop, values)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name"],["values","Table","Array of floats"]],
        returns: "Bool",
        description: "Sets a <code>float[]</code> uniform.",
        code: { lang: "lua", source: `setShaderFloatArray('logo', 'tint', {1.0, 0.4, 0.6})` },
      }),
      API({
        id: "setShaderSampler2D",
        signature: "setShaderSampler2D(obj, prop, bitmapdataPath)",
        params: [["obj","String","Sprite tag, or a camera-shader <code>index</code> key"],["prop","String","Uniform name (a <code>sampler2D</code>)"],["bitmapdataPath","String","Image path (resolved through <code>Paths.image</code>) to bind as a texture"]],
        returns: "Bool",
        description: "Binds an image as a texture (<code>sampler2D</code>) uniform.",
        code: { lang: "lua", source: `setShaderSampler2D('logo', 'noiseTex', 'shaderTextures/noise')` },
      }),
    ],
  },

  /* ---------------- SE: Script Management ---------------- */

  /* ---------------- SE: Script Management ---------------- */
  "se-script": {
    title: "Script Management",
    category: "API Reference",
    subtitle: "Functions for managing other scripts, inter-script communication, and global variables.",
    sections: [
      {
        id: "loading",
        title: "Loading & discovery",
        kind: "prose",
        body: "Scripts are referenced by their file path. Load and unload them at runtime, or check what's running.",
      },
      API({
        id: "getRunningScripts",
        signature: "getRunningScripts()",
        params: [],
        returns: "Array&lt;String&gt; — paths of all running Lua scripts",
        description: "Returns a table of the file paths of every currently running Lua script.",
        code: { lang: "lua", source: `for i, path in ipairs(getRunningScripts()) do
    print(path)
end` },
      }),
      API({
        id: "isRunning",
        signature: "isRunning(luaFile)",
        params: [["luaFile","String","Script path to check"]],
        returns: "Bool",
        description: "Returns <code>true</code> if the named Lua script is currently running.",
        code: { lang: "lua", source: `if isRunning('scripts/rain') then
    print('already running')
end` },
      }),
      API({
        id: "addLuaScript",
        signature: "addLuaScript(luaFile, ?ignoreAlreadyRunning)",
        params: [["luaFile","String","Path to a <code>.lua</code> script"],["ignoreAlreadyRunning","Bool","Load another copy even if it's already running","default false"]],
        returns: "Void",
        description: "Loads and starts another Lua script at runtime.",
        code: { lang: "lua", source: `addLuaScript('scripts/extra/confetti')` },
      }),
      API({
        id: "removeLuaScript",
        signature: "removeLuaScript(luaFile)",
        params: [["luaFile","String","Path of the running script to stop"]],
        returns: "Void",
        description: "Stops and removes a running Lua script.",
        code: { lang: "lua", source: `removeLuaScript('scripts/extra/confetti')` },
      }),
      API({
        id: "close",
        signature: "close()",
        params: [],
        returns: "Bool",
        description: "Stops the current script. No further callbacks fire after this returns.",
        code: { lang: "lua", source: `if not isStoryMode then close() end` },
      }),
      {
        id: "comms",
        title: "Talking to other scripts",
        kind: "prose",
        body: "Call functions and read/write globals on a specific script by path.",
      },
      API({
        id: "callScript",
        signature: "callScript(luaFile, funcName, ?args)",
        params: [["luaFile","String","Target script path"],["funcName","String","Function name to call in that script"],["args","Array","Arguments to pass","optional"]],
        returns: "Void",
        description: "Calls a global function defined in another running Lua script.",
        code: { lang: "lua", source: `callScript('scripts/hud', 'flashScore', {500})` },
      }),
      API({
        id: "getGlobalFromScript",
        signature: "getGlobalFromScript(luaFile, global)",
        params: [["luaFile","String","Target script path"],["global","String","Global variable name to read"]],
        returns: "Dynamic",
        description: "Reads a global variable from another running Lua script.",
        code: { lang: "lua", source: `local n = getGlobalFromScript('scripts/hud', 'comboCount')` },
      }),
      API({
        id: "setGlobalFromScript",
        signature: "setGlobalFromScript(luaFile, global, val)",
        params: [["luaFile","String","Target script path"],["global","String","Global variable name to write"],["val","Dynamic","New value"]],
        returns: "Void",
        description: "Writes a global variable in another running Lua script.",
        code: { lang: "lua", source: `setGlobalFromScript('scripts/hud', 'comboCount', 0)` },
      }),
      {
        id: "shared-vars",
        title: "Shared variables",
        kind: "prose",
        body: "A simple key/value store shared by every Lua and HScript on the current state.",
      },
      API({
        id: "setVar",
        signature: "setVar(varName, value)",
        params: [["varName","String","Variable name"],["value","Dynamic","Value to store"]],
        returns: "Dynamic — the stored value",
        description: "Stores a value in the shared variables map, readable from any script on the current state with <code>getVar</code>.",
        code: { lang: "lua", source: `setVar('phase', 2)` },
      }),
      API({
        id: "getVar",
        signature: "getVar(name)",
        params: [["name","String","Variable name"]],
        returns: "Dynamic",
        description: "Reads a value stored with <code>setVar</code> (returns nil if unset).",
        code: { lang: "lua", source: `local phase = getVar('phase')` },
      }),
      {
        id: "broadcast",
        title: "Broadcasting",
        kind: "prose",
        body: "Set a global or call a function across many scripts at once. The <code>...Scripts</code> variants hit both Lua and HScript; the <code>...Luas</code> and <code>...HScript</code> variants target one kind.",
      },
      API({
        id: "setOnScripts",
        signature: "setOnScripts(varName, value, ?ignoreSelf, ?exclusions)",
        params: [["varName","String","Global variable name to set"],["value","Dynamic","Value to assign"],["ignoreSelf","Bool","Skip the calling script","default false"],["exclusions","Array","Script paths to skip","optional"]],
        returns: "Void",
        description: "Sets a global variable on every running Lua <em>and</em> HScript.",
        code: { lang: "lua", source: `setOnScripts('bgColor', '00FF99')` },
      }),
      API({
        id: "setOnLuas",
        signature: "setOnLuas(varName, value, ?ignoreSelf, ?exclusions)",
        params: [["varName","String","Global variable name to set"],["value","Dynamic","Value to assign"],["ignoreSelf","Bool","Skip the calling script","default false"],["exclusions","Array","Script paths to skip","optional"]],
        returns: "Void",
        description: "Sets a global variable on every running Lua script only.",
        code: { lang: "lua", source: `setOnLuas('bgColor', '00FF99')` },
      }),
      API({
        id: "setOnHScript",
        signature: "setOnHScript(varName, value, ?ignoreSelf, ?exclusions)",
        params: [["varName","String","Global variable name to set"],["value","Dynamic","Value to assign"],["ignoreSelf","Bool","Skip the calling script","default false"],["exclusions","Array","Script paths to skip","optional"]],
        returns: "Void",
        description: "Sets a global variable on every running HScript only.",
        code: { lang: "lua", source: `setOnHScript('bgColor', '00FF99')` },
      }),
      API({
        id: "callOnScripts",
        signature: "callOnScripts(funcName, ?args, ?ignoreStops, ?ignoreSelf, ?excludeScripts, ?excludeValues)",
        params: [["funcName","String","Function name to call"],["args","Array","Arguments to pass","optional"],["ignoreStops","Bool","Keep calling even if a script returns <code>Function_Stop</code>","default false"],["ignoreSelf","Bool","Skip the calling script","default true"],["excludeScripts","Array","Script paths to skip","optional"],["excludeValues","Array","Return values to ignore","optional"]],
        returns: "Bool",
        description: "Calls a function on every running Lua <em>and</em> HScript.",
        code: { lang: "lua", source: `callOnScripts('onCustomBeat', {curBeat})` },
      }),
      API({
        id: "callOnLuas",
        signature: "callOnLuas(funcName, ?args, ?ignoreStops, ?ignoreSelf, ?excludeScripts, ?excludeValues)",
        params: [["funcName","String","Function name to call"],["args","Array","Arguments to pass","optional"],["ignoreStops","Bool","Keep calling even if a script returns <code>Function_Stop</code>","default false"],["ignoreSelf","Bool","Skip the calling script","default true"],["excludeScripts","Array","Script paths to skip","optional"],["excludeValues","Array","Return values to ignore","optional"]],
        returns: "Bool",
        description: "Calls a function on every running Lua script only.",
        code: { lang: "lua", source: `callOnLuas('onCustomBeat', {curBeat})` },
      }),
      API({
        id: "callOnHScript",
        signature: "callOnHScript(funcName, ?args, ?ignoreStops, ?ignoreSelf, ?excludeScripts, ?excludeValues)",
        params: [["funcName","String","Function name to call"],["args","Array","Arguments to pass","optional"],["ignoreStops","Bool","Keep calling even if a script returns <code>Function_Stop</code>","default false"],["ignoreSelf","Bool","Skip the calling script","default true"],["excludeScripts","Array","Script paths to skip","optional"],["excludeValues","Array","Return values to ignore","optional"]],
        returns: "Bool",
        description: "Calls a function on every running HScript only.",
        code: { lang: "lua", source: `callOnHScript('onCustomBeat', {curBeat})` },
      }),
      {
        id: "states",
        title: "Scripted states",
        kind: "prose",
        body: `Switch to a scripted state or open a scripted substate with <a href="#" data-go="se-substate">switchScriptedState</a>, <a href="#" data-go="se-substate">openScriptedSubState</a>, and <a href="#" data-go="se-substate">closeScriptedSubState</a> — documented on the Scripted State/Substate page.`,
      },
    ],
  },

  /* ---------------- SE: HScript Integration ---------------- */
  "se-hscript": {
    title: "HScript Integration",
    category: "API Reference",
    subtitle: "Run Haxe code directly from Lua. Requires HScript support compiled in.",
    sections: [
      {
        id: "intro",
        title: "Overview",
        kind: "prose",
        body: `HScript lets a Lua script run real Haxe code — useful for things the Lua API doesn't expose. <code>runHaxeCode</code> compiles a snippet in an interpreter that persists for the script, so functions and variables defined in one call are reusable by <code>runHaxeFunction</code> later. Inside Haxe code, <code>game</code> is the PlayState and most engine classes are available; import extras with <code>addHaxeLibrary</code>.

To broadcast variables or calls to other HScripts, use <a href="#" data-go="se-script">setOnHScript</a> and <a href="#" data-go="se-script">callOnHScript</a> on the Script Management page.`,
      },
      API({
        id: "runHaxeCode",
        signature: "runHaxeCode(codeToRun, ?varsToBring, ?funcToRun, ?funcArgs)",
        params: [["codeToRun","String","Haxe source code to compile and execute"],["varsToBring","Table","Extra variables to inject into the script's scope by name","optional"],["funcToRun","String","Name of a function defined in the code to call right after running it","optional"],["funcArgs","Array","Arguments for <code>funcToRun</code>","optional"]],
        returns: "Dynamic — only Bool/Int/Float/String/Array returns are passed back to Lua",
        description: "Compiles and runs arbitrary Haxe code in this script's HScript interpreter.",
        code: { lang: "lua", source: `runHaxeCode([[
    game.camGame.zoom += 0.1;
]])` },
      }),
      API({
        id: "runHaxeFunction",
        signature: "runHaxeFunction(funcToRun, ?funcArgs)",
        params: [["funcToRun","String","Name of a function previously defined via <code>runHaxeCode</code>"],["funcArgs","Array","Arguments to pass","optional"]],
        returns: "Dynamic — the function's return value",
        description: "Calls a function that was defined in an earlier <code>runHaxeCode</code> block.",
        code: { lang: "lua", source: `runHaxeCode([[
    function addZoom(amount:Float) {
        game.camGame.zoom += amount;
    }
]])
runHaxeFunction('addZoom', {0.05})` },
      }),
      API({
        id: "addHaxeLibrary",
        signature: "addHaxeLibrary(libName, ?libPackage)",
        params: [["libName","String","Class or enum name to import"],["libPackage","String","Package the class lives in, without the trailing dot","default ''"]],
        returns: "Void",
        description: "Imports a Haxe class or enum so it can be referenced by name inside <code>runHaxeCode</code>.",
        code: { lang: "lua", source: `addHaxeLibrary('FlxBar', 'flixel.ui')
runHaxeCode([[ trace(FlxBar); ]])` },
      }),
      {
        id: "files",
        title: "Script files",
        kind: "prose",
        body: "Load and unload standalone <code>.hx</code> script files at runtime.",
      },
      API({
        id: "addHScript",
        signature: "addHScript(hscriptFile, ?ignoreAlreadyRunning)",
        params: [["hscriptFile","String","Path to a <code>.hx</code> script file (extension optional)"],["ignoreAlreadyRunning","Bool","Load another copy even if this file is already running","default false"]],
        returns: "Void",
        description: "Loads and runs a standalone Haxe script file, the same way the engine loads its automatic scripts.",
        code: { lang: "lua", source: `addHScript('scripts/myHaxeScript')` },
      }),
      API({
        id: "removeHScript",
        signature: "removeHScript(hscriptFile)",
        params: [["hscriptFile","String","Path of the running HScript to stop"]],
        returns: "Void",
        description: "Stops and removes a running HScript that was loaded with <code>addHScript</code>.",
        code: { lang: "lua", source: `removeHScript('scripts/myHaxeScript')` },
      }),
    ],
  },

  /* ---------------- SE: Substate Functions ---------------- */
  "se-substate": {
    title: "Scripted State/Substate Functions",
    category: "API Reference",
    subtitle: "Functions for switching to a ScriptedState or opening/closing a ScriptedSubState, loading the given Lua/HScript file.",
    sections: [
      {
        id: "intro",
        title: "Overview",
        kind: "prose",
        body: "A <strong>ScriptedState</strong> replaces the whole screen; a <strong>ScriptedSubState</strong> opens on top of the current one (handy for a pause menu). Both are driven by a Lua or HScript file you point them at, and you can forward a table of <code>args</code> to that file's scripts.",
      },
      API({
        id: "switchScriptedState",
        signature: "switchScriptedState(state, ?args)",
        params: [["state","String","Path to a Lua/HScript file that drives the new state"],["args","Array","Values forwarded to the new state's scripts","optional"]],
        returns: "Void",
        description: "Switches the game to a <code>ScriptedState</code> backed by the given script file.",
        code: { lang: "lua", source: `switchScriptedState('states/credits')` },
      }),
      API({
        id: "openScriptedSubState",
        signature: "openScriptedSubState(substate, ?args)",
        params: [["substate","String","Path to a Lua/HScript file that drives the substate"],["args","Array","Values forwarded to the substate's scripts","optional"]],
        returns: "Void",
        description: "Opens a <code>ScriptedSubState</code> on top of the current state.",
        code: { lang: "lua", source: `openScriptedSubState('substates/pause')` },
      }),
      API({
        id: "closeScriptedSubState",
        signature: "closeScriptedSubState()",
        params: [],
        returns: "Void",
        description: "Closes the currently open ScriptedSubState.",
        code: { lang: "lua", source: `closeScriptedSubState()` },
      }),
      {
        id: "example",
        title: "Worked example",
        kind: "prose",
        body: `<h4>Examples</h4>
<div class="code-block" style="margin:0">
<div class="code-head"><span class="lang-dot" style="background:var(--violet)"></span><span class="filename">TitleState.lua</span></div>
<div class="code-body" style="grid-template-columns:1fr">
<pre class="code-pre" style="border:0;padding:12px 16px;margin:0;white-space:pre;overflow-x:auto;background:var(--bg-code);color:var(--text);font-family:var(--font-mono);font-size:13px;line-height:1.65;">function onCreatePost()
    switchScriptedState("my/state.hx")
end</pre>
</div>
</div>
<div class="code-block" style="margin:8px 0 0">
<div class="code-head"><span class="lang-dot" style="background:var(--violet)"></span><span class="filename">my/state.hx</span></div>
<div class="code-body" style="grid-template-columns:1fr">
<pre class="code-pre" style="border:0;padding:12px 16px;margin:0;white-space:pre;overflow-x:auto;background:var(--bg-code);color:var(--text);font-family:var(--font-mono);font-size:13px;line-height:1.65;">function onUpdate(elapsed)
{
    if (keyJustPressed('P'))
    {
        openScriptedSubState("pause.lua");
    }
}</pre>
</div>
</div>
<div class="code-block" style="margin:8px 0 0">
<div class="code-head"><span class="lang-dot" style="background:var(--violet)"></span><span class="filename">pause.lua</span></div>
<div class="code-body" style="grid-template-columns:1fr">
<pre class="code-pre" style="border:0;padding:12px 16px;margin:0;white-space:pre;overflow-x:auto;background:var(--bg-code);color:var(--text);font-family:var(--font-mono);font-size:13px;line-height:1.65;">function onUpdate(elapsed)
    if keyJustPressed('ESCAPE') then
        closeScriptedSubState()
    end
end</pre>
</div>
</div>`,
      },
    ],
  },

  /* ---------------- SE: Save Data ---------------- */
  "se-save": {
    title: "Save Data",
    category: "API Reference",
    subtitle: "Persistent data storage using FlxSave.",
    sections: [
      {
        id: "intro",
        title: "Save slots",
        kind: "prose",
        body: "Call <code>initSaveData</code> once to bind a named slot, read and write fields with <code>get/setDataFromSave</code>, then <code>flushSaveData</code> to write it to disk. Changes only persist after a flush.",
      },
      API({
        id: "initSaveData",
        signature: "initSaveData(name, ?folder)",
        params: [["name","String","Save slot name (the file the data is bound to)"],["folder","String","Subfolder under the save path","default 'psychenginemods'"]],
        returns: "Void",
        description: "Creates (binds) a save slot so you can read and write fields on it. Call once before using the other save functions.",
        code: { lang: "lua", source: `initSaveData('myMod')` },
      }),
      API({
        id: "getDataFromSave",
        signature: "getDataFromSave(name, field, ?defaultValue)",
        params: [["name","String","Save slot name"],["field","String","Field name to read"],["defaultValue","Dynamic","Value returned if the field is missing","optional"]],
        returns: "Dynamic",
        description: "Reads a field from a save slot, returning <code>defaultValue</code> if it isn't set.",
        code: { lang: "lua", source: `local hi = getDataFromSave('myMod', 'highScore', 0)` },
      }),
      API({
        id: "setDataFromSave",
        signature: "setDataFromSave(name, field, value)",
        params: [["name","String","Save slot name"],["field","String","Field name to write"],["value","Dynamic","Value to store"]],
        returns: "Void",
        description: "Writes a field to a save slot in memory. Call <code>flushSaveData</code> to persist it.",
        code: { lang: "lua", source: `setDataFromSave('myMod', 'highScore', 9000)
flushSaveData('myMod')` },
      }),
      API({
        id: "flushSaveData",
        signature: "flushSaveData(name)",
        params: [["name","String","Save slot name"]],
        returns: "Void",
        description: "Writes the save slot to disk. Until you flush, changes only live in memory.",
        code: { lang: "lua", source: `flushSaveData('myMod')` },
      }),
      API({
        id: "eraseSaveData",
        signature: "eraseSaveData(name)",
        params: [["name","String","Save slot name"]],
        returns: "Void",
        description: "Erases all data in a save slot.",
        code: { lang: "lua", source: `eraseSaveData('myMod')` },
      }),
      {
        id: "mod-settings",
        title: "Mod settings",
        kind: "prose",
        body: "Read and write the player's values for the options defined in the mod's <code>data/settings.json</code>. When <code>modName</code> is omitted, the folder of the currently running packed mod is used.",
      },
      API({
        id: "getModSetting",
        signature: "getModSetting(saveTag, ?modName)",
        params: [["saveTag","String","Setting name as defined in <code>data/settings.json</code>"],["modName","String","Mod folder to read from; defaults to the current packed mod","optional"]],
        returns: "Dynamic",
        description: "Returns the player's value for one of the mod's settings.",
        code: { lang: "lua", source: `local hard = getModSetting('hardMode')` },
      }),
      API({
        id: "setModSetting",
        signature: "setModSetting(saveTag, value, ?modName)",
        params: [["saveTag","String","Setting name from <code>data/settings.json</code>"],["value","Dynamic","New value"],["modName","String","Mod folder to write to; defaults to the current packed mod","optional"]],
        returns: "Void",
        description: "Sets the value of one of the mod's settings.",
        code: { lang: "lua", source: `setModSetting('hardMode', true)` },
      }),
    ],
  },

  /* ---------------- SE: File I/O ---------------- */
  "se-file": {
    title: "File I/O",
    category: "API Reference",
    subtitle: "Read and write files from scripts.",
    sections: [
      {
        id: "intro",
        title: "Paths",
        kind: "prose",
        body: "Relative paths are resolved through the asset and mod system (and writes land in the mods folder). Pass <code>absolute = true</code> to work with a raw filesystem path instead.",
      },
      API({
        id: "getTextFromFile",
        signature: "getTextFromFile(path)",
        params: [["path","String","Text file path (resolved through the asset/mod system)"]],
        returns: "String — file contents, or nil if not found",
        description: "Reads a text file and returns its contents.",
        code: { lang: "lua", source: `local txt = getTextFromFile('data/dialogue.txt')` },
      }),
      API({
        id: "saveFile",
        signature: "saveFile(path, content, ?absolute)",
        params: [["path","String","Destination path; relative paths are written under the mods folder"],["content","String","Text content to write"],["absolute","Bool","Treat <code>path</code> as a raw filesystem path","default false"]],
        returns: "Bool — <code>true</code> on success",
        description: "Writes text content to a file.",
        code: { lang: "lua", source: `saveFile('saves/notes.txt', 'hello world')` },
      }),
      API({
        id: "deleteFile",
        signature: "deleteFile(path, ?ignoreModFolders)",
        params: [["path","String","File path to delete"],["ignoreModFolders","Bool","Skip mod folders and use the asset path","default false"]],
        returns: "Bool — <code>true</code> if a file was deleted",
        description: "Deletes a file.",
        code: { lang: "lua", source: `deleteFile('saves/notes.txt')` },
      }),
      API({
        id: "directoryFileList",
        signature: "directoryFileList(folder)",
        params: [["folder","String","Folder path to list"]],
        returns: "Array&lt;String&gt; — file & folder names",
        description: "Returns the names of everything inside a folder (empty if it doesn't exist).",
        code: { lang: "lua", source: `for i, f in ipairs(directoryFileList('mods/myMod/images')) do
    print(f)
end` },
      }),
      API({
        id: "checkFileExists",
        signature: "checkFileExists(filename, ?absolute)",
        params: [["filename","String","File path to check"],["absolute","Bool","Treat <code>filename</code> as a raw filesystem path","default false"]],
        returns: "Bool",
        description: "Returns <code>true</code> if the file exists (checks mod folders and assets unless <code>absolute</code>).",
        code: { lang: "lua", source: `if checkFileExists('data/extra.json') then
    print('found it')
end` },
      }),
    ],
  },

  /* ---------------- SE: Precaching ---------------- */
  "se-precache": {
    title: "Precaching",
    category: "API Reference",
    subtitle: "Preload assets to prevent runtime stutters.",
    sections: [
      {
        id: "intro",
        title: "Why precache",
        kind: "prose",
        body: "Loading an asset the first time it's used can cause a brief hitch. Precaching during <code>onCreate</code> loads it up front so the first real use is smooth.",
      },
      API({
        id: "precacheImage",
        signature: "precacheImage(name)",
        params: [["name","String","Image path (no extension), resolved through <code>Paths.image</code>"]],
        returns: "Void",
        description: "Loads an image into the cache ahead of time.",
        code: { lang: "lua", source: `precacheImage('characters/special')` },
      }),
      API({
        id: "precacheSound",
        signature: "precacheSound(name)",
        params: [["name","String","Sound path (no extension)"]],
        returns: "Void",
        description: "Loads a sound into the cache ahead of time.",
        code: { lang: "lua", source: `precacheSound('cancelMenu')` },
      }),
      API({
        id: "precacheMusic",
        signature: "precacheMusic(name)",
        params: [["name","String","Music path (no extension)"]],
        returns: "Void",
        description: "Loads a music track into the cache ahead of time.",
        code: { lang: "lua", source: `precacheMusic('breakfast')` },
      }),
      API({
        id: "addCharacterToList",
        signature: "addCharacterToList(name, type)",
        params: [["name","String","Character JSON name"],["type","String","<code>'dad'</code>, <code>'gf'</code>/<code>'girlfriend'</code>, or anything else for the player"]],
        returns: "Void",
        description: "Preloads a character so it can be swapped in instantly mid-song.",
        code: { lang: "lua", source: `addCharacterToList('pico-speaker', 'dad')` },
      }),
    ],
  },

  /* ---------------- SE: Mobile Functions ---------------- */
  "se-mobile": {
    title: "Mobile Functions",
    category: "API Reference",
    subtitle: "Mobile-specific functions for touch input, touch controls, and device detection.",
    sections: [
      {
        id: "control-vars",
        title: "Control mode",
        kind: "prose",
        body: `Two read-only globals describe the active mobile control scheme:
<table class="tbl">
  <thead><tr><th>Variable</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>mobileC</code></td><td>Bool</td><td>Whether mobile controls are active (<code>Controls.instance.mobileC</code>)</td></tr>
    <tr><td><code>mobileControlsMode</code></td><td>String</td><td>Current mode name: <code>'left'</code>, <code>'right'</code>, <code>'custom'</code>, <code>'hitbox'</code>, <code>'none'</code>, or <code>'unknown'</code></td></tr>
  </tbody>
</table>`,
      },
      {
        id: "extra-buttons",
        title: "Extra buttons",
        kind: "prose",
        body: "Poll the extra action buttons. The <code>button</code> argument is <code>'second'</code> for the second extra button, or anything else for the first.",
      },
      API({
        id: "extraButtonPressed",
        signature: "extraButtonPressed(button)",
        params: [["button","String","<code>'second'</code> or default for the first"]],
        returns: "Bool",
        description: "Whether an extra action button is currently held.",
        code: { lang: "lua", source: `if extraButtonPressed('second') then end` },
      }),
      API({
        id: "extraButtonJustPressed",
        signature: "extraButtonJustPressed(button)",
        params: [["button","String","<code>'second'</code> or default for the first"]],
        returns: "Bool",
        description: "Whether an extra button was pressed this frame.",
        code: { lang: "lua", source: `if extraButtonJustPressed('second') then end` },
      }),
      API({
        id: "extraButtonJustReleased",
        signature: "extraButtonJustReleased(button)",
        params: [["button","String","<code>'second'</code> or default for the first"]],
        returns: "Bool",
        description: "Whether an extra button was released this frame.",
        code: { lang: "lua", source: `if extraButtonJustReleased('second') then end` },
      }),
      API({
        id: "extraButtonReleased",
        signature: "extraButtonReleased(button)",
        params: [["button","String","<code>'second'</code> or default for the first"]],
        returns: "Bool",
        description: "Whether an extra button is not held.",
        code: { lang: "lua", source: `if extraButtonReleased('second') then end` },
      }),
      {
        id: "touchpad",
        title: "Touchpad",
        kind: "prose",
        body: "Create and poll an on-screen touchpad (D-pad + action buttons).",
      },
      API({
        id: "addTouchPad",
        signature: "addTouchPad(DPadMode, ActionMode)",
        params: [["DPadMode","String","D-pad layout, e.g. <code>'LEFT_FULL'</code>, <code>'UP_DOWN'</code>, <code>'NONE'</code>"],["ActionMode","String","Action-button layout, e.g. <code>'A'</code>, <code>'A_B'</code>, <code>'NONE'</code>"]],
        returns: "Void",
        description: "Creates an on-screen touchpad with the given D-pad and action-button layouts.",
        code: { lang: "lua", source: `addTouchPad('LEFT_FULL', 'A_B')` },
      }),
      API({
        id: "removeTouchPad",
        signature: "removeTouchPad()",
        params: [],
        returns: "Void",
        description: "Removes the on-screen touchpad.",
        code: { lang: "lua", source: `removeTouchPad()` },
      }),
      API({
        id: "addTouchPadCamera",
        signature: "addTouchPadCamera(?defaultDrawTarget)",
        params: [["defaultDrawTarget","Bool","Use the touchpad camera as a default draw target","default false"]],
        returns: "Void",
        description: "Adds a dedicated camera so the touchpad renders above the scene. Call after <code>addTouchPad</code>.",
        code: { lang: "lua", source: `addTouchPad('LEFT_FULL', 'A_B')
addTouchPadCamera()` },
      }),
      API({
        id: "touchPadJustPressed",
        signature: "touchPadJustPressed(button)",
        params: [["button","String","Touchpad button name, e.g. <code>'A'</code>, <code>'LEFT'</code>"]],
        returns: "Bool",
        description: "Whether a touchpad button was pressed this frame.",
        code: { lang: "lua", source: `if touchPadJustPressed('A') then end` },
      }),
      API({
        id: "touchPadPressed",
        signature: "touchPadPressed(button)",
        params: [["button","String","Touchpad button name"]],
        returns: "Bool",
        description: "Whether a touchpad button is currently held.",
        code: { lang: "lua", source: `if touchPadPressed('LEFT') then end` },
      }),
      API({
        id: "touchPadJustReleased",
        signature: "touchPadJustReleased(button)",
        params: [["button","String","Touchpad button name"]],
        returns: "Bool",
        description: "Whether a touchpad button was released this frame.",
        code: { lang: "lua", source: `if touchPadJustReleased('A') then end` },
      }),
      API({
        id: "touchPadReleased",
        signature: "touchPadReleased(button)",
        params: [["button","String","Touchpad button name"]],
        returns: "Bool",
        description: "Whether a touchpad button is not held.",
        code: { lang: "lua", source: `if touchPadReleased('A') then end` },
      }),
      {
        id: "raw-touch",
        title: "Raw touch",
        kind: "prose",
        body: "Poll for any screen touch, anywhere. Bound directly to <code>TouchUtil</code>.",
      },
      API({
        id: "touchJustPressed",
        signature: "touchJustPressed()",
        params: [],
        returns: "Bool",
        description: "Whether the screen was touched this frame.",
        code: { lang: "lua", source: `if touchJustPressed() then end` },
      }),
      API({
        id: "touchPressed",
        signature: "touchPressed()",
        params: [],
        returns: "Bool",
        description: "Whether the screen is currently being touched.",
        code: { lang: "lua", source: `if touchPressed() then end` },
      }),
      API({
        id: "touchJustReleased",
        signature: "touchJustReleased()",
        params: [],
        returns: "Bool",
        description: "Whether a touch was released this frame.",
        code: { lang: "lua", source: `if touchJustReleased() then end` },
      }),
      API({
        id: "touchReleased",
        signature: "touchReleased()",
        params: [],
        returns: "Bool",
        description: "Whether the screen is not being touched.",
        code: { lang: "lua", source: `if touchReleased() then end` },
      }),
      {
        id: "touch-objects",
        title: "Touch on objects",
        kind: "prose",
        body: "Test a touch against a specific sprite. The <code>...Complex</code> variants use a rotation-aware overlap test; <code>touchOverlaps...</code> ignores press state.",
      },
      API({
        id: "touchPressedObject",
        signature: "touchPressedObject(object, ?camera)",
        params: [["object","String","Sprite tag to test against"],["camera","String","Camera whose space to use for the hit test","optional"]],
        returns: "Bool",
        description: "Whether a touch is held on this object.",
        code: { lang: "lua", source: `if touchPressedObject('playButton') then end` },
      }),
      API({
        id: "touchJustPressedObject",
        signature: "touchJustPressedObject(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Whether a touch was pressed on this object this frame.",
        code: { lang: "lua", source: `if touchJustPressedObject('playButton') then end` },
      }),
      API({
        id: "touchJustReleasedObject",
        signature: "touchJustReleasedObject(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Whether a touch was released over this object this frame.",
        code: { lang: "lua", source: `if touchJustReleasedObject('playButton') then end` },
      }),
      API({
        id: "touchReleasedObject",
        signature: "touchReleasedObject(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Whether a touch is released (not held) over this object.",
        code: { lang: "lua", source: `if touchReleasedObject('playButton') then end` },
      }),
      API({
        id: "touchPressedObjectComplex",
        signature: "touchPressedObjectComplex(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Rotation-aware version of <code>touchPressedObject</code>.",
        code: { lang: "lua", source: `if touchPressedObjectComplex('arrow') then end` },
      }),
      API({
        id: "touchJustPressedObjectComplex",
        signature: "touchJustPressedObjectComplex(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Rotation-aware version of <code>touchJustPressedObject</code>.",
        code: { lang: "lua", source: `if touchJustPressedObjectComplex('arrow') then end` },
      }),
      API({
        id: "touchJustReleasedObjectComplex",
        signature: "touchJustReleasedObjectComplex(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Rotation-aware version of <code>touchJustReleasedObject</code>.",
        code: { lang: "lua", source: `if touchJustReleasedObjectComplex('arrow') then end` },
      }),
      API({
        id: "touchReleasedObjectComplex",
        signature: "touchReleasedObjectComplex(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Rotation-aware version of <code>touchReleasedObject</code>.",
        code: { lang: "lua", source: `if touchReleasedObjectComplex('arrow') then end` },
      }),
      API({
        id: "touchOverlapsObject",
        signature: "touchOverlapsObject(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Whether a touch point is currently over this object, regardless of press state.",
        code: { lang: "lua", source: `if touchOverlapsObject('hitZone') then end` },
      }),
      API({
        id: "touchOverlapsObjectComplex",
        signature: "touchOverlapsObjectComplex(object, ?camera)",
        params: [["object","String","Sprite tag"],["camera","String","Camera for the hit test","optional"]],
        returns: "Bool",
        description: "Rotation-aware version of <code>touchOverlapsObject</code>.",
        code: { lang: "lua", source: `if touchOverlapsObjectComplex('hitZone') then end` },
      }),
      {
        id: "haptics",
        title: "Haptics",
        kind: "prose",
        body: "Trigger device vibration.",
      },
      API({
        id: "vibrate",
        signature: "vibrate(?duration, ?period)",
        params: [["duration","Int","Vibration length in milliseconds (nothing happens if omitted)","optional"],["period","Int","Delay before the vibration in milliseconds","default 0"]],
        returns: "Void",
        description: "Triggers a device vibration.",
        code: { lang: "lua", source: `vibrate(200)` },
      }),
      {
        id: "android",
        title: "Android",
        kind: "prose",
        body: `Android-only device-detection globals (read-only booleans):
<table class="tbl">
  <thead><tr><th>Variable</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>isAndroidTV</code></td><td>Is the device an Android TV?</td></tr>
    <tr><td><code>isTablet</code></td><td>Is the device a tablet?</td></tr>
    <tr><td><code>isChromebook</code></td><td>Is the device a Chromebook?</td></tr>
    <tr><td><code>isDeXMode</code></td><td>Is Samsung DeX active?</td></tr>
    <tr><td><code>isDolbyAtmos</code></td><td>Does the device support Dolby Atmos?</td></tr>
    <tr><td><code>backJustPressed</code> / <code>backPressed</code> / <code>backJustReleased</code></td><td>Android back-button states</td></tr>
    <tr><td><code>menuJustPressed</code> / <code>menuPressed</code> / <code>menuJustReleased</code></td><td>Android menu-button states</td></tr>
  </tbody>
</table>`,
      },
      API({
        id: "minimizeWindow",
        signature: "minimizeWindow()",
        params: [],
        returns: "Void",
        description: "Minimizes the app (Android only).",
        code: { lang: "lua", source: `minimizeWindow()` },
      }),
      API({
        id: "showToast",
        signature: "showToast(text, duration, ?xOffset, ?yOffset)",
        params: [["text","String","Message to show"],["duration","Int","How long to show it (Android toast length)"],["xOffset","Int","Horizontal offset","default 0"],["yOffset","Int","Vertical offset","default 0"]],
        returns: "Void",
        description: "Shows an Android toast notification.",
        code: { lang: "lua", source: `showToast('Saved!', 1)` },
      }),
    ],
  },

  /* ---------------- SE: Video Functions ---------------- */
  "se-video": {
    title: "Video Functions",
    category: "API Reference",
    subtitle: "Play, pause, and control video sprites from Lua. Each video is identified by a string <code>tag</code> and fires <code>onVideoFinished(tag)</code> when playback ends.",
    sections: [
      {
        id: "playback",
        title: "Playback",
        kind: "prose",
        body: "Start, stop, and control video playback.",
      },
      API({
        id: "playLuaVideoSprite",
        signature: "playLuaVideoSprite(tag, path, ?x, ?y, ?front)",
        params: [["tag","String","Unique video identifier"],["path","String","Video file path under <code>videos/</code> (no extension)"],["x","Float","X position","default 0"],["y","Float","Y position","default 0"],["front","Bool","If true, renders on top of all sprites","default false"]],
        returns: "Void",
        description: "Plays a video. Re-using a tag removes the previous video first. Fires <code>onVideoFinished(tag)</code> when the video ends.",
        code: { lang: "lua", source: `playLuaVideoSprite('intro', 'cutscenes/intro', 0, 0, true)` },
      }),
      API({
        id: "pauseLuaVideo",
        signature: "pauseLuaVideo(tag)",
        params: [["tag","String","Tag of the video to pause"]],
        returns: "Void",
        description: "Pauses a playing video. Does nothing if the video doesn't exist.",
        code: { lang: "lua", source: `pauseLuaVideo('intro')` },
      }),
      API({
        id: "resumeLuaVideo",
        signature: "resumeLuaVideo(tag)",
        params: [["tag","String","Tag of the video to resume"]],
        returns: "Void",
        description: "Resumes a paused video. Does nothing if the video doesn't exist.",
        code: { lang: "lua", source: `resumeLuaVideo('intro')` },
      }),
      API({
        id: "removeLuaVideo",
        signature: "removeLuaVideo(tag)",
        params: [["tag","String","Tag of the video to remove"]],
        returns: "Void",
        description: "Removes a video from the display and destroys it.",
        code: { lang: "lua", source: `removeLuaVideo('intro')` },
      }),
      API({
        id: "forceRemoveLuaVideo",
        signature: "forceRemoveLuaVideo(tag)",
        params: [["tag","String","Tag of the video to forcibly remove"]],
        returns: "Void",
        description: "Immediately removes a video from the display and destroys it, bypassing any safety delays.",
        code: { lang: "lua", source: `forceRemoveLuaVideo('intro')` },
      }),
      {
        id: "queries",
        title: "Queries",
        kind: "prose",
        body: "Check existence and playback state.",
      },
      API({
        id: "luaVideoExists",
        signature: "luaVideoExists(tag)",
        params: [["tag","String","Tag to check"]],
        returns: "Bool",
        description: "Returns <code>true</code> if a video with this tag currently exists.",
        code: { lang: "lua", source: `if luaVideoExists('intro') then
    removeLuaVideo('intro')
end` },
      }),
      API({
        id: "isLuaVideoPlaying",
        signature: "isLuaVideoPlaying(tag)",
        params: [["tag","String","Tag to check"]],
        returns: "Bool",
        description: "Returns <code>true</code> if the video is currently playing.",
        code: { lang: "lua", source: `if isLuaVideoPlaying('intro') then
    pauseLuaVideo('intro')
end` },
      }),
      {
        id: "volume",
        title: "Volume, time & rate",
        kind: "prose",
        body: "Read and write a video's volume, playback position, and playback speed.",
      },
      API({
        id: "setLuaVideoVolume",
        signature: "setLuaVideoVolume(tag, volume)",
        params: [["tag","String","Tag of the video"],["volume","Float","Volume 0–1"]],
        returns: "Void",
        description: "Sets the volume of a video.",
        code: { lang: "lua", source: `setLuaVideoVolume('intro', 0.5)` },
      }),
      API({
        id: "getLuaVideoDuration",
        signature: "getLuaVideoDuration(tag)",
        params: [["tag","String","Tag of the video"]],
        returns: "Float — duration in seconds (0 if not found)",
        description: "Returns the total duration of a video in seconds.",
        code: { lang: "lua", source: `local dur = getLuaVideoDuration('intro')` },
      }),
      API({
        id: "getLuaVideoTime",
        signature: "getLuaVideoTime(tag)",
        params: [["tag","String","Tag of the video"]],
        returns: "Float — current position in seconds (0 if not found)",
        description: "Returns the current playback position of a video in seconds.",
        code: { lang: "lua", source: `local t = getLuaVideoTime('intro')` },
      }),
      API({
        id: "setLuaVideoRate",
        signature: "setLuaVideoRate(tag, rate)",
        params: [["tag","String","Tag of the video"],["rate","Float","Playback speed multiplier (1 = normal)"]],
        returns: "Void",
        description: "Sets the playback speed of a video.",
        code: { lang: "lua", source: `setLuaVideoRate('intro', 1.5)` },
      }),
      API({
        id: "getLuaVideoRate",
        signature: "getLuaVideoRate(tag)",
        params: [["tag","String","Tag of the video"]],
        returns: "Float — playback speed multiplier (1.0 if not found)",
        description: "Returns the current playback speed multiplier of a video.",
        code: { lang: "lua", source: `local r = getLuaVideoRate('intro')` },
      }),
    ],
  },

  /* ---------------- SE: Discord RPC ---------------- */
  "se-discord": {
    title: "Discord RPC",
    category: "API Reference",
    subtitle: "Discord Rich Presence integration.",
    sections: [
      {
        id: "intro",
        title: "Overview",
        kind: "prose",
        body: "Update what the player's Discord profile shows while they play. Requires Discord Rich Presence to be compiled in and the user to have Discord running.",
      },
      API({
        id: "changeDiscordPresence",
        signature: "changeDiscordPresence(details, state, ?smallImageKey, ?hasStartTimestamp, ?endTimestamp)",
        params: [["details","String","Top line — what the player is doing"],["state","String","Second line; may be nil"],["smallImageKey","String","Key of a small image to overlay on the art","optional"],["hasStartTimestamp","Bool","Show elapsed time counting up from now","optional"],["endTimestamp","Float","Unix time to count down to (used with <code>hasStartTimestamp</code>)","optional"]],
        returns: "Void",
        description: "Updates the Discord Rich Presence shown on the player's profile.",
        code: { lang: "lua", source: `changeDiscordPresence('Playing a custom song', 'Hard difficulty')` },
      }),
      API({
        id: "changeDiscordClientID",
        signature: "changeDiscordClientID(?id)",
        params: [["id","String","New Discord application client ID; omit to restore the default","optional"]],
        returns: "Void",
        description: "Changes the Discord application the Rich Presence connects to, which controls the app name and art assets.",
        code: { lang: "lua", source: `changeDiscordClientID('1482658467125661818')` },
      }),
    ],
  },

  /* ---------------- SE: Deprecated Functions ---------------- */
  "se-deprecated": {
    title: "Deprecated Functions",
    category: "API Reference",
    subtitle: "Old function names from earlier API versions, kept for backward compatibility. They still work but will show a deprecation warning if <code>luaDeprecatedWarnings</code> is enabled.",
    sections: [
      {
        id: "functions",
        title: "Function reference",
        kind: "prose",
        body: `<p>These older function names still work but emit deprecation warnings. Replace them with the modern equivalents:</p>
<table class="tbl">
  <thead><tr><th>Deprecated</th><th>Replacement</th></tr></thead>
  <tbody>
    <tr><td><code>addAnimationByIndicesLoop(obj, name, prefix, indices, framerate)</code></td><td><code>addAnimationByIndices(obj, name, prefix, indices, framerate, loop)</code></td></tr>
    <tr><td><code>objectPlayAnimation(obj, name, forced, ?startFrame)</code></td><td><code>playAnim(obj, name, forced, ?reverse, ?startFrame)</code></td></tr>
    <tr><td><code>characterPlayAnim(character, anim, ?forced)</code></td><td><code>playAnim('boyfriend'/'dad'/'gf', anim, forced)</code></td></tr>
    <tr><td><code>luaSpriteMakeGraphic(tag, width, height, color)</code></td><td><code>makeGraphic(obj, width, height, color)</code></td></tr>
    <tr><td><code>luaSpriteAddAnimationByPrefix(tag, name, prefix, framerate, loop)</code></td><td><code>addAnimationByPrefix(obj, name, prefix, framerate, loop)</code></td></tr>
    <tr><td><code>luaSpriteAddAnimationByIndices(tag, name, prefix, indices, framerate)</code></td><td><code>addAnimationByIndices(obj, name, prefix, indices, framerate, loop)</code></td></tr>
    <tr><td><code>luaSpritePlayAnimation(tag, name, forced)</code></td><td><code>playAnim(obj, name, forced)</code></td></tr>
    <tr><td><code>setLuaSpriteCamera(tag, camera)</code></td><td><code>setObjectCamera(obj, camera)</code></td></tr>
    <tr><td><code>setLuaSpriteScrollFactor(tag, scrollX, scrollY)</code></td><td><code>setScrollFactor(obj, scrollX, scrollY)</code></td></tr>
    <tr><td><code>scaleLuaSprite(tag, x, y)</code></td><td><code>scaleObject(obj, x, y, ?updateHitbox)</code></td></tr>
    <tr><td><code>getPropertyLuaSprite(tag, variable)</code></td><td><code>getProperty(variable)</code></td></tr>
    <tr><td><code>setPropertyLuaSprite(tag, variable, value)</code></td><td><code>setProperty(variable, value)</code></td></tr>
    <tr><td><code>musicFadeIn(duration, ?fromValue, ?toValue)</code></td><td><code>soundFadeIn(?tag, duration, ?fromValue, ?toValue)</code></td></tr>
    <tr><td><code>musicFadeOut(duration, ?toValue)</code></td><td><code>soundFadeOut(?tag, duration, ?toValue)</code></td></tr>
  </tbody>
</table>`,
      },
    ],
  },
};

window.NAV = NAV;
window.PAGES = PAGES;

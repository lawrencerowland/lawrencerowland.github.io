; Building Site Swimming Pool and Gym Simulation
; Author: ChatGPT
; Date: 25 July 2025
;
; This NetLogo model represents an illustrative 24-hour usage and occupancy
; profile of a small construction site that is approximately half way
; through the build of an indoor swimming pool and adjacent gym.  Each
; tick in the simulation corresponds to a single simulated minute,
; so a complete day is 1 440 ticks.  Workers arrive in the morning,
; take a lunch break, resume work in the afternoon and depart in the
; evening.  Delivery vehicles periodically enter the site to drop off
; materials.  The model tracks occupancy in each zone (pool area,
; gym area, break area and walkways) so that plots and monitors can
; display how busy different parts of the site are throughout the day.

extensions []
patches-own [area-type]

;; turtles-own and breed declarations
breed [workers worker]
workers-own [
  role           ;; "pool", "gym" or "guard"
  state          ;; "working", "break" or "leaving"
]

breed [vehicles vehicle]
vehicles-own [
  target-area      ;; "pool" or "gym"
  remaining-time   ;; countdown until departure (in minutes)
]

globals [
  ;; current time in minutes from midnight (0–1439)
  current-time
  ;; log lists recording occupancy over time (for optional plots)
  pool-occupancy
  gym-occupancy
  break-occupancy
  walkway-occupancy
]

;;; SETUP PROCEDURES

to setup
  clear-all
  set current-time 0             ;; one full day, midnight to midnight
  set pool-occupancy []
  set gym-occupancy []
  set break-occupancy []
  set walkway-occupancy []
  ;; num-workers is supplied by the interface slider.
  setup-areas
  setup-guard
  reset-ticks
end

;; create coloured zones on the patch grid.  The world is divided
;; into four rectangular quadrants separated by a central walkway.  A
;; single patch on the far left serves as the entrance where workers
;; and vehicles arrive.

to setup-areas
  ask patches [
    set area-type "walkway"
    set pcolor gray - 1
    if pxcor = min-pxcor and pycor = 0 [
      set area-type "entrance"
      set pcolor brown + 3
    ]
    if pxcor > 0 and pycor > 0 [
      set area-type "pool"
      set pcolor cyan - 2
    ]
    if pxcor > 0 and pycor < 0 [
      set area-type "gym"
      set pcolor yellow + 3
    ]
    if pxcor < 0 and pycor > 0 [
      set area-type "break"
      set pcolor green + 1
    ]
    if pxcor < 0 and pycor < 0 [
      set area-type "storage"
      set pcolor gray + 2
    ]
  ]
end

;; create workers at the start of the shift.  Assign each worker a
;; random role – roughly half will work on the pool and half on the
;; gym.  They appear at the entrance and immediately walk to their
;; designated zone.

to setup-workers
  create-workers num-workers [
    set color orange
    set size 0.8
    set role (ifelse-value random 2 = 0 ["pool"] ["gym"])
    set state "working"
    move-to entrance-patch
  ]
end

to setup-guard
  create-workers 1 [
    set color blue
    set size 0.8
    set role "guard"
    set state "working"
    move-to entrance-patch
  ]
end

;; reporter that returns the patch at the site entrance.  Workers and
;; vehicles spawn here.

to-report entrance-patch
  report patch min-pxcor 0
end

;;; MAIN PROCEDURE

to go
  ;; end the simulation at midnight (24 × 60 minutes)
  if current-time >= 1440 [ stop ]

  ;; handle scheduled events
  if current-time = 360 [
    ask workers with [role = "guard"] [ die ]
    setup-workers
  ]
  if current-time = 1020 [
    ask workers with [role != "guard"] [ set state "leaving" ]
  ]
  if current-time = 1260 [ setup-guard ]
  if current-time = 720 [
    ask workers with [role != "guard"] [ set state "break" ]
  ]
  if current-time = 780 [
    ask workers with [role != "guard"] [ set state "working" ]
  ]

  ;; randomly create delivery vehicles.  On average one delivery
  ;; arrives every two hours.  Vehicles choose a target area at random
  ;; and remain parked for 30‑60 minutes once they arrive.
  maybe-spawn-delivery

  ask workers [ perform-work ]
  ask vehicles [ perform-delivery ]

  ;; log occupancy for optional plots
  set pool-occupancy lput (count workers with [ [area-type] of patch-here = "pool" ]) pool-occupancy
  set gym-occupancy lput (count workers with [ [area-type] of patch-here = "gym" ]) gym-occupancy
  set break-occupancy lput (count workers with [ [area-type] of patch-here = "break" ]) break-occupancy
  set walkway-occupancy lput (count workers with [ [area-type] of patch-here = "walkway" ]) walkway-occupancy

  set current-time current-time + 1
  tick
end

;;; WORKER BEHAVIOUR

;; workers perform patrols, breaks and work according to their role.
;; security guard patrols walkways all night.

to perform-work  ;; turtle procedure
  if state = "leaving" [
    ifelse patch-here = entrance-patch [ die ] [ go-to-zone "entrance" ]
    stop
  ]
  ;; security guard patrols walkways all night
  if role = "guard" [
    ;; choose a neighbouring patch on the walkway and move there
    let choices neighbors4 with [area-type = "walkway"]
    if any? choices [ move-to one-of choices ]
    stop
  ]
  ;; lunch break: head to the break area and wander there
  if state = "break" [
    ifelse [area-type] of patch-here != "break" [
      go-to-zone "break"
    ] [ wander-within "break" ]
    stop
  ]
  ;; working: head to assigned zone if not already there
  ifelse [area-type] of patch-here != role [
    go-to-zone role
  ] [ wander-within role ]
end

;;; VEHICLE BEHAVIOUR

;; randomly create delivery vehicles (see go procedure)

to maybe-spawn-delivery
  if current-time >= 360 and current-time < 990 and random-float 1.0 < 1 / 120 [
    create-vehicles 1 [
      set color red
      set size 1.2
      set target-area (ifelse-value random 2 = 0 ["pool"] ["gym"])
      set remaining-time 30 + random 31
      move-to entrance-patch
    ]
  ]
end

;; for each tick, vehicles move towards their target area; once there
;; they wait the specified number of minutes then leave the site.

to perform-delivery  ;; turtle procedure
  if remaining-time <= 0 [
    ifelse patch-here = entrance-patch [ die ] [ go-to-zone "entrance" ]
    stop
  ]
  ifelse [area-type] of patch-here = target-area [
    set remaining-time remaining-time - 1
  ] [
    go-to-zone target-area
  ]
end

;;; MOVEMENT HELPERS

;; Move one neighbouring patch toward the nearest destination patch.
;; The interface disables wrapping. This is geometric movement, not a road,
;; obstacle, collision or capacity model. No artificial teleporting at departure.

to go-to-zone [zone]
  let targets patches with [area-type = zone]
  if any? targets [
    let target min-one-of targets [distance myself]
    let next-patch min-one-of neighbors4 [distance target]
    if next-patch != nobody [ move-to next-patch ]
  ]
end

;; wander randomly within a zone.  Choose a neighbouring patch in
;; the same zone; if none exist the turtle stays put.

to wander-within [zone]
  let dest neighbors4 with [area-type = zone]
  if any? dest [ move-to one-of dest ]
end

;;; OCCUPANCY LOGGING

; The four occupancy lists (pool‑occupancy, gym‑occupancy, break‑occupancy
; and walkway‑occupancy) are logged once per tick in the `go` procedure.
; Users may plot these lists with separate pens to visualise how busy
; each zone is over a virtual day.

to-report clock-time
  let hours floor (current-time / 60)
  let minutes current-time mod 60
  report (word hours ":" ifelse-value (minutes < 10) [(word "0" minutes)] [minutes])
end

;;; MODEL BOUNDARY
; Invented one-day activity rules, not measured site occupancy or safety advice.
; Occupancy counts workers (including the guard), not vehicles.
; Plot/list samples cover 00:00 through 23:59; the final clock reads 24:00.
; No congestion, site geometry, throughput, fatigue, air quality or productivity model.
@#$#@#$#@
GRAPHICS-WINDOW
10
10
440
440
-1
-1
20.0
1
10
1
1
1
0
0
0
1
-10
10
-10
10
1
1
1
ticks
30.0

BUTTON
460
10
550
43
setup
setup
NIL
1
T
OBSERVER
NIL
NIL
NIL
NIL
1

BUTTON
560
10
650
43
go
go
T
1
T
OBSERVER
NIL
NIL
NIL
NIL
0

SLIDER
460
60
650
93
num-workers
num-workers
0
100
8.0
1
1
NIL
HORIZONTAL

MONITOR
460
110
650
155
Clock
clock-time
0
1
11

MONITOR
460
170
550
215
Workers onsite
count workers
0
1
11

MONITOR
560
170
650
215
Vehicles
count vehicles
0
1
11

PLOT
10
460
650
680
Worker occupancy by zone
Minutes from midnight
Workers
0.0
1440.0
0.0
10.0
true
true
"" ""
PENS
"Pool" 1.0 0 -11221820 true "" "if not empty? pool-occupancy [ plotxy (current-time - 1) last pool-occupancy ]"
"Gym" 1.0 0 -1184463 true "" "if not empty? gym-occupancy [ plotxy (current-time - 1) last gym-occupancy ]"
"Break" 1.0 0 -10899396 true "" "if not empty? break-occupancy [ plotxy (current-time - 1) last break-occupancy ]"
"Walkway" 1.0 0 -7500403 true "" "if not empty? walkway-occupancy [ plotxy (current-time - 1) last walkway-occupancy ]"
@#$#@#$#@
## WHAT IS IT?
A toy agent model of worker occupancy during one day on a pool-and-gym construction site. It is not calibrated to a real site.

## HOW TO USE IT
Choose num-workers (default 8), press setup, then go. The model stops after 1,440 one-minute ticks. The clock ends at 24:00. Change the worker slider before setup. Repeated runs use fresh random assignments and deliveries.

## HOW IT WORKS
One guard starts at midnight and leaves at 06:00. The construction crew enters then, heads to randomly assigned pool or gym zones, goes to lunch at 12:00, returns at 13:00, and starts leaving at 17:00. A guard returns at 21:00. No staff are scheduled between the departure of the crew and 21:00.

Deliveries have a 1/120 chance per minute between 06:00 and 16:30. They stay in their target zone for 30 to 60 minutes and then travel back to the entrance. The expected arrival count is a rate, not a guarantee.

Pool is cyan, gym yellow, break green, storage gray, entrance brown, and the central cross is walkway. Workers are orange, the guard blue, vehicles red. Agents move one neighbouring patch each minute. Travel has no congestion or collision constraints; distances are abstract.

## MEASUREMENT
The four plot series and occupancy lists count workers, including the guard, by their current patch. Vehicles, storage and entrance are excluded from those four series; the onsite monitor counts all workers. The first sample is 00:00 and the last 23:59. No productivity, completion, capacity, air-quality or safety conclusions follow from these counts.

## PROVENANCE
Original concept: ChatGPT, 25 July 2025. Format and behavioral repair during React catalogue migration, 2 October 2026. No claimed external funding or empirical validation.
@#$#@#$#@
default
true
0
Polygon -7500403 true true 150 5 40 250 150 205 260 250
@#$#@#$#@
NetLogo 6.4.0
@#$#@#$#@
setup
repeat 780 [ go ]
@#$#@#$#@

@#$#@#$#@

@#$#@#$#@

@#$#@#$#@
default
0.0
-0.2 0 0.0 1.0
0.0 1 1.0 0.0
0.2 0 0.0 1.0
link direction
true
0
Line -7500403 true 150 150 90 180
Line -7500403 true 150 150 210 180
@#$#@#$#@
0
@#$#@#$#@

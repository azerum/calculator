#n - value with index n
->n - shared variable with index n

Expression: 2 + 2 * 2 / 3

## Step 1

Shared variables:
 (none)

Values:
 - 0: 2
 - 1: 2
 - 2: 2
 - 3: 3

Operations queue:
 - #1 * #2
 - #2 / #3
 - #0 + #1

#1 * #2 = 2 * 2 = 4
#1 nor #2 point to a shared variable, so create one with value 4

## Step 2

Shared variables:
 - 0: 4

Values:
 - 0: -2
 - 1: ->0
 - 2: ->0
 - 3: 3

Operations queue:
 - #2 / #3
 - #0 + #1

#2 / #3 = ->0 / #3 = 4/3
#2 already points to a shared variable, so assign the same variable
to #3 and change the shared variable ->0 to 4/3

## Step 3

Shared variables:
 - 0: 4/3

Values:
 - 0: 2
 - 1: ->0
 - 2: ->0
 - 3: ->0

Operations queue:
 - #0 + #1

#0 + #1 = #0 + ->0 = 2 + 4/3
#2 already points to a shared variable, so assign the same variable
to #0 and change the shared variable ->0 to 2 + 4/3

## Step 4


Shared variables:
 - 0: 2 + 4/3

Values:
 - 0: ->0
 - 1: ->0
 - 2: ->0
 - 3: ->0

Operations queue: (none)

Operation queue is empty -- we are done. 
Return any value from `Values`, as they all are pointing to the computed result
of the whole expression -- 2 + 4/3

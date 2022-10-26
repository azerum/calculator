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

Operations queue: 
    (none)

Operation queue is empty -- we are done. 
Return any value from `Values`, as they all are pointing to the computed result
of the whole expression -- 2 + 4/3




# Subexpressions

With parenthesis is it possible to create subexpressions. For example,
in 1 + 2 * (3 + 4), 3 + 4 is a subexpression.

Subexpressions are stored in value table as regular values. Next time
this value is read, subexpression is evaluated recursively, and then
it is replaced with its value

Example: 1 + 2 * (3 + 4)

## Step 1

Shared variables:
 (none)

Values:
 - 0: 1
 - 1: 2
 - 2: (3 + 4)

Operations queue:
 - #1 * #2
 - #0 + #1

#1 * #2. #2 points to a subexpression, so we evaluate it first using the same
method. We will get value 7, so replace entry with index 2 with value 7.

## Step 2

Shared variables:
 (none)

Values:
 - 0: 1
 - 1: 2
 - 2: 7

Operations queue:
 - #1 * #2
 - #0 + #1

Now we can compute operation. #1 * #2 = 2 * 7 = 14. 
#1 nor #2 point to a shared variable, so create one with value 14

## Step 3

Shared variables:
 - 0: 14

Values:
 - 0: 1
 - 1: ->0
 - 2: ->0

Operations queue:
 - #0 + #1

#0 + #1 = 1 + ->0 = 1 + 14 = 15. #1 points to a shared variable, so
point #0 to the same variable and update its value to 15

## Step 4

Shared variables:
 - 0: 15

Values:
 - 0: ->0
 - 1: ->0
 - 2: ->0

Operations queue:
    (none)

Done. The answer is 15

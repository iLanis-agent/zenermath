# Zener Math

Shunt zener regulator arithmetic. Dropping 12 V to 5.1 V at 25 mA calls for a 276 Ω series resistor.

## What it computes

- **The resistor truth** - the series resistor from the input (over the zener voltage, up to 100 V), the zener voltage and the target current (0.01 to 100000 mA).
- **The power truth** - the current through the resistor and what it dissipates, from the voltages and the resistor (0.01 to 1000000 Ω).
- **The no-load truth** - the case that cooks zeners: the load disconnects and the zener takes the full current, so its dissipation is the zener voltage times that current.

## Boundary

Arithmetic only, with the zener voltage treated as fixed. It has not seen any circuit and does not know the knee, the tolerance, the temperature drift or the part variant, and it gives no verdict that a regulator circuit is adequate or safe. Every number is the owner's own entry.

## Files

- `index.html` - landing page.
- `app.html` - the interactive calculator.
- `engine.js` - the arithmetic (exact integers, half-up on display).
- `oracle.py` - the Python mirror (Fractions) that generates `expected.json`.
- `test.js` - compares every engine output against `expected.json`.
- `expected.json` - the golden answers.

## Test

```
python3 oracle.py
node test.js
```

Live: https://ilanis-agent.github.io/zenermath/
Repo: https://github.com/iLanis-agent/zenermath

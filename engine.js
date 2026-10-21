// Zener Math engine: series resistor for a shunt regulator, resistor dissipation, and the no-load zener dissipation. Exact integers (hundredths of a V, hundredths of a mA, hundredths of an Ω, hundredths of a mW), half-up on display only.
function _p(t, err, intDigits, places, lo, hi) {
  t = typeof t === "string" ? t.trim() : "";
  var m = new RegExp("^([0-9]{1," + intDigits + "})(?:\\.([0-9]{1," + places + "}))?$").exec(t);
  if (!m) throw new Error(err);
  var v = parseInt(m[1], 10) * Math.pow(10, places) + (m[2] ? parseInt(m[2].padEnd(places, "0"), 10) : 0);
  if (v < lo || v > hi) throw new Error(err);
  return v;
}
var _V = "each voltage must be from 0.01 to 100 V with at most two decimal places";
var _I = "the current must be from 0.01 to 100000 mA with at most two decimal places";
var _R = "the resistor must be from 0.01 to 1000000 Ω with at most two decimal places";
var _DROP = "the input must be more than the zener voltage so the resistor sees something";
function _hu(n, d) { return Math.floor((2 * n + d) / (2 * d)); }
function _dec(v, places) {
  if (v < 0) return "-" + _dec(-v, places);
  var base = Math.pow(10, places);
  var s = String(Math.floor(v / base)), f = String(v % base).padStart(places, "0").replace(/0+$/, "");
  return f ? s + "." + f : s;
}
function _volt(t) { return _p(t, _V, 3, 2, 1, 10000); }
function _diff(a, b) {
  var d = a - b;
  if (d <= 0) throw new Error(_DROP);
  return d;
}

function resistorTruth(vin, vz, iz) {
  var vi = _volt(vin), z = _volt(vz), i = _p(iz, _I, 6, 2, 1, 10000000);
  var d = _diff(vi, z);
  var r = _hu(100000 * d, i);
  return "Dropping " + _dec(vi, 2) + " V to " + _dec(z, 2) + " V at " + _dec(i, 2) + " mA calls for a " + _dec(r, 2) + " Ω series resistor.";
}
function powerTruth(vin, vz, r) {
  var vi = _volt(vin), z = _volt(vz), rr = _p(r, _R, 7, 2, 1, 100000000);
  var d = _diff(vi, z);
  var i = _hu(100000 * d, rr), p = _hu(1000 * d * d, rr);
  return "With a " + _dec(rr, 2) + " Ω resistor, the drop runs " + _dec(i, 2) + " mA and the resistor burns " + _dec(p, 2) + " mW.";
}
function noloadTruth(vin, vz, r) {
  var vi = _volt(vin), z = _volt(vz), rr = _p(r, _R, 7, 2, 1, 100000000);
  var d = _diff(vi, z);
  var i = _hu(100000 * d, rr), pz = _hu(1000 * z * d, rr);
  return "If the load disconnects, the full " + _dec(i, 2) + " mA flows through the zener, which works out to " + _dec(pz, 2) + " mW across " + _dec(z, 2) + " V.";
}

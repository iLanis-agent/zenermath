import json, random
from fractions import Fraction

def hu(num, den):
    return Fraction((2*num + den) - ((2*num + den) % (2*den)), 2*den)

def dec(v, places=2):
    if v < 0: return "-" + dec(-v, places)
    base = 10**places
    n = v.numerator // v.denominator
    s = str(n // base); f = str(n % base).zfill(places).rstrip("0")
    return s + "." + f if f else s

def s100(n):
    w, f = divmod(n, 100)
    return f"{w}.{f:02d}".rstrip("0").rstrip(".")

def resistor(vi, z, i):
    d = vi - z; assert d > 0
    r = hu(100000*d, i)
    return f"Dropping {dec(Fraction(vi))} V to {dec(Fraction(z))} V at {dec(Fraction(i))} mA calls for a {dec(r)} Ω series resistor."
def power(vi, z, rr):
    d = vi - z; assert d > 0
    i = hu(100000*d, rr); p = hu(1000*d*d, rr)
    return f"With a {dec(Fraction(rr))} Ω resistor, the drop runs {dec(i)} mA and the resistor burns {dec(p)} mW."
def noload(vi, z, rr):
    d = vi - z; assert d > 0
    i = hu(100000*d, rr); pz = hu(1000*z*d, rr)
    return (f"If the load disconnects, the full {dec(i)} mA flows through the zener, "
            f"which works out to {dec(pz)} mW across {dec(Fraction(z))} V.")

random.seed(732)
cases = [
  dict(fn="resistor", args=["12","5.1","25"], expect=resistor(1200,510,2500)),
  dict(fn="power", args=["12","5.1","276"], expect=power(1200,510,27600)),
  dict(fn="noload", args=["12","5.1","276"], expect=noload(1200,510,27600)),
]
for _ in range(30):
    z = random.randint(1,9999); vi = random.randint(z+1,10000); i = random.randint(1,10000000)
    cases.append(dict(fn="resistor", args=[s100(vi),s100(z),s100(i)], expect=resistor(vi,z,i)))
    r = random.randint(1,100000000)
    cases.append(dict(fn="power", args=[s100(vi),s100(z),s100(r)], expect=power(vi,z,r)))
    cases.append(dict(fn="noload", args=[s100(vi),s100(z),s100(r)], expect=noload(vi,z,r)))
errcases = [
  ("resistor", ["5.1","5.1","25"]), ("resistor", ["5","5.1","25"]), ("resistor", ["0","5.1","25"]),
  ("resistor", ["12","5.1","0"]), ("resistor", ["12","5.1","100000.001"]),
  ("power", ["12","12","276"]), ("power", ["12","5.1","0"]), ("noload", ["12","5.1","1000000.001"]),
  ("power", ["100.001","5.1","276"]), ("noload", ["0","5.1","276"]),
]
json.dump({"cases": cases, "errors": errcases}, open("expected.json","w"), ensure_ascii=False, indent=1)
open("expected.json","a").write("\n")
print("expected.json written:", len(cases), "cases")

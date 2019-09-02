
filename = "sample.csv"

with open(filename) as f:
    s = f.read() + '\n' # add trailing new line character

a = repr(s)
k = a.replace('"','\\"');
# 'a,b,c\nd,e,f\ng,h,i\n'

j = open("copythis.txt", "w")
m = k[:(len(k)-1)]
while(m.endswith('n') or m.endswith(',,')):
    m = m[:-2]
k = m + "'";
j.write(k)
j.close()
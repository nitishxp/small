import math
def chunkIt(seq, num):
    avg = int(num)
    out = []
    last = 0.0
    while last < len(seq):
        out.append(seq[int(last):int(last + avg)])
        last += avg
    return out

a = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
no_of_group = "8"
print chunkIt(a,no_of_group)
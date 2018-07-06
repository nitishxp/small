def chunkIt(seq, num):
    avg = len(seq) / float(num)
    out = []
    last = 0.0

    while last < len(seq):
        out.append(seq[int(last):int(last + avg)])
        last += avg
    return out

a = [1,2,3,4,5,1,2,3,4,5,6,6,7,7,78,8,8,8,6,5]
print len(a)/5
group = len(a)/5
print chunkIt(a,group)
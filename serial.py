import operator
shift = '6.0-12.0'
itenary = []

avaiable_time = [
    {
        "time": "0.00-18.30",
        "duration": "2"
    },
    {
        "time": "0.0-23.59",
        "duration": "1"
    }
]


# return possible timeslot
def return_possible_time(start, shift_end, duration):
    a = []
    end = start + duration
    while end <= shift_end:
        a.append([start, end])
        start = start + duration
        end = end + duration
    return a


def blah(time, value, itenary):

    dic = {'p': time, 't': value}
    print dic
    if not len(itenary):
        itenary.append(dic)
        return True, itenary
    ispossible = False
    index = 0
    for c in range(0, len(itenary)):
        cur_start = itenary[c]['t'][0]
        cur_end = itenary[c]['t'][1]
        if value[0] == cur_start:
            return False, itenary
        
        if (value[0] < cur_end and value[1] > cur_start) or (value[0] > cur_end and value[1] < cur_start):
            return False, itenary

        if (cur_start <= value[0] < cur_end ):
            return False, itenary

        ispossible = True

    if (ispossible):
        itenary.insert(c, dic)
        itenary = sorted(itenary, key=lambda k: k['t'][0])
        return True, itenary


for c in avaiable_time:
    start = float(c['time'].split('-')[0])
    end = float(c['time'].split('-')[1])
    shift_start = float(shift.split('-')[0])
    shift_end = float(shift.split('-')[1])
    shift_duration = shift_end - shift_start
    duration = float(c['duration'])
    time = c['time']

    if (duration) > shift_duration:
        continue

    if (start >= shift_start
            and end <= shift_end) or (start < shift_end and
                                      (shift_end < end or end > shift_start)):
        # good to go
        # now calculate the time difference i.e how much it will expand in current itenary
        if (start - shift_start) > 0:
            # print "c"
            # fill the itenary with current start plus duration value
            # value = [start, start + duration]
            timeslot = return_possible_time(start, shift_end, duration)
            # print timeslot
        #
        if (start - shift_start) <= 0:
            # print "d", time
            timeslot = return_possible_time(shift_start, shift_end, duration)
            print timeslot,itenary,'itenaroy'

        for value in timeslot:
            # print value, time
            v = blah(time, value, itenary)
            # print 'v', v
            if v[0]:
                itenary = v[1]            
                break

print itenary
# def chunkIt(seq, num):
#     avg = len(seq) / float(num)
#     out = []
#     last = 0.0

#     while last < len(seq):
#         out.append(seq[int(last):int(last + avg)])
#         last += avg
#     return out

# import random
# a = [1,2]
# random.shuffle(a)
# print chunkIt(a, 2)
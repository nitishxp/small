shift = ['6:00-12:00','12:00-14:00','14:00-18:00','18:00-21:00']
avaiable_time = ['6:30-10','10:00-12:00','14:00-18:00','9:00-21:00','11:00-15:00','18:00-20:00','8:00-18:00']
for c in avaiable_time:
    for d in shift:
        
        # attraction time
        a = c.replace(':','.').split('-')
        a_start_time = float(a[0])
        a_end_time = float(a[1])

        # shift time
        s = d.replace(':','.').split('-')
        s_start_time = float(s[0])
        s_end_time = float(s[1])

        if (a_start_time >= s_start_time and a_end_time <= s_end_time) or (a_start_time < s_end_time and (s_end_time < a_end_time or a_end_time > s_start_time )) :
            print c ,"==============", d